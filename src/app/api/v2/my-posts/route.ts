import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Tables } from "../../../../../types_db";

type MyPost = Omit<
  Tables<"posts_v2">,
  | "geom"
  | "hidden"
  | "last_review_at"
  | "hidden_reason"
  | "moderated_at"
  | "moderation_score"
  | "requires_review"
> & {
  replies: Omit<Tables<"replies_v2">, "user_id" | "upvotes">[];
  reply_count: number;
  gender: string | null;
  like_count: number;
  dislike_count: number;
};

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const authHeader = request.headers.get("authorization") || request.headers.get("x-authorization");
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

  // Extract pagination parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  // Calculate offset
  const offset = (page - 1) * limit;

  // Get total count first
  const { count: totalCount, error: countError } = await supabase
    .from("posts_v2")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (countError) {
    console.error('Error getting post count:', countError);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }

  // Get paginated posts
  const { data, error } = await supabase
    .from("posts_v2")
    .select("*, user_id(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
    .returns<Tables<"posts_v2">[]>();

  if (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }

  const transformedPosts = data?.map((post) => ({
    id: post.id,
    created_at: post.created_at,
    content: post.content,
    lat: post.lat,
    lng: post.lng,
    col: post.col,
    row: post.row,
    country_code: post.country_code,
    country_id: post.country_id,
    poi_id: post.poi_id,
    posted_from_poi: post.posted_from_poi,
    user_id: post.user_id,
    views: post.views,
    notification_message: post.notification_message,
    spiciness_category: post.spiciness_category,
    spiciness_level: post.spiciness_level,
    is_author: true,
    gender: (post.user_id as unknown as Tables<"users_v2">)?.gender || null,
    replies: [],
    reply_count: 0,
    like_count: 0,
    dislike_count: 0,
  }));

  const posts: MyPost[] = [];
  const cleanPosts = transformedPosts || [];

  for (const post of cleanPosts) {
    const { data: repliesData, error: repliesError } = await supabase
      .rpc('get_replies_v2_for_post', {
        input_post_id: post.id,
        sort_by: 'created_at',
        sort_direction: 'desc',
        limit_count: 50,
        offset_count: 0
      });

    const { data: reactionsData, error: reactionsError } = await supabase
      .rpc('get_post_reaction_counts', {
        input_post_id: post.id,
      });

    post.like_count = reactionsData?.[0]?.likes || 0;
    post.dislike_count = reactionsData?.[0]?.dislikes || 0;

    const { data: totalReplies, error: totalRepliesError } = await supabase
      .rpc("get_replies_v2_count", { input_post_id: post.id });

    posts.push({
      ...post,
      replies: repliesData ? repliesData.map((reply) => ({
        id: reply.id,
        created_at: reply.created_at,
        content: reply.content,
        post_id: reply.post_id,
        thread_id: reply.thread_id,
        is_author: reply.is_author,
        gender: reply.gender,
        like_count: reply.like_count || 0,
        dislike_count: reply.dislike_count || 0,
      })) : [],
      reply_count: totalReplies || 0,
    });
  }

  // Calculate pagination metadata
  const totalPages = Math.ceil((totalCount || 0) / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  return NextResponse.json({
    data: posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount: totalCount || 0,
      limit,
      hasNextPage,
      hasPreviousPage,
    },
  });
}
