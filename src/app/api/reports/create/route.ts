import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { 
      post_id, 
      reply_id, 
      reporter_id, 
      reason, 
      details 
    } = await request.json()

    // Validate required fields
    if (!reporter_id || !reason) {
      return Response.json(
        { error: 'reporter_id and reason are required' },
        { status: 400 }
      )
    }

    // Validate that either post_id or reply_id is provided, but not both
    if ((!post_id && !reply_id) || (post_id && reply_id)) {
      return Response.json(
        { error: 'Either post_id or reply_id must be provided, but not both' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('reports')
      .insert({
        post_id,
        reply_id,
        reporter_id,
        reason,
        details,
        status: 'pending' // Default status for new reports
      })
      .select()
      .single()

    if (error) {
      console.log(error)
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
