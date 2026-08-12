import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

import type { Database } from '../../../../../../../../types_db'

function isAuthenticationError(error: {
  code?: string
  message?: string
}): boolean {
  return (
    error.code === 'PGRST301' ||
    error.code === '42501' ||
    /jwt|token|authenticat/i.test(error.message ?? '')
  )
}

function replyErrorResponse(error: {
  code?: string
  hint?: string
  message?: string
}) {
  if (isAuthenticationError(error)) {
    return { status: 401, message: 'Invalid or expired token' }
  }
  if (error.code === 'P0002') {
    return { status: 404, message: 'Post unavailable' }
  }
  if (
    error.hint === 'reply_moderation_backlog_limit' ||
    error.hint === 'reply_moderation_hourly_limit'
  ) {
    return { status: 429, message: 'Too many replies. Try again later.' }
  }
  if (/between 1 and 500 characters/i.test(error.message ?? '')) {
    return { status: 400, message: 'Reply must be between 1 and 500 characters' }
  }
  return { status: 500, message: 'An unexpected error occurred' }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorization =
      request.headers.get('authorization') ??
      request.headers.get('x-authorization')
    const token = authorization?.replace(/^Bearer\s+/i, '')

    if (!token) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }

    const supabaseUrl = process.env.SUPABASE_URL
    const anonKey = process.env.SUPABASE_ANON_KEY
    if (!supabaseUrl || !anonKey) {
      console.error('Reply submission Supabase server configuration is missing')
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      )
    }

    const supabase = createClient<Database>(supabaseUrl, anonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    let content: unknown
    try {
      ;({ content } = await request.json())
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    if (typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: 'content is required' },
        { status: 400 }
      )
    }

    const { id: postId } = await params
    const { data: replyId, error } = await supabase.rpc(
      'create_reply_submission_v1',
      {
        input_post_id: postId,
        input_content: content,
      }
    )

    if (error) {
      console.error('Error creating reply submission:', error)
      const response = replyErrorResponse(error)
      return NextResponse.json(
        { error: response.message },
        { status: response.status }
      )
    }

    return NextResponse.json(
      { id: replyId, status: 'pending' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/v2/posts/[id]/replies/create:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
