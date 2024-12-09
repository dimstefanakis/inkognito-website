import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { content, lat, lng, user_id } = await request.json()

    if (!content || !lat || !lng) {
      return Response.json(
        { error: 'content, lat, and lng are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('posts')
      .insert({
        content,
        lat,
        lng,
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