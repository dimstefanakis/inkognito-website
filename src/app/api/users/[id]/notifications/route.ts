import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const page = request.nextUrl.searchParams.get("page") || 1;
  const limit = request.nextUrl.searchParams.get("limit") || 20;

  const supabase = await createClient();
  const { id } = await params;
  if (!id) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .range((Number(page) - 1) * Number(limit), Number(page) * Number(limit) - 1);
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}
