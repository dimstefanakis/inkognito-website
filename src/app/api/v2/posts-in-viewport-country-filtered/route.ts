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
    
    // Required geographic bounds parameters
    const north_lat = searchParams.get("north_lat");
    const south_lat = searchParams.get("south_lat");
    const east_lng = searchParams.get("east_lng");
    const west_lng = searchParams.get("west_lng");

    // Validate required parameters
    if (!north_lat || !south_lat || !east_lng || !west_lng) {
      return NextResponse.json(
        { error: "Missing required geographic bounds parameters: north_lat, south_lat, east_lng, west_lng" },
        { status: 400 }
      );
    }

    // Parse and validate numeric values
    const northLatNum = parseFloat(north_lat);
    const southLatNum = parseFloat(south_lat);
    const eastLngNum = parseFloat(east_lng);
    const westLngNum = parseFloat(west_lng);

    if (isNaN(northLatNum) || isNaN(southLatNum) || isNaN(eastLngNum) || isNaN(westLngNum)) {
      return NextResponse.json(
        { error: "Geographic bounds parameters must be valid numbers" },
        { status: 400 }
      );
    }

    // Optional parameters
    const limit_count = searchParams.get("limit_count") ? parseInt(searchParams.get("limit_count")!) : undefined;
    const offset_count = searchParams.get("offset_count") ? parseInt(searchParams.get("offset_count")!) : undefined;
    const sort_by = searchParams.get("sort_by");
    const sort_direction = searchParams.get("sort_direction");

    // Call the database function
    const { data: result, error: postsError } = await supabase.rpc(
      "get_posts_v2_in_viewport_country_filtered",
      {
        north_lat: northLatNum,
        south_lat: southLatNum,
        east_lng: eastLngNum,
        west_lng: westLngNum,
        input_user_id: user.id,
        limit_count: limit_count || 100,
        offset_count: offset_count || 0,
        sort_by: sort_by || "created_at",
        sort_direction: sort_direction || "desc",
      }
    );

    if (postsError) {
      console.error('Error fetching posts in viewport country filtered:', postsError);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("Error processing posts-in-viewport-country-filtered request:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
} 