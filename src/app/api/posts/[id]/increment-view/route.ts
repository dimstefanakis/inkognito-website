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

    const { data, error } = await supabase
      .rpc('increment_view', { post_id: id })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ data }, { status: 200 })
  } catch (e) {
    return Response.json(
      { error: 'Failed to increment view' },
      { status: 500 }
    )
  }
}
