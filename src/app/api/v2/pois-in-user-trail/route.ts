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
    const limit_count = searchParams.get("limit_count") ? parseInt(searchParams.get("limit_count")!) : undefined;

    const { data: result, error: postsError } = await supabase.rpc(
      "get_pois_in_user_trail",
      {
        p_user_id: user.id,
        p_limit: limit_count || 100,
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
    console.error("Error processing posts-in-all-viewing-circles request:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
