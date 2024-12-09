import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { data, error } = await supabase
      .from('replies')
      .insert({
        post_id: id,
        content,
        user_id,
      })
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json(data, { status: 201 })
  } catch (e) {
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}
