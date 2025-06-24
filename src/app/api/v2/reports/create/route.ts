import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
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

    const {
      post_id,
      reply_id,
      reason,
      details
    } = await request.json()

    // Validate required fields
    if (!reason) {
      return NextResponse.json(
        { error: 'reason is required' },
        { status: 400 }
      )
    }

    // Validate that either post_id or reply_id is provided, but not both
    if ((!post_id && !reply_id) || (post_id && reply_id)) {
      return NextResponse.json(
        { error: 'Either post_id or reply_id must be provided, but not both' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('reports_v2')
      .insert({
        post_id,
        reply_id,
        reporter_id: user.id,
        reason,
        details,
        status: 'pending' // Default status for new reports
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
