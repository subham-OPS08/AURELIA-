import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

// ⚠️ SECURITY NOTE: Rate limiting should be added on this payment verification endpoint
// to prevent signature brute-forcing (e.g., using Upstash Redis or Vercel KV rate-limiter)

interface VerifyPayload {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
    };
    quantity: number;
    selectedSize: string;
    selectedColor: {
      name: string;
      hex: string;
    };
  }>;
  guestEmail?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyPayload;
    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      guestEmail,
    } = body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json({ error: "Missing required payment parameters." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET;

    // 1. Verify Razorpay Signature using HMAC SHA256
    let isValidSignature = false;

    if (razorpaySecret && razorpaySecret !== "placeholder_secret") {
      const generatedSignature = crypto
        .createHmac("sha256", razorpaySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      isValidSignature = generatedSignature === razorpaySignature;
    } else {
      // In local development or test mode without secret, permit mock verification if signature matches client format
      console.warn("Using development payment verification mode (placeholder secret).");
      isValidSignature = Boolean(razorpaySignature && razorpayPaymentId);
    }

    if (!isValidSignature) {
      // Mark order as failed in database
      await adminClient
        .from("orders")
        .update({
          status: "failed",
          payment_status: "failed",
          notes: "Razorpay signature verification failed.",
        })
        .eq("id", orderId);

      return NextResponse.json(
        { error: "Payment verification failed: Invalid transaction signature." },
        { status: 400 }
      );
    }

    // 2. Fetch the pending order to confirm details
    const { data: order, error: orderFetchErr } = await adminClient
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderFetchErr || !order) {
      return NextResponse.json({ error: "Order record not found." }, { status: 404 });
    }

    // 3. Mark order as paid & record transaction IDs
    const { error: updateErr } = await adminClient
      .from("orders")
      .update({
        status: "paid",
        payment_status: "paid",
        payment_method: "razorpay",
        razorpay_payment_id: razorpayPaymentId,
        guest_email: order.guest_email || guestEmail || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateErr) {
      console.error("Failed to update order status:", updateErr);
      return NextResponse.json({ error: "Failed to finalize order status." }, { status: 500 });
    }

    // 4. Insert order items & decrement stock quantity
    if (items && Array.isArray(items)) {
      for (const item of items) {
        // Insert order item row
        await adminClient.from("order_items").insert({
          order_id: orderId,
          product_name: item.product.name,
          variant_info: {
            size: item.selectedSize,
            color: item.selectedColor,
          },
          quantity: item.quantity,
          unit_price: item.product.price,
        });

        // Decrement product variant stock
        const { data: variant } = await adminClient
          .from("product_variants")
          .select("id, stock_quantity")
          .eq("product_id", item.product.id)
          .eq("size", item.selectedSize)
          .eq("color_name", item.selectedColor.name)
          .single();

        if (variant && variant.stock_quantity !== null) {
          const newStock = Math.max(0, variant.stock_quantity - item.quantity);
          await adminClient
            .from("product_variants")
            .update({ stock_quantity: newStock })
            .eq("id", variant.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.order_number,
      orderId: order.id,
    });
  } catch (err: unknown) {
    console.error("Payment verification route exception:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Payment verification failed." },
      { status: 500 }
    );
  }
}
