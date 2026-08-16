import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Please enter a valid gift card code." }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: giftCard, error } = await supabase
      .from("gift_cards")
      .select("id, code, balance, is_active, expires_at")
      .eq("code", code.trim().toUpperCase())
      .single();

    if (error || !giftCard) {
      return NextResponse.json({ error: "Invalid gift card code." }, { status: 404 });
    }

    if (!giftCard.is_active || Number(giftCard.balance) <= 0) {
      return NextResponse.json({ error: "This gift card has already been redeemed or is inactive." }, { status: 400 });
    }

    if (giftCard.expires_at && new Date(giftCard.expires_at) < new Date()) {
      return NextResponse.json({ error: "This gift card has expired." }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      id: giftCard.id,
      code: giftCard.code,
      balance: Number(giftCard.balance),
    });
  } catch (err: unknown) {
    console.error("Gift card validation error:", err);
    return NextResponse.json({ error: "Failed to validate gift card." }, { status: 500 });
  }
}
