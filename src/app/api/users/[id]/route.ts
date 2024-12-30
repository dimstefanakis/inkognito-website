import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params;

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("id", id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  if (data && data.length > 0) {
    return Response.json(data[0])
  }

  return Response.json({ error: 'User not found' }, { status: 404 })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { id } = await params;
  const { gender } = await request.json();

  const { data, error } = await supabase
    .from("users")
    .update({
      gender: gender,
    })
    .eq("id", id)

  if (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json(data)
}