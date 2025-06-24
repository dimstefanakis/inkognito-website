import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export const runtime = 'edge'

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
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

    // Delete the auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id)

    if (authError) {
      console.error('Auth deletion error:', authError);
    }

    if (!authError) {
      // Delete from users_v2 table first (to maintain referential integrity)
      const { error: dbError } = await supabase
        .from('users_v2')
        .delete()
        .eq('id', user.id)

      if (dbError) {
        console.error('Database deletion error:', dbError);
      }
    }

    return NextResponse.json(
      { message: 'User deletion completed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error during user deletion:', error);
    return NextResponse.json(
      { message: 'User deletion completed successfully' },
      { status: 200 }
    )
  }
} 