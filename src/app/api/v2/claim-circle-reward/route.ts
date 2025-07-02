import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { Tables } from "../../../../../types_db";

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
    const {
      rewardId,
      type,
      lat,
      lng,
      friendUserId,
    } = await request.json();

    // Validate required fields
    if (!rewardId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (type !== 'fixed' && type !== 'friend_location') {
      return NextResponse.json({ error: "Invalid circle type" }, { status: 400 });
    }

    // Validate reward exists and belongs to user
    const { data: reward, error: rewardError } = await supabase
      .from('user_rewards')
      .select('*')
      .eq('id', rewardId)
      .eq('user_id', user.id)
      .or(`reward_type.eq.circle_unlock_invite,reward_type.eq.gift_circle`)
      .is('claimed_at', null)
      .single();

    if (rewardError || !reward) {
      return NextResponse.json({ error: "Reward not found or already claimed" }, { status: 404 });
    }

    // Check if reward has expired
    if (reward.expires_at && new Date(reward.expires_at) < new Date()) {
      return NextResponse.json({ error: "Reward has expired" }, { status: 400 });
    }

    // Extract radius from reward data, default to 2km
    const radiusKm = (reward.reward_data as any)?.radius || 2;

    let circle: Tables<'viewing_circles'> | null = null;

    // Create the viewing circle based on type
    if (type === 'fixed') {
      // Fixed location circle - requires lat/lng
      if (!lat || !lng) {
        return NextResponse.json({ error: "Latitude and longitude required for fixed circles" }, { status: 400 });
      }

      const { data: circleData, error: circleError } = await supabase
        .from('viewing_circles')
        .insert({
          user_id: user.id,
          lat: lat,
          lng: lng,
          radius_km: radiusKm,
          type: 'fixed',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (circleError) {
        console.error('Error creating fixed circle:', circleError);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
      }

      circle = circleData;
    } else if (type === 'friend_location') {
      // Friend location circle - requires friendUserId
      if (!friendUserId) {
        return NextResponse.json({ error: "Friend user ID required for friend location circles" }, { status: 400 });
      }

      // Verify friend exists
      const { data: friend, error: friendError } = await supabase
        .from('users_v2')
        .select('id')
        .eq('id', friendUserId)
        .single();

      if (friendError || !friend) {
        return NextResponse.json({ error: "Friend not found" }, { status: 404 });
      }

      const { data: circleData, error: circleError } = await supabase
        .from('viewing_circles')
        .insert({
          user_id: user.id,
          friend_user_id: friendUserId,
          radius_km: radiusKm,
          type: 'friend_location',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (circleError) {
        console.error('Error creating friend circle:', circleError);
        return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
      }

      circle = circleData;
    }

    if (!circle) {
      return NextResponse.json({ error: "Circle not found" }, { status: 404 });
    }

    // Update reward as claimed and link to circle
    const { error: updateError } = await supabase
      .from('user_rewards')
      .update({
        claimed_at: new Date().toISOString(),
        reward_status: 'completed',
        reward_data: {
          ...(reward.reward_data as object || {}),
          circle_id: circle?.id,
          type: type
        }
      })
      .eq('id', rewardId);

    if (updateError) {
      console.error('Error updating reward:', updateError);
      // Try to cleanup the created circle
      await supabase
        .from('viewing_circles')
        .delete()
        .eq('id', circle.id);

      return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: `Successfully created ${type === 'fixed' ? 'fixed location' : 'friend tracking'} circle!`,
      circle: {
        id: circle.id,
        type: type,
        radius_km: circle.radius_km,
        lat: circle.lat,
        lng: circle.lng,
        friend_user_id: circle.friend_user_id
      },
      reward: {
        id: reward.id,
        claimed_at: new Date().toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Claim circle reward error:', error);
    return NextResponse.json({
      error: "Internal server error"
    }, { status: 500 });
  }
}
