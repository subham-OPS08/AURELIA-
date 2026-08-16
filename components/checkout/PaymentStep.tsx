"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { ShippingAddressData } from "./AddressStep";
import { GiftCardData } from "./OrderSummary";
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle, CreditCard, Lock } from "lucide-react";

interface PaymentStepProps {
  shippingAddress: ShippingAddressData;
  deliveryMethod: "standard" | "express";
  appliedGiftCard: GiftCardData | null;
  onBack: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PaymentStep({
  shippingAddress,
  deliveryMethod,
  appliedGiftCard,
  onBack,
}: PaymentStepProps) {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const freeShippingThreshold = 50000;
  const shippingCost =
    deliveryMethod === "express"
      ? 2500
      : subtotal >= freeShippingThreshold || subtotal === 0
      ? 0
      : 1500;

  const giftCardDiscount = appliedGiftCard
    ? Math.min(appliedGiftCard.balance, subtotal + shippingCost)
    : 0;

  const finalTotal = Math.max(0, subtotal + shippingCost - giftCardDiscount);

  // Helper to load Razorpay script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // 1. Create order on server
      const createRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress,
          deliveryMethod,
          giftCardId: appliedGiftCard?.id,
          guestEmail: !isAuthenticated ? shippingAddress.email : undefined,
        }),
      });

      const orderData = await createRes.json();

      if (!createRes.ok || orderData.error) {
        setError(orderData.error || "Unable to initiate payment transaction.");
        setIsProcessing(false);
        return;
      }

      // Case A: 100% Gift card covered -> directly completed
      if (orderData.directPaid) {
        clearCart();
        router.push(`/order-confirmation/${orderData.orderNumber}?email=${encodeURIComponent(shippingAddress.email)}`);
        return;
      }

      // Case B: Launch Razorpay Checkout
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setError("Unable to connect to payment gateway. Please check your internet connection.");
        setIsProcessing(false);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "AURÉLIA Haute Atelier",
        description: `Order #${orderData.orderNumber}`,
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: shippingAddress.fullName,
          email: shippingAddress.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: "#1A1A1A",
          backdrop_color: "rgba(0,0,0,0.8)",
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // Verify payment server-side
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                items,
                guestEmail: !isAuthenticated ? shippingAddress.email : undefined,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              clearCart();
              router.push(
                `/order-confirmation/${verifyData.orderNumber}?email=${encodeURIComponent(
                  shippingAddress.email
                )}`
              );
            } else {
              setError(
                verifyData.error ||
                  "Payment signature verification failed. Please contact client support if amount was debited."
              );
              setIsProcessing(false);
            }
          } catch (err: unknown) {
            console.error("Verification call error:", err);
            setError("Failed to verify transaction. Please contact concierge support.");
            setIsProcessing(false);
          }
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", (resp: any) => {
        setError(
          resp.error?.description || "Payment failed or was declined by issuing bank."
        );
        setIsProcessing(false);
      });
      razorpayInstance.open();
    } catch (err: unknown) {
      console.error("Checkout payment exception:", err);
      setError("An unexpected error occurred during checkout. Please retry.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-[11px] uppercase tracking-luxury text-sand font-medium block mb-1">
          Step 3 of 3
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-light tracking-tight">
          Review & Secure Payment
        </h2>
        <p className="text-xs text-charcoal-50 mt-1 font-light">
          Finalize your bespoke acquisition. Payment is encrypted with 256-bit protocol.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium">Payment Unsuccessful</p>
            <p className="font-light leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Review Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Shipping Summary */}
        <div className="p-5 border border-border/80 bg-surface space-y-2">
          <div className="flex justify-between items-center text-charcoal">
            <span className="font-medium uppercase tracking-wider text-[11px]">
              Delivery Destination
            </span>
          </div>
          <p className="font-medium text-charcoal">{shippingAddress.fullName}</p>
          <p className="text-charcoal-50 font-light leading-relaxed">
            {shippingAddress.addressLine1}
            {shippingAddress.addressLine2 && `, ${shippingAddress.addressLine2}`}
            <br />
            {shippingAddress.city}, {shippingAddress.state} — {shippingAddress.postalCode}
            <br />
            {shippingAddress.country}
          </p>
          <p className="text-charcoal-50 font-light">
            Tel: {shippingAddress.phone} • {shippingAddress.email}
          </p>
        </div>

        {/* Courier Summary */}
        <div className="p-5 border border-border/80 bg-surface space-y-2">
          <div className="flex justify-between items-center text-charcoal">
            <span className="font-medium uppercase tracking-wider text-[11px]">
              Courier Method
            </span>
          </div>
          <p className="font-medium text-charcoal">
            {deliveryMethod === "express"
              ? "Atelier Express Bespoke Dispatch"
              : "Standard White-Glove Courier"}
          </p>
          <p className="text-charcoal-50 font-light leading-relaxed">
            {deliveryMethod === "express"
              ? "1–2 Business Days priority delivery with private transport and garment steamer."
              : "3–5 Business Days insured transport with signature verification and cedar hanger."}
          </p>
        </div>
      </div>

      {/* Payment Action Box */}
      <div className="p-6 border border-border bg-surface-muted/30 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sand-100/70 flex items-center justify-center text-charcoal">
            <CreditCard className="w-5 h-5 stroke-1" />
          </div>
          <div>
            <h3 className="font-serif text-base text-charcoal font-normal">
              Razorpay Secured Gateway
            </h3>
            <p className="text-xs text-charcoal-50 font-light">
              UPI, Cards (Visa, Mastercard, Amex), Netbanking, and Wallets
            </p>
          </div>
        </div>

        <div className="bg-sand-50/50 p-4 border border-sand-200/60 text-xs text-charcoal-50 font-light space-y-1.5">
          <div className="flex items-center gap-2 text-charcoal font-medium">
            <Lock className="w-3.5 h-3.5 text-sand-800" />
            <span>Bank-Grade Encryption</span>
          </div>
          <p>
            Your payment is securely processed directly through Razorpay. AURÉLIA does not store or access your credit card numbers or banking passwords.
          </p>
        </div>

        <Button
          type="button"
          onClick={handlePayment}
          disabled={isProcessing || items.length === 0}
          className="w-full h-14 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900 shadow-lg flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Connecting to Secure Gateway...</span>
            </>
          ) : finalTotal === 0 ? (
            <span>Complete Order with Gift Card (₹0 Due)</span>
          ) : (
            <span>Pay {formatPrice(finalTotal)} with Razorpay</span>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isProcessing}
          className="h-12 px-6 text-xs uppercase tracking-luxury font-medium border-border"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          <span>Return to Delivery</span>
        </Button>
      </div>
    </div>
  );
}
