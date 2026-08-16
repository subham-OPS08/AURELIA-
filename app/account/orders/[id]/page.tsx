"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { OrderStatusTracker } from "@/components/account/OrderStatusTracker";
import { ArrowLeft, Loader2, Package, MapPin, CreditCard, ShieldCheck } from "lucide-react";
import { Tables } from "@/types/database.types";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { user } = useAuth();
  const supabase = createClient();

  const [order, setOrder] = useState<Tables<"orders"> | null>(null);
  const [items, setItems] = useState<Tables<"order_items">[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !user) return;

    supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single()
      .then(async ({ data: orderData }) => {
        if (orderData) {
          setOrder(orderData);
          const { data: itemsData } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", orderData.id);
          setItems(itemsData || []);
        }
        setIsLoading(false);
      });
  }, [orderId, user, supabase]);

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-charcoal-50 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-sand" />
        <span>Retrieving order specification...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-12 text-center space-y-4 bg-surface border border-border">
        <h3 className="font-serif text-xl text-charcoal">Order Not Found</h3>
        <p className="text-xs text-charcoal-50 font-light">
          The requested acquisition reference could not be located in your client archives.
        </p>
        <Link href="/account/orders">
          <Button variant="outline" size="sm" className="text-xs uppercase tracking-luxury">
            Return to Order History
          </Button>
        </Link>
      </div>
    );
  }

  const shippingAddr = order.shipping_address as Record<string, any> | null;
  const formattedDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/account/orders"
          className="text-xs uppercase tracking-luxury text-charcoal-50 hover:text-charcoal flex items-center gap-1.5 transition-colors font-medium mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Order History</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/80 pb-4">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-light tracking-tight">
              Order #{order.order_number}
            </h2>
            <p className="text-xs text-charcoal-50 mt-1 font-light">
              Acquisition commissioned on {formattedDate}
            </p>
          </div>
          <span className="font-sans font-medium text-xl text-charcoal">
            {formatPrice(Number(order.total))}
          </span>
        </div>
      </div>

      {/* Visual Status Progression Tracker */}
      <div className="space-y-3">
        <span className="text-[11px] uppercase tracking-luxury text-sand-800 font-medium block">
          Live Dispatch Progress
        </span>
        <OrderStatusTracker status={(order.status as any) || "paid"} />
      </div>

      {/* Order Items Table */}
      <div className="p-6 bg-surface border border-border space-y-4">
        <h3 className="font-serif text-base text-charcoal font-normal uppercase tracking-wider border-b border-border/60 pb-3">
          Garments & Accessories
        </h3>

        <div className="divide-y divide-border/40">
          {items.map((item) => {
            const variantInfo = item.variant_info as Record<string, any> | null;
            return (
              <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                <div>
                  <h4 className="font-serif text-sm text-charcoal">{item.product_name}</h4>
                  <div className="text-[10px] uppercase tracking-wider text-charcoal-50 mt-1 flex items-center gap-2">
                    {variantInfo?.size && <span>Size {variantInfo.size}</span>}
                    {variantInfo?.color?.name && (
                      <>
                        <span>•</span>
                        <span>{variantInfo.color.name}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-sans font-medium text-charcoal">
                  {formatPrice(Number(item.unit_price) * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Summary: Shipping Address + Payment Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Shipping Destination */}
        <div className="p-6 bg-surface border border-border space-y-2">
          <div className="flex items-center gap-2 text-charcoal font-medium">
            <MapPin className="w-4 h-4 text-sand" />
            <span className="uppercase tracking-luxury text-[11px]">Delivery Residence</span>
          </div>
          {shippingAddr ? (
            <div className="text-charcoal-50 font-light leading-relaxed pt-1">
              <p className="font-medium text-charcoal">{shippingAddr.fullName}</p>
              <p>{shippingAddr.addressLine1}</p>
              {shippingAddr.addressLine2 && <p>{shippingAddr.addressLine2}</p>}
              <p>
                {shippingAddr.city}, {shippingAddr.state} — {shippingAddr.postalCode}
              </p>
              <p>{shippingAddr.country}</p>
              <p className="mt-1">Tel: {shippingAddr.phone}</p>
            </div>
          ) : (
            <p className="text-charcoal-50 font-light pt-1">Address coordinates on file.</p>
          )}
        </div>

        {/* Financial Breakdown */}
        <div className="p-6 bg-surface border border-border space-y-2.5 font-light text-charcoal-50">
          <div className="flex items-center gap-2 text-charcoal font-medium mb-1">
            <CreditCard className="w-4 h-4 text-sand" />
            <span className="uppercase tracking-luxury text-[11px]">Financial Settlement</span>
          </div>
          <div className="flex justify-between text-charcoal">
            <span>Subtotal</span>
            <span className="font-sans">{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{Number(order.shipping_cost) === 0 ? "Complimentary" : formatPrice(Number(order.shipping_cost))}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-sand-800 font-medium">
              <span>Gift Card Deduction</span>
              <span>-{formatPrice(Number(order.discount))}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-border pt-2 text-charcoal font-medium">
            <span>Total Settled</span>
            <span className="font-sans text-sm">{formatPrice(Number(order.total))}</span>
          </div>
          <p className="text-[10px] text-charcoal-50 font-mono pt-1">
            Gateway: {order.payment_method?.toUpperCase()} • Ref: {order.razorpay_payment_id || order.razorpay_order_id || "Direct"}
          </p>
        </div>
      </div>
    </div>
  );
}
