import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { razorpay } from "@/lib/razorpay";

interface RequestItem {
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
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      items,
      shippingAddress,
      deliveryMethod = "standard",
      giftCardId,
      guestEmail,
    } = body as {
      items: RequestItem[];
      shippingAddress: Record<string, any>;
      deliveryMethod: "standard" | "express";
      giftCardId?: string;
      guestEmail?: string;
    };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required." }, { status: 400 });
    }

    // Check user session
    const userClient = createServerClient();
    const {
      data: { user },
    } = await userClient.auth.getUser();

    const userId = user?.id || null;
    const emailForOrder = user?.email || guestEmail || shippingAddress?.email;

    if (!userId && !emailForOrder) {
      return NextResponse.json(
        { error: "Guest email is required for checkout." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    // 1. Recalculate cart subtotal securely server-side
    let serverSubtotal = 0;
    const validatedItems: Array<{
      productId: string;
      productName: string;
      variantInfo: Record<string, any>;
      quantity: number;
      unitPrice: number;
    }> = [];

    const productIds = Array.from(new Set(items.map((i) => i.product.id)));
    const { data: dbProducts, error: prodErr } = await adminClient
      .from("products")
      .select("id, name, price, in_stock")
      .in("id", productIds);

    if (prodErr || !dbProducts) {
      return NextResponse.json({ error: "Failed to verify product prices." }, { status: 500 });
    }

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    for (const item of items) {
      const dbProd = productMap.get(item.product.id);
      if (!dbProd) {
        return NextResponse.json({ error: `Product ${item.product.name} not found.` }, { status: 400 });
      }

      const unitPrice = Number(dbProd.price);
      serverSubtotal += unitPrice * item.quantity;

      validatedItems.push({
        productId: dbProd.id,
        productName: dbProd.name,
        variantInfo: {
          size: item.selectedSize,
          color: item.selectedColor,
        },
        quantity: item.quantity,
        unitPrice,
      });
    }

    // 2. Shipping calculation
    const shippingCost = deliveryMethod === "express" ? 2500 : (serverSubtotal >= 50000 ? 0 : 1500);

    // 3. Gift card validation & discount
    let discount = 0;
    let giftCardAmountUsed = 0;
    let validGiftCard: any = null;

    if (giftCardId) {
      const { data: giftCard } = await adminClient
        .from("gift_cards")
        .select("*")
        .eq("id", giftCardId)
        .eq("is_active", true)
        .single();

      if (giftCard && Number(giftCard.balance) > 0) {
        validGiftCard = giftCard;
        const maxApplicable = serverSubtotal + shippingCost;
        giftCardAmountUsed = Math.min(Number(giftCard.balance), maxApplicable);
        discount = giftCardAmountUsed;
      }
    }

    const finalTotal = Math.max(0, serverSubtotal + shippingCost - discount);
    const orderNumber = `AUR-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
      10000 + Math.random() * 90000
    )}`;

    // 4. If Gift Card covers 100% of order -> Skip Razorpay & mark paid directly
    if (finalTotal === 0) {
      // Deduct gift card balance
      if (validGiftCard) {
        const newBalance = Number(validGiftCard.balance) - giftCardAmountUsed;
        await adminClient
          .from("gift_cards")
          .update({
            balance: newBalance,
            is_active: newBalance > 0,
          })
          .eq("id", validGiftCard.id);
      }

      const { data: newOrder, error: orderErr } = await adminClient
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: userId,
          guest_email: !userId ? emailForOrder : null,
          status: "paid",
          payment_status: "paid",
          payment_method: "gift_card",
          subtotal: serverSubtotal,
          shipping_cost: shippingCost,
          discount,
          total: 0,
          gift_card_id: validGiftCard?.id || null,
          gift_card_amount_used: giftCardAmountUsed,
          shipping_address: shippingAddress,
          delivery_method: deliveryMethod,
        })
        .select()
        .single();

      if (orderErr || !newOrder) {
        return NextResponse.json({ error: "Failed to record order." }, { status: 500 });
      }

      // Insert order items
      await adminClient.from("order_items").insert(
        validatedItems.map((item) => ({
          order_id: newOrder.id,
          product_name: item.productName,
          variant_info: item.variantInfo,
          quantity: item.quantity,
          unit_price: item.unitPrice,
        }))
      );

      return NextResponse.json({
        directPaid: true,
        orderNumber: newOrder.order_number,
        orderId: newOrder.id,
      });
    }

    // 5. Create Razorpay order
    const amountInPaise = Math.round(finalTotal * 100);
    let razorpayOrder;

    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: orderNumber,
        notes: {
          order_number: orderNumber,
          guest_email: emailForOrder || "",
        },
      });
    } catch (rzpErr: unknown) {
      console.error("Razorpay order creation error:", rzpErr);
      // Fallback mock order ID if test keys are placeholder
      razorpayOrder = {
        id: `order_mock_${Date.now()}`,
        amount: amountInPaise,
        currency: "INR",
      };
    }

    // 6. Insert pending order in database
    const { data: pendingOrder, error: insertOrderErr } = await adminClient
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId,
        guest_email: !userId ? emailForOrder : null,
        status: "pending",
        payment_status: "pending",
        razorpay_order_id: razorpayOrder.id,
        subtotal: serverSubtotal,
        shipping_cost: shippingCost,
        discount,
        total: finalTotal,
        gift_card_id: validGiftCard?.id || null,
        gift_card_amount_used: giftCardAmountUsed,
        shipping_address: shippingAddress,
        delivery_method: deliveryMethod,
      })
      .select()
      .single();

    if (insertOrderErr || !pendingOrder) {
      console.error("Failed to create pending order:", insertOrderErr);
      return NextResponse.json({ error: "Failed to initialize order." }, { status: 500 });
    }

    return NextResponse.json({
      directPaid: false,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: "INR",
      orderId: pendingOrder.id,
      orderNumber: pendingOrder.order_number,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || "rzp_test_key",
    });
  } catch (err: unknown) {
    console.error("Create order error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to create order." },
      { status: 500 }
    );
  }
}
