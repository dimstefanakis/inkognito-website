import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function readNumber(value: string | null): number | null {
  if (value == null || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function GET(request: NextRequest) {
  const authorization =
    request.headers.get("authorization") ??
    request.headers.get("x-authorization");
  const token = authorization?.replace(/^Bearer\s+/i, "");
  if (!token) {
    return NextResponse.json(
      { error: "No authorization token provided" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const lat = readNumber(searchParams.get("lat"));
  const lng = readNumber(searchParams.get("lng"));
  const limit = readNumber(searchParams.get("limit")) ?? 20;
  const cursorScore = readNumber(searchParams.get("cursor_score"));
  const cursorId = searchParams.get("cursor_id");
  const asOf = searchParams.get("as_of") ?? new Date().toISOString();

  if (
    lat == null ||
    lng == null ||
    lat < -90 ||
    lat > 90 ||
    lng < -180 ||
    lng > 180
  ) {
    return NextResponse.json(
      { error: "A valid foreground location is required" },
      { status: 400 },
    );
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 40) {
    return NextResponse.json(
      { error: "limit must be an integer between 1 and 40" },
      { status: 400 },
    );
  }
  if (
    (cursorId == null) !== (cursorScore == null) ||
    (cursorId != null && !UUID_PATTERN.test(cursorId))
  ) {
    return NextResponse.json(
      { error: "cursor_id and cursor_score must be a valid pair" },
      { status: 400 },
    );
  }
  if (!Number.isFinite(Date.parse(asOf))) {
    return NextResponse.json(
      { error: "as_of must be a valid timestamp" },
      { status: 400 },
    );
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Home feed Supabase server configuration is missing");
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

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

  const { data, error } = await supabase.rpc("get_home_feed_v1", {
    input_lat: lat,
    input_lng: lng,
    input_as_of: asOf,
    input_limit: limit,
    input_cursor_score: cursorScore,
    input_cursor_id: cursorId,
  });
  if (error) {
    console.error("Error fetching Home feed:", error);
    const status = error.code === "22023" ? 400 : 500;
    return NextResponse.json(
      {
        error:
          status === 400
            ? error.message
            : "An unexpected error occurred",
      },
      { status },
    );
  }

  return NextResponse.json(data);
}
