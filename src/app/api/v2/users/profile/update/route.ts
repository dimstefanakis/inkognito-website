import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const authHeader = request.headers.get("authorization") || request.headers.get("x-authorization");
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json(
      { error: "No authorization token provided" },
      { status: 401 }
    );
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }

  const { branch_params, expo_push_token, lat, lng, gender } = await request.json();

  const updateData: Record<string, string> = {};

  if (branch_params !== null && branch_params !== undefined && Object.keys(branch_params).length > 0) {
    updateData.branch_data = JSON.stringify(branch_params);
  }

  if (expo_push_token !== null && expo_push_token !== undefined && expo_push_token.trim() !== "") {
    updateData.expo_push_token = expo_push_token;
  }

  if (lat !== null && lat !== undefined && lng !== null && lng !== undefined) {
    updateData.lat = lat;
    updateData.lng = lng;
  }

  if (gender !== null && gender !== undefined && gender.trim() !== "") {
    updateData.gender = gender;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json(
      { error: "No valid data provided for update" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("users_v2")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }

  return NextResponse.json({ data: data });
}