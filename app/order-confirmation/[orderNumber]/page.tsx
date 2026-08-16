"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";

function OrderConfirmationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderNumber = params?.orderNumber as string;
  const guestEmailParam = searchParams.get("email") || "";

  const { isAuthenticated, signUp } = useAuth();
  const supabase = createClient();

  const [order, setOrder] = useState<any>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Guest Account Creation State
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;

    supabase
      .from("orders")
      .select("*")
      .eq("order_number", orderNumber)
      .single()
      .then(async ({ data: orderData }) => {
        if (orderData) {
          setOrder(orderData);
          // Fetch items
          const { data: itemsData } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", orderData.id);
          setOrderItems(itemsData || []);
        }
        setIsLoading(false);
      });
  }, [orderNumber, supabase]);

  const handleCreateGuestAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupPassword || signupPassword.length < 6) {
      setAccountError("Password must be at least 6 characters.");
      return;
    }

    setIsCreatingAccount(true);
    setAccountError(null);

    const emailToUse = order?.guest_email || guestEmailParam;
    const { error } = await signUp(emailToUse, signupPassword, signupName);

    setIsCreatingAccount(false);

    if (error) {
      setAccountError(error);
    } else {
      setAccountCreated(true);
    }
  };

  // Estimated delivery calculation (3-5 business days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 4);
  const formattedDelivery = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 border-b border-border/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Luxury Hero Banner */}
        <div className="text-center space-y-4 pb-12 border-b border-border/80">
          <div className="w-16 h-16 rounded-full bg-sand-100/80 mx-auto flex items-center justify-center text-sand-800">
            <CheckCircle2 className="w-8 h-8 stroke-1" />
          </div>
          <span className="text-[11px] uppercase tracking-luxury text-sand-800 font-medium block">
            AURÉLIA Haute Atelier • Order Confirmation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-light tracking-tight">
            Thank You for Your Acquisition
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-50 max-w-lg mx-auto font-light leading-relaxed">
            Your order <strong className="text-charcoal font-medium">#{orderNumber}</strong> has been received and allocated to our Florence tailoring atelier for private inspection and preparation.
          </p>
        </div>

        {/* Status Tracker & Delivery Info */}
        <div className="my-10 p-6 sm:p-8 bg-surface-muted/40 border border-border grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-sand-100 flex items-center justify-center text-sand-800 flex-shrink-0">
              <Truck className="w-5 h-5 stroke-1" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-charcoal-50 font-medium block">
                Estimated White-Glove Dispatch
              </span>
              <p className="font-serif text-lg text-charcoal mt-0.5">{formattedDelivery}</p>
              <p className="text-xs text-charcoal-50 font-light mt-1">
                You will receive private courier tracking coordinates via email once dispatched.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-sand-100 flex items-center justify-center text-sand-800 flex-shrink-0">
              <PackageCheck className="w-5 h-5 stroke-1" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-luxury text-charcoal-50 font-medium block">
                Atelier Preparation
              </span>
              <p className="font-serif text-lg text-charcoal mt-0.5">Garment Hand-Finished</p>
              <p className="text-xs text-charcoal-50 font-light mt-1">
                Each piece undergoes hand-steaming and cedar dustbag packing before departure.
              </p>
            </div>
          </div>
        </div>

        {/* Guest Prompt to Create Account */}
        {!isAuthenticated && (order?.guest_email || guestEmailParam) && !accountCreated && (
          <div className="my-10 p-6 sm:p-8 bg-sand-50/70 border border-sand-200/80 space-y-4">
            <div className="flex items-center gap-2 text-sand-800">
              <Sparkles className="w-4 h-4" />
              <span className="text-[11px] uppercase tracking-luxury font-medium">
                Exclusive Invitation
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-charcoal font-light">
              Create Your AURÉLIA Client Profile
            </h3>
            <p className="text-xs text-charcoal-50 font-light max-w-xl leading-relaxed">
              Link order <strong className="text-charcoal font-medium">#{orderNumber}</strong> to a permanent atelier profile to track live courier status, save bespoke residences, and access preview collections.
            </p>

            {accountError && (
              <p className="text-xs text-red-700 font-light">{accountError}</p>
            )}

            <form onSubmit={handleCreateGuestAccount} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Input
                type="text"
                placeholder="Full Name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                className="h-10 text-xs bg-surface border-border focus:border-charcoal"
              />
              <Input
                type="password"
                placeholder="Create Password (min. 6 chars)"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                minLength={6}
                className="h-10 text-xs bg-surface border-border focus:border-charcoal"
              />
              <Button
                type="submit"
                disabled={isCreatingAccount}
                className="h-10 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900"
              >
                {isCreatingAccount ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Creating Profile...
                  </span>
                ) : (
                  "Create Client Profile"
                )}
              </Button>
            </form>
          </div>
        )}

        {accountCreated && (
          <div className="my-10 p-6 bg-sand-100/60 border border-sand-300 text-charcoal text-xs space-y-1">
            <p className="font-medium text-sand-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Client Profile Created Successfully
            </p>
            <p className="font-light">
              Your order has been linked to your account. You can now track its journey in your client portal.
            </p>
          </div>
        )}

        {/* Order Details & Summary Card */}
        {order && (
          <div className="border border-border p-6 sm:p-8 space-y-6 bg-surface">
            <div className="flex justify-between items-baseline border-b border-border/80 pb-4">
              <div>
                <h3 className="font-serif text-lg font-normal text-charcoal uppercase">
                  Acquisition Details
                </h3>
                <span className="text-[11px] text-charcoal-50 font-light">
                  Order #{order.order_number} • Payment Status: {order.payment_status?.toUpperCase()}
                </span>
              </div>
              <span className="font-sans font-medium text-lg text-charcoal">
                {formatPrice(Number(order.total))}
              </span>
            </div>

            {/* Items List */}
            {orderItems.length > 0 && (
              <div className="space-y-3 divide-y divide-border/40">
                {orderItems.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-serif text-sm text-charcoal">{item.product_name}</p>
                      <p className="text-[10px] text-charcoal-50 uppercase tracking-wider mt-0.5">
                        Qty: {item.quantity} {item.variant_info?.size && `• Size ${item.variant_info.size}`}{" "}
                        {item.variant_info?.color?.name && `• ${item.variant_info.color.name}`}
                      </p>
                    </div>
                    <span className="font-sans font-medium text-charcoal">
                      {formatPrice(Number(item.unit_price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Address & Payment Info */}
            {order.shipping_address && (
              <div className="border-t border-border/80 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-luxury text-charcoal-50 block mb-1">
                    Shipping Destination
                  </span>
                  <p className="font-medium text-charcoal">{order.shipping_address.fullName}</p>
                  <p className="text-charcoal-50 font-light leading-relaxed">
                    {order.shipping_address.addressLine1}
                    <br />
                    {order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.postalCode}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-luxury text-charcoal-50 block mb-1">
                    Payment Reference
                  </span>
                  <p className="font-medium text-charcoal">
                    {order.payment_method === "razorpay" ? "Razorpay Secured" : "Gift Card VIP Redemption"}
                  </p>
                  {order.razorpay_payment_id && (
                    <p className="text-charcoal-50 font-light font-mono text-[11px] mt-0.5">
                      Ref: {order.razorpay_payment_id}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button
              variant="outline"
              className="h-12 px-8 text-xs uppercase tracking-luxury font-medium border-border"
            >
              Continue Exploring
            </Button>
          </Link>
          <Link href="/account/orders">
            <Button className="h-12 px-8 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900">
              <span>View Client Orders</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-sand mx-auto" />
            <p className="text-xs uppercase tracking-luxury text-charcoal-50 font-light">
              Loading Order Confirmation...
            </p>
          </div>
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
