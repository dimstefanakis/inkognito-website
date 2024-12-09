import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { expo_push_token, user_id } = await request.json()

    if (!user_id) {
      return Response.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("profiles")
      .insert({ expo_push_token, user_id })
      .select()

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