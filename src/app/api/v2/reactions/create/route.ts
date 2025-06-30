import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "../../../../../../types_db";

type ReactionType = Database["public"]["Enums"]["reaction_type"];

interface CreateReactionRequest {
  reaction_type: ReactionType;
  post_id?: string;
  reply_id?: string;
}

export const runtime = 'edge';

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

    const body: CreateReactionRequest = await request.json();
    
    // Validate required fields
    if (!body.reaction_type) {
      return NextResponse.json(
        { error: "reaction type is required" },
        { status: 400 }
      );
    }

    // Validate reaction type
    if (!["like", "dislike"].includes(body.reaction_type)) {
      return NextResponse.json(
        { error: "reaction_type must be 'like' or 'dislike'" },
        { status: 400 }
      );
    }

    // Validate that exactly one target is provided
    if ((!body.post_id && !body.reply_id) || (body.post_id && body.reply_id)) {
      return NextResponse.json(
        { error: "Must provide provide a piece of content to react to" },
        { status: 400 }
      );
    }

    // Call the toggle_reaction function
    const { data, error } = await supabase.rpc('toggle_reaction', {
      p_user_id: user.id,
      p_reaction_type: body.reaction_type,
      p_post_id: body.post_id,
      p_reply_id: body.reply_id
    });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      );
    }

    // Return success response with the reaction result
    return NextResponse.json({
      success: true,
      data: data
    }, { status: 200 });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Invalid request body or unexpected error occurred' },
      { status: 400 }
    );
  }
}
