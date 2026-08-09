import { createClient } from "@/utils/supabase/server";
import { reverseGeocodeCoarseLocation } from "@/lib/postLocation";
import { NextRequest, NextResponse } from "next/server";

function validateContent(text: string): { isValid: boolean; error?: string } {
  // Check minimum length
  if (text.trim().length < 10) {
    return {
      isValid: false,
      error: "Secret must be at least a few words",
    };
  }

  // Check for dots-only content
  if (/^[.\s]+$/.test(text)) {
    return {
      isValid: false,
      error: "Please put some effort into your secret!",
    };
  }

  // Check for social media handles
  if (/@[\w]+/.test(text)) {
    return {
      isValid: false,
      error: "Social media handles are not allowed",
    };
  }

  return { isValid: true };
}

function randomizeCoordinates(
  lat: number,
  lng: number,
  radiusMeters: number = 200
): { lat: number; lng: number } {
  // Convert radius from meters to degrees (approximate)
  const radiusInDegrees = radiusMeters / 111000; // 1 degree ≈ 111km

  // Generate random angle and distance
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusInDegrees;

  // Calculate offset
  const latOffset = distance * Math.cos(angle);
  const lngOffset =
    (distance * Math.sin(angle)) / Math.cos((lat * Math.PI) / 180);

  return {
    lat: lat + latOffset,
    lng: lng + lngOffset,
  };
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization") || request.headers.get("x-authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { error: "No authorization token provided" },
      { status: 401 }
    );
  }

  const supabase = await createClient();

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

  const { data: userData, error: userDataError } = await supabase
    .from("users_v2")
    .select("lat, lng")
    .eq("id", user.id)
    .single();

  if (userDataError) {
    console.error('Error fetching user data:', userDataError);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }

  const body = await request.json();

  // Validate content
  if (typeof body.content !== "string") {
    return NextResponse.json({ error: "Secret content is required" }, { status: 400 });
  }
  const validation = validateContent(body.content);
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const exactLat = Number(userData.lat);
  const exactLng = Number(userData.lng);
  if (
    !Number.isFinite(exactLat) ||
    !Number.isFinite(exactLng) ||
    exactLat < -90 ||
    exactLat > 90 ||
    exactLng < -180 ||
    exactLng > 180
  ) {
    return NextResponse.json({ error: "A valid location is required" }, { status: 400 });
  }

  let coarseLocation = null;
  const mapboxToken = process.env.MAPBOX_POST_LOCATION_TOKEN;
  if (mapboxToken) {
    const configuredCap = Number(
      process.env.MAPBOX_POST_LOCATION_MONTHLY_CAP ?? "13000",
    );
    const monthlyCap = Math.max(
      1,
      Math.min(Number.isFinite(configuredCap) ? configuredCap : 13000, 100000),
    );
    const { data: reserved, error: reserveError } = await supabase.rpc(
      "reserve_post_location_geocode",
      { input_monthly_limit: monthlyCap },
    );
    if (reserveError) {
      console.warn("Post location budget reservation failed", reserveError.message);
    } else if (reserved) {
      try {
        coarseLocation = await reverseGeocodeCoarseLocation({
          lat: exactLat,
          lng: exactLng,
          accessToken: mapboxToken,
        });
      } catch (error) {
        console.warn(
          "Post location lookup failed",
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    }
  }

  // Randomize coordinates within 200m only after the exact-point lookup.
  const randomizedCoords = randomizeCoordinates(
    exactLat,
    exactLng,
    200
  );

  const { data, error } = await supabase.from("posts_v2").insert({
    content: body.content,
    lat: randomizedCoords.lat,
    lng: randomizedCoords.lng,
    user_id: user.id,
    poi_id: body.poi_id ?? null,
    posted_from_poi: Boolean(body.poi_id),
    coarse_location_name: coarseLocation?.name ?? null,
    coarse_location_kind: coarseLocation?.kind ?? null,
    coarse_location_source: coarseLocation
      ? "mapbox_exact_pre_fuzz"
      : null,
    coarse_location_resolved_at: coarseLocation
      ? new Date().toISOString()
      : null,
  });

  if (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
