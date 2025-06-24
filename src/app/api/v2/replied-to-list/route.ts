import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const runtime = "edge";

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

  try {
    // Get all replied posts for the authenticated user
    const { data: allPosts, error } = await supabase
      .rpc("get_user_replied_posts_v2", {
        input_user_id: user.id,
      });

    if (error) {
      console.error('Error fetching replied posts:', error);
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }

    // Calculate pagination
    const totalCount = allPosts?.length || 0;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    // Apply pagination to the results
    const paginatedPosts = allPosts?.slice(offset, offset + limit) || [];

    return NextResponse.json({
      data: paginatedPosts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNextPage,
        hasPreviousPage,
      },
    });

  } catch (error) {
    console.error('Error in GET /api/v2/replied-to-list:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 