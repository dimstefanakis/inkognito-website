import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')

    if (!lat || !lng) {
      return Response.json(
        { error: 'lat and lng parameters are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const range = 0.009
    const { count, error } = await supabase
      .from("posts")
      .select("", { count: "exact", head: true })
      .gte("lat", parseFloat(lat) - range)
      .lte("lat", parseFloat(lat) + range)
      .gte("lng", parseFloat(lng) - range)
      .lte("lng", parseFloat(lng) + range);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ count })
  } catch (error) {
    console.error(error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
