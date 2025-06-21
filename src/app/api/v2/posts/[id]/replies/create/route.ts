import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createHash } from 'crypto'
import { SupabaseClient } from '@supabase/supabase-js'

function generatePostUserIdHash(postId: string, userId: string) {
  if (!userId) {
    // Generate a random number between 1000 and 9999
    const randomId = Math.floor(1000 + Math.random() * 9000).toString();
    return randomId;
  }
  const hash = createHash('sha256').update(`${postId}-${userId}`).digest('hex');
  // Ensure the result is between 1000 and 9999
  const fourDigitId = (parseInt(hash.substring(0, 8), 16) % 9000) + 1000;
  return fourDigitId.toString();
} 

async function findUniqueThreadId(
  supabase: SupabaseClient,
  postId: string,
  userId: string | null
) {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const threadId = generatePostUserIdHash(postId, (userId || '') + attempts);

    // Check if this thread_id already exists for this post
    const { data } = await supabase
      .from('replies_v2')
      .select('thread_id')
      .eq('post_id', postId)
      .eq('thread_id', threadId ? threadId : '')

    if (!data || data.length === 0) {
      return threadId;
    }

    attempts++;
  }

  return null; // If we couldn't find a unique ID after max attempts
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params;
    
    const authHeader = request.headers.get("authorization") || request.headers.get("x-authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    let content;
    try {
      ({ content } = await request.json());
    } catch (error) {
      console.log(error)
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      )
    }

    let threadId = null

    const existingThread = await supabase
      .from('replies_v2')
      .select('thread_id')
      .eq('post_id', id)
      .eq('user_id', user.id)

    // check if the user has already replied to the post at least once
    if (existingThread.data && existingThread.data.length > 0) {
      threadId = existingThread.data[0].thread_id
    } else {
      threadId = await findUniqueThreadId(supabase, id, user.id)
    }

    let threadIdNumber: number | null = null;
    if (threadId) {
      threadIdNumber = Number(threadId);
      if (isNaN(threadIdNumber)) {
        return NextResponse.json(
          { error: 'Invalid thread ID generated' },
          { status: 500 }
        );
      }
    }

    let isAuthor = false
    const author = await supabase
      .from('posts_v2')
      .select('user_id')
      .eq('id', id)
      .eq('user_id', user.id)
    if (author.data && author.data.length > 0) {
      isAuthor = true
    }

    const { data, error } = await supabase
      .from('replies_v2')
      .insert({
        post_id: id,
        content,
        user_id: user.id,
        thread_id: threadIdNumber,
        is_author: isAuthor
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/v2/posts/[id]/replies/create:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 