import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const latitude = searchParams.get('lat')
  const longitude = searchParams.get('lng')
  const range = searchParams.get('range')
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '20')

  if (!latitude || !longitude || !range) {
    return Response.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .gte("lat", parseFloat(latitude) - parseFloat(range))
    .lte("lat", parseFloat(latitude) + parseFloat(range))
    .gte("lng", parseFloat(longitude) - parseFloat(range))
    .lte("lng", parseFloat(longitude) + parseFloat(range))
    .order("created_at", { ascending: false })
    .range((page - 1) * pageSize, (page * pageSize) - 1)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ 
    posts: data,
    page,
    pageSize,
    hasMore: data.length === pageSize 
  })
}
