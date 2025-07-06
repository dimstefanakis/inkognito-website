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
    const { referralCode } = await request.json();

    if (!referralCode) {
      return NextResponse.json(
        { error: "Referral code is required" },
        { status: 400 }
      );
    }

    // 1. Validate the referral code: select non-expired, unused codes
    const { data: referrals, error: referralError } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("code", referralCode)
      .is("invitee_id", null)
      .gte("expires_at", new Date().toISOString())
      .limit(1);

    const referral = referrals?.[0];

    if (referralError || !referral) {
      console.error("Error fetching referral code:", referralError);
      return NextResponse.json(
        { error: "Invalid, expired, or already used referral code" },
        { status: 404 }
      );
    }

    // Prevent self-referral
    if (referral.inviter_id === user.id) {
      console.error("Cannot use your own referral code");
      return NextResponse.json(
        { error: "Cannot use your own referral code" },
        { status: 400 }
      );
    };

    // 2. Update the referral code as used
    const { error: updateError } = await supabase
      .from("referral_codes")
      .update({
        invitee_id: user.id,
        used_at: new Date().toISOString(),
      })
      .eq("id", referral.id);

    if (updateError) {
      console.error("Error updating referral code:", updateError);
      return NextResponse.json(
        { error: "Failed to update referral code status" },
        { status: 500 }
      );
    }

    const rewardExpiresAt = new Date();
    rewardExpiresAt.setDate(rewardExpiresAt.getDate() + 7); // Reward expires in 7 days

    // 3. Create a user_reward for the inviter
    const { data: inviterReward, error: inviterRewardError } = await supabase
      .from("user_rewards")
      .insert({
        user_id: referral.inviter_id, // Reward goes to the inviter
        title: "Referral Reward",
        description: "You have received a referral reward for inviting a friend! 🎉",
        reward_type: "circle_unlock_invite",
        reward_data: {
          radius: 2, // Default radius, as seen in claim-circle-reward
          type: "friend_location",
          invitee_id: user.id,
          role: "inviter",
        },
        expires_at: rewardExpiresAt.toISOString(),
        reward_status: "pending",
      })
      .select()
      .single();

    if (inviterRewardError) {
      console.error("Error creating inviter reward:", inviterRewardError);
      // Optionally, revert the referral code update if reward creation fails
      await supabase
        .from("referral_codes")
        .update({
          invitee_id: null,
          used_at: null,
        })
        .eq("id", referral.id);
      return NextResponse.json(
        { error: "Failed to create inviter referral reward" },
        { status: 500 }
      );
    }

    // 4. Create a user_reward for the invitee
    const { data: inviteeReward, error: inviteeRewardError } = await supabase
      .from("user_rewards")
      .insert({
        user_id: user.id, // Reward goes to the invitee
        title: "Referral Reward",
        description: "Thanks for joining! Choose a reward to get started! 🎉",
        reward_type: "circle_unlock_invite",
        reward_data: {
          radius: 2, // Default radius, as seen in claim-circle-reward
          type: "friend_location",
          inviter_id: referral.inviter_id,
          role: "invitee",
        },
        expires_at: rewardExpiresAt.toISOString(),
        reward_status: "pending",
      })
      .select()
      .single();

    if (inviteeRewardError) {
      console.error("Error creating invitee reward:", inviteeRewardError);
      // Optionally, revert the referral code update and inviter reward if invitee reward creation fails
      await supabase
        .from("referral_codes")
        .update({
          invitee_id: null,
          used_at: null,
        })
        .eq("id", referral.id);
      await supabase
        .from("user_rewards")
        .delete()
        .eq("id", inviterReward?.id);
      return NextResponse.json(
        { error: "Failed to create invitee referral reward" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Referral code successfully used and rewards granted.",
        inviterReward: inviterReward,
        inviteeReward: inviteeReward,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in claim-referral-code:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
