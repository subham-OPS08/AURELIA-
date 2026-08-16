"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useCart } from "@/lib/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Tag, Loader2, Check, X } from "lucide-react";

export interface GiftCardData {
  id: string;
  code: string;
  balance: number;
}

interface OrderSummaryProps {
  deliveryMethod?: "standard" | "express";
  appliedGiftCard?: GiftCardData | null;
  onApplyGiftCard?: (giftCard: GiftCardData | null) => void;
}

export function OrderSummary({
  deliveryMethod = "standard",
  appliedGiftCard = null,
  onApplyGiftCard,
}: OrderSummaryProps) {
  const { items, subtotal } = useCart();
  const [giftCardInput, setGiftCardInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [giftCardError, setGiftCardError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);

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

  const total = Math.max(0, subtotal + shippingCost - giftCardDiscount);

  const handleValidateGiftCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCardInput.trim()) return;

    setIsValidating(true);
    setGiftCardError(null);

    try {
      const res = await fetch("/api/gift-cards/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: giftCardInput.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setGiftCardError(data.error || "Invalid gift card.");
      } else {
        onApplyGiftCard?.({
          id: data.id,
          code: data.code,
          balance: data.balance,
        });
        setGiftCardInput("");
        setShowInput(false);
      }
    } catch {
      setGiftCardError("Network error while validating gift card.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveGiftCard = () => {
    onApplyGiftCard?.(null);
    setGiftCardError(null);
  };

  return (
    <div className="bg-surface-muted/60 border border-border p-6 lg:p-8 space-y-6">
      <div className="flex items-baseline justify-between border-b border-border/80 pb-4">
        <h3 className="font-serif text-lg font-normal text-charcoal tracking-wide uppercase">
          Order Summary
        </h3>
        <span className="text-xs text-charcoal-50 font-sans">
          {items.length} {items.length === 1 ? "Creation" : "Creations"}
        </span>
      </div>

      {/* Items Scroll Area */}
      <div className="max-h-80 overflow-y-auto space-y-4 pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 py-2 border-b border-border/40 last:border-b-0">
            <div className="relative w-16 h-20 bg-sand-100/50 flex-shrink-0 overflow-hidden border border-border/60">
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                sizes="64px"
                className="object-cover object-center"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between text-xs">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-serif font-normal text-charcoal line-clamp-1">
                    {item.product.name}
                  </h4>
                  <span className="font-sans font-medium text-charcoal whitespace-nowrap">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-charcoal-50 mt-0.5 flex items-center gap-2">
                  <span>Size {item.selectedSize}</span>
                  <span>•</span>
                  <span>{item.selectedColor.name}</span>
                </div>
              </div>
              <span className="text-[10px] text-charcoal-50">Qty: {item.quantity}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Promo / Gift Card Input Accordion */}
      <div className="border-t border-border/80 pt-4">
        {appliedGiftCard ? (
          <div className="flex items-center justify-between p-3 bg-sand-50 border border-sand-200 text-xs">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-sand-800" />
              <div>
                <span className="font-medium text-charcoal">{appliedGiftCard.code}</span>
                <span className="text-[11px] text-sand-800 block">
                  -{formatPrice(giftCardDiscount)} applied
                </span>
              </div>
            </div>
            <button
              onClick={handleRemoveGiftCard}
              className="text-charcoal-50 hover:text-red-700 p-1"
              title="Remove Gift Card"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div>
            {!showInput ? (
              <button
                type="button"
                onClick={() => setShowInput(true)}
                className="text-xs uppercase tracking-luxury text-sand-800 hover:text-charcoal flex items-center gap-1.5 font-medium transition-colors"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Have a gift card or VIP promo code?</span>
              </button>
            ) : (
              <form onSubmit={handleValidateGiftCard} className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter code (e.g. AURELIA-WELCOME)"
                    value={giftCardInput}
                    onChange={(e) => setGiftCardInput(e.target.value.toUpperCase())}
                    className="h-9 text-xs uppercase tracking-wider bg-background border-border focus:border-charcoal flex-1"
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isValidating || !giftCardInput.trim()}
                    className="h-9 px-4 text-xs uppercase tracking-luxury font-medium bg-background"
                  >
                    {isValidating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
                  </Button>
                </div>
                {giftCardError && (
                  <p className="text-[11px] text-red-700 font-light leading-tight">
                    {giftCardError}
                  </p>
                )}
              </form>
            )}
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2.5 text-xs border-t border-border/80 pt-4 font-light text-charcoal-50">
        <div className="flex justify-between text-charcoal">
          <span>Subtotal</span>
          <span className="font-medium font-sans">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Delivery ({deliveryMethod === "express" ? "Express Courier" : "White-Glove"})</span>
          <span className={shippingCost === 0 ? "text-sand-800 font-medium" : "text-charcoal font-sans"}>
            {shippingCost === 0 ? "Complimentary" : formatPrice(shippingCost)}
          </span>
        </div>

        {giftCardDiscount > 0 && (
          <div className="flex justify-between text-sand-800 font-medium">
            <span>Gift Card Deduction</span>
            <span>-{formatPrice(giftCardDiscount)}</span>
          </div>
        )}

        <div className="flex justify-between text-[11px]">
          <span>Duties & Taxes</span>
          <span className="text-charcoal-50">Inclusive</span>
        </div>
      </div>

      {/* Total Due */}
      <div className="border-t border-charcoal/20 pt-4 flex justify-between items-baseline">
        <div>
          <span className="font-serif text-base text-charcoal block">Total Due</span>
          <span className="text-[10px] text-charcoal-50 font-light">All taxes included</span>
        </div>
        <span className="font-sans font-medium text-xl text-charcoal">
          {formatPrice(total)}
        </span>
      </div>

      {/* Luxury Trust Pillar */}
      <div className="pt-2 flex items-center justify-center gap-2 text-[10px] text-charcoal-50 uppercase tracking-widest text-center border-t border-border/40">
        <ShieldCheck className="w-3.5 h-3.5 text-sand" />
        <span>Encrypted 256-Bit Checkout • Hand-inspected</span>
      </div>
    </div>
  );
}
