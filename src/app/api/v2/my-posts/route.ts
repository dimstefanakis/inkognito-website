import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { error: "No authorization token provided" },
      { status: 401 }
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const posts = [];

  const { data, error } = await supabase
    .from("posts_v2")
    .select("*")
    .eq("user_id", user.id);

  for (const post of data || []) {
    const { data: replies, error: repliesError } = await supabase
      .from("replies_v2")
      .select("id, created_at, content, post_id, is_author, thread_id")
      .eq("post_id", post.id)
      .order("created_at", { ascending: false })
      .limit(4);

    const { data: totalReplies, error: totalRepliesError } = await supabase
      .rpc("get_replies_v2_count", { input_post_id: post.id });

    posts.push({
      ...post,
      replies: replies || [],
      reply_count: totalReplies || 0,
    });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: posts });
}
