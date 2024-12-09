import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const latitude = searchParams.get('latitude')
  const longitude = searchParams.get('longitude')
  const range = searchParams.get('range')

  if (!latitude || !longitude || !range) {
    return Response.json(
      { error: 'Missing required parameters: latitude, longitude, and range' },
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
    .limit(100)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ data })
}
