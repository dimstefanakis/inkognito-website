import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const authHeader =
    request.headers.get("authorization") ||
    request.headers.get("x-authorization");
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
    const { data: codeData, error: rpcError } = await supabase.rpc(
      "generate_referral_code",
      {
        p_user_id: user.id,
      }
    );

    if (rpcError) {
      console.error("Error generating referral code:", rpcError);
      return NextResponse.json(
        { error: "Failed to generate referral code" },
        { status: 500 }
      );
    }

    const newCode = codeData;

    const { data, error } = await supabase
      .from("referral_codes")
      .insert({
        inviter_id: user.id,
        code: newCode,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating referral code:", error);
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: newCode,
    }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}