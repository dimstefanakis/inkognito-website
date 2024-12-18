import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createHash } from 'crypto'

// export const runtime = 'edge'

function generatePostUserIdHash(postId: string, userId: string) {
  if (!userId) {
    return null
  }
  const hash = createHash('sha256').update(`${postId}-${userId}`).digest('hex')
  const fourDigitId = parseInt(hash.substring(0, 8), 16) % 10000
  return fourDigitId.toString().padStart(4, '0')
}

async function findUniqueThreadId(supabase: any, postId: string, userId: string) {
  let attempts = 0;
  const maxAttempts = 5;

  while (attempts < maxAttempts) {
    const threadId = generatePostUserIdHash(postId, userId + attempts);

    // Check if this thread_id already exists for this post
    const { data: existingThread } = await supabase
      .from('replies')
      .select('thread_id')
      .eq('post_id', postId)
      .eq('thread_id', threadId)
      .single();

    if (!existingThread) {
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
    const { content, user_id } = await request.json()

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
      .single()

    if (existingThread.data) {
      threadId = existingThread.data.thread_id
    } else {
      threadId = await findUniqueThreadId(supabase, id, user_id)
    }

    let threadIdNumber = null
    try {
      if (threadId) {
        threadIdNumber = Number(threadId)
      }
    } catch (error) {
      console.log(error)
    }

    let isAuthor = false
    if (user_id) {
      const author = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', id)
        .eq('user_id', user_id || null)
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
    console.log(error)
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
