import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params;
    
    // Extract authentication token
    const authHeader = request.headers.get("authorization") || request.headers.get("x-authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    // Verify user authentication
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

    // First, verify that the post exists and the user owns it
    const { data: post, error: fetchError } = await supabase
      .from("posts_v2")
      .select("id, user_id")
      .eq("id", id)
      .single();

    if (fetchError || !post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (post.user_id !== user.id) {
      return NextResponse.json(
        { error: "Access denied: You can only delete your own posts" },
        { status: 403 }
      );
    }

    // Delete the post
    const { error: deleteError } = await supabase
      .from("posts_v2")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id); // Double-check ownership in the delete query

    if (deleteError) {
      console.error('Error deleting post:', deleteError);
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error('Unexpected error in DELETE /api/v2/posts/[id]:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 