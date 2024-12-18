import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createHash } from 'crypto'
import { SupabaseClient } from '@supabase/supabase-js'

// export const runtime = 'edge'

function generatePostUserIdHash(postId: string, userId: string) {
  if (!userId) {
    return null
  }
  const hash = createHash('sha256').update(`${postId}-${userId}`).digest('hex')
  const fourDigitId = parseInt(hash.substring(0, 8), 16) % 10000
  return fourDigitId.toString().padStart(4, '0')
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
      .from('replies')
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
    
    let content, user_id;
    try {
      ({ content, user_id } = await request.json());
    } catch (error) {
      console.log(error)
      return Response.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    if (!content) {
      return Response.json(
        { error: 'content is required' },
        { status: 400 }
      )
    }

    let threadId = null

    const existingThread = await supabase
      .from('replies')
      .select('thread_id')
      .eq('post_id', id)
      .eq('user_id', user_id)

    // check if the user has already replied to the post at least once
    if (existingThread.data && existingThread.data.length > 0) {
      threadId = existingThread.data[0].thread_id
    } else {
      threadId = await findUniqueThreadId(supabase, id, user_id)
    }

    let threadIdNumber: number | null = null;
    if (threadId) {
      threadIdNumber = Number(threadId);
      if (isNaN(threadIdNumber)) {
        return Response.json(
          { error: 'Invalid thread ID generated' },
          { status: 500 }
        );
      }
    }

    let isAuthor = false
    if (user_id) {
      const author = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', id)
        .eq('user_id', user_id || '')
      if (author.data && author.data.length > 0) {
        isAuthor = true
      }
    }

    const { data, error } = await supabase
      .from('replies')
      .insert({
        post_id: id,
        content,
        user_id: user_id || null,
        thread_id: threadIdNumber,
        is_author: isAuthor
      })
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/posts/[id]/replies/create:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
