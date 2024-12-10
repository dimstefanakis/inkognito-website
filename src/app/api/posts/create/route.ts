import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

function validateContent(text: string): { isValid: boolean; error?: string } {
  // Check minimum length
  if (text.trim().length < 10) {
    return {
      isValid: false,
      error: "Confession must be at least a few words"
    }
  }

  // Check for dots-only content
  if (/^[.\s]+$/.test(text)) {
    return {
      isValid: false,
      error: "Dots only confessions are not allowed, put some effort into your confession"
    }
  }

  // Check for social media handles
  if (/@[\w]+/.test(text)) {
    return {
      isValid: false,
      error: "Social media handles are not allowed"
    }
  }

  return { isValid: true }
}

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

    // Add content validation
    const validation = validateContent(content)
    if (!validation.isValid) {
      return Response.json(
        { error: validation.error },
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
  } catch (error) {
    console.log(error)
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}