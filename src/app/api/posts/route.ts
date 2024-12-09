import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function POST(request: NextRequest) {
  const { lat, lng, range } = await request.json();
  
  if (!lat || !lng || !range) {
    return Response.json(
      { error: 'Missing required parameters: latitude, longitude, and range' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .gte("lat", parseFloat(lat) - parseFloat(range))
    .lte("lat", parseFloat(lat) + parseFloat(range))
    .gte("lng", parseFloat(lng) - parseFloat(range))
    .lte("lng", parseFloat(lng) + parseFloat(range))
    .order("created_at", { ascending: false })
    .limit(100)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}
