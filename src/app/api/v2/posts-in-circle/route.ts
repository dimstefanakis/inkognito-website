import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

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

  try {
    const { searchParams } = new URL(request.url);
    const viewing_circle_id = searchParams.get("viewing_circle_id");
    const limit_count = searchParams.get("limit_count") ? parseInt(searchParams.get("limit_count")!) : undefined;
    const offset_count = searchParams.get("offset_count") ? parseInt(searchParams.get("offset_count")!) : undefined;
    const sort_by = searchParams.get("sort_by");
    const sort_direction = searchParams.get("sort_direction");

    if (!viewing_circle_id) {
      return NextResponse.json(
        { error: "viewing_circle_id is required" },
        { status: 400 }
      );
    }

    // Verify the viewing circle belongs to the user
    const { data: viewingCircle, error: circleError } = await supabase
      .from("viewing_circles")
      .select("id")
      .eq("id", viewing_circle_id)
      .eq("user_id", user.id)
      .single();

    if (circleError || !viewingCircle) {
      return NextResponse.json(
        { error: "Viewing circle not found or access denied" },
        { status: 404 }
      );
    }

    // Call the new database function
    const { data: result, error: postsError } = await supabase.rpc(
      "get_posts_v2_in_viewing_circle",
      {
        circle_id: viewing_circle_id,
        limit_count: limit_count || 50,
        offset_count: offset_count || 0,
        sort_by: sort_by || "created_at",
        sort_direction: sort_direction || "desc",
      }
    );

    if (postsError) {
      console.error('Error fetching posts in circle:', postsError);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error processing posts-in-circle request:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
