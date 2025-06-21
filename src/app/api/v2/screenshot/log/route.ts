import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

interface LogScreenshotRequest {
  user_id: string;
  device_id?: string;
  user_agent?: string;
}

export async function POST(request: NextRequest) {
  try {
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

    const body: LogScreenshotRequest = await request.json();
    
    if (body.user_id !== user.id) {
      return NextResponse.json(
        { error: "User ID mismatch" },
        { status: 403 }
      );
    }

    const clientIP = request.headers.get("x-forwarded-for") || 
                    request.headers.get("x-real-ip") || 
                    "unknown";

    const { data, error } = await supabase.rpc('log_screenshot_attempt', {
      attempt_user_id: user.id,
      device_id: body.device_id || undefined,
      ip_address: clientIP,
      user_agent: body.user_agent || request.headers.get('user-agent') || undefined
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { 
          error: 'Failed to log screenshot',
          details: error.message 
        },
        { status: 500 }
      );
    }

    // Return the result from the database function
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
