import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params;

  const { data, error } = await supabase.from('posts_public').select('*').eq('id', id).single()
  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  // Use postId in your logic
  return Response.json(data)
}
