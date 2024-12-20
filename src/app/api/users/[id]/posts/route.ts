import { NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { id } = await params;
  if (!id) {
    return Response.json({ error: "User ID is required" }, { status: 400 });
  }
  const { data, error } = await supabase
    .rpc("get_user_posts", {
      input_user_id: id,
    });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}
