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

  try {
    // Get all reactions for the authenticated user
    const { data: myReactions, error } = await supabase
      .from('reactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching my reactions:', error);
      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }

    return NextResponse.json({
      data: myReactions,
    });

  } catch (error) {
    console.error('Error in GET /api/v2/reactions/my-reactions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 