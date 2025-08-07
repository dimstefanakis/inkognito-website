import { createClient } from "@/utils/supabase/server";
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
  const validation = validateContent(body.content);
  if (!validation.isValid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Randomize coordinates within 200m radius
  const randomizedCoords = randomizeCoordinates(
    userData.lat || 0,
    userData.lng || 0,
    200
  );

  const { data, error } = await supabase.from("posts_v2").insert({
    content: body.content,
    lat: randomizedCoords.lat,
    lng: randomizedCoords.lng,
    user_id: user.id,
    poi_id: body.poi_id,
  });

  if (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }

  return NextResponse.json({ data });
}
