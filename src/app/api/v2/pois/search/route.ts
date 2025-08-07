import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const authHeader =
    request.headers.get("authorization") ||
    request.headers.get("x-authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { error: "No authorization token provided" },
      { status: 401 },
    );
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const max_distance_km = searchParams.get("max_distance_km")
      ? parseFloat(searchParams.get("max_distance_km")!)
      : 50;
    const limit_count = searchParams.get("limit_count")
      ? parseInt(searchParams.get("limit_count")!)
      : 50;

    const { data: pois, error: poisError } = await supabase.rpc(
      "search_pois_by_name_and_distance",
      {
        input_user_id: user.id,
        search_term: name ? name.trim() : undefined,
        max_distance_km: max_distance_km,
        poi_limit: limit_count,
      },
    );
    console.log(pois, "pois", poisError)
    if (poisError) {
      console.error("Error searching POIs:", poisError);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 },
      );
    }

    return NextResponse.json(pois || []);
  } catch (error) {
    console.error("Error processing POI search request:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }
}
