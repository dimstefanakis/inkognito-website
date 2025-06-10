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

  // Get all viewing circles for the current user
  const { data: viewingCircles, error: circlesError } = await supabase
    .from("viewing_circles")
    .select("*")
    .eq("user_id", user.id);

  if (circlesError) {
    return NextResponse.json({ error: circlesError.message }, { status: 500 });
  }

  // Process circles and fetch friend coordinates for friend_location type
  const processedCircles = await Promise.all(
    (viewingCircles || []).map(async (circle) => {
      // Create a copy of the circle without friend_user_id
      const { friend_user_id, ...circleWithoutFriendId } = circle;

      // If it's a friend_location type and has a friend_user_id, fetch friend's coordinates
      if (circle.type === "friend_location" && circle.friend_user_id) {
        const { data: friendData, error: friendError } = await supabase
          .from("users_v2")
          .select("lat, lng")
          .eq("id", circle.friend_user_id)
          .single();

        if (friendError) {
          console.error("Error fetching friend data:", friendError);
          // Return circle without friend coordinates if there's an error
          return circleWithoutFriendId;
        }

        // Add friend's coordinates to the circle
        return {
          ...circleWithoutFriendId,
          friend_lat: friendData.lat,
          friend_lng: friendData.lng,
        };
      }

      // For all other types, just return the circle without friend_user_id
      return circleWithoutFriendId;
    })
  );

  return NextResponse.json({ data: processedCircles });
}
