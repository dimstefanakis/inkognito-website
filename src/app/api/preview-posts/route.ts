import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import type { Database } from '../../../../types_db'
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: posts, error } = await supabase
      .from('posts_public')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ posts })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
