import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const userData = await request.json()
    const { data, error } = await supabase
      .from("users")
      .insert({
        ...(userData ? userData : {}),
        is_subscribed: false,
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