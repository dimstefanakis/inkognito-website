import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
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

    // Call the database function to get lockout status
    const { data, error } = await supabase.rpc('get_user_lockout_status', {
      check_user_id: user.id
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to check lockout status',
          details: error.message 
        },
        { status: 500 }
      );
    }

    // Return the lockout status
    return NextResponse.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
