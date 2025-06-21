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

    // Fetch the viewing circle and verify it belongs to the user
    const { data: viewingCircle, error: circleError } = await supabase
      .from("viewing_circles")
      .select("*")
      .eq("id", viewing_circle_id)
      .eq("user_id", user.id)
      .single();

    if (circleError || !viewingCircle) {
      return NextResponse.json(
        { error: "Viewing circle not found or access denied" },
        { status: 404 }
      );
    }

    let center_lat: number;
    let center_lng: number;

    // Determine coordinates based on viewing circle type
    switch (viewingCircle.type) {
      case "default":
        // Use user's current location
        const { data: userData, error: userDataError } = await supabase
          .from("users_v2")
          .select("lat, lng")
          .eq("id", user.id)
          .single();

        if (userDataError || !userData.lat || !userData.lng) {
          return NextResponse.json(
            { error: "User location not available" },
            { status: 400 }
          );
        }

        center_lat = userData.lat;
        center_lng = userData.lng;
        break;

      case "fixed":
        // Use circle's fixed location
        if (!viewingCircle.lat || !viewingCircle.lng) {
          return NextResponse.json(
            { error: "Circle location not available" },
            { status: 400 }
          );
        }

        center_lat = viewingCircle.lat;
        center_lng = viewingCircle.lng;
        break;

      case "friend_location":
        // Use friend's location
        if (!viewingCircle.friend_user_id) {
          return NextResponse.json(
            { error: "Friend user not specified for this circle" },
            { status: 400 }
          );
        }

        const { data: friendData, error: friendError } = await supabase
          .from("users_v2")
          .select("lat, lng")
          .eq("id", viewingCircle.friend_user_id)
          .single();

        if (friendError || !friendData.lat || !friendData.lng) {
          return NextResponse.json(
            { error: "Friend location not available" },
            { status: 400 }
          );
        }

        center_lat = friendData.lat;
        center_lng = friendData.lng;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid viewing circle type" },
          { status: 400 }
        );
    }

    // Call the database function to get posts in circle
    const { data: posts, error: postsError } = await supabase.rpc(
      "get_posts_v2_in_circle",
      {
        center_lat,
        center_lng,
        radius_km: viewingCircle.radius_km || 5, // Default to 5km if not specified
        limit_count: limit_count || 50,
        offset_count: offset_count || 0,
        sort_by: sort_by || "created_at",
        sort_direction: sort_direction || "desc",
      }
    );

    if (postsError) {
      return NextResponse.json(
        { error: postsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      data: posts,
      circle_info: {
        id: viewingCircle.id,
        type: viewingCircle.type,
        radius_km: viewingCircle.radius_km,
        center_lat,
        center_lng
      }
    });

  } catch (error) {
    console.error("Error processing posts-in-circle request:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
