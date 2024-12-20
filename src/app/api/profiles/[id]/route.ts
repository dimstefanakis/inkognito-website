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
    .from("profiles")
    .select()
    .eq("user_id", id)

  if (data && data.length > 0) {
    return Response.json(data[0]);
  }
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ error: "Profile not found" }, { status: 404 });
}
