"use client";

import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Truck, Sparkles, Check, ArrowLeft } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";

interface DeliveryStepProps {
  initialMethod: "standard" | "express";
  onContinue: (method: "standard" | "express") => void;
  onBack: () => void;
}

export function DeliveryStep({ initialMethod, onContinue, onBack }: DeliveryStepProps) {
  const [selectedMethod, setSelectedMethod] = useState<"standard" | "express">(initialMethod);
  const { subtotal } = useCart();

  const isFreeStandard = subtotal >= 50000;
  const standardCost = isFreeStandard ? 0 : 1500;
  const expressCost = 2500;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onContinue(selectedMethod);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-[11px] uppercase tracking-luxury text-sand font-medium block mb-1">
          Step 2 of 3
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-light tracking-tight">
          Select Delivery Experience
        </h2>
        <p className="text-xs text-charcoal-50 mt-1 font-light">
          Every AURÉLIA piece is prepared with museum-grade garment preservation and shipped insured.
        </p>
      </div>

      <div className="space-y-4">
        {/* Standard Option */}
        <div
          onClick={() => setSelectedMethod("standard")}
          className={`p-6 border cursor-pointer transition-all relative ${
            selectedMethod === "standard"
              ? "border-charcoal bg-surface shadow-sm ring-1 ring-charcoal"
              : "border-border/80 bg-surface-muted/40 hover:border-charcoal/40"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-sand-100/60 flex items-center justify-center text-sand-800 flex-shrink-0 mt-0.5">
                <Truck className="w-5 h-5 stroke-1" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base text-charcoal font-normal">
                    Standard White-Glove Courier
                  </h3>
                  {isFreeStandard && (
                    <span className="text-[10px] uppercase tracking-wider bg-sand-100 text-sand-800 px-2 py-0.5 font-medium">
                      Complimentary
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal-50 font-light mt-1">
                  Estimated Arrival: 3–5 Business Days
                </p>
                <p className="text-[11px] text-charcoal-50 font-light mt-2 leading-relaxed">
                  • Fully insured transit with signature requirement upon delivery
                  <br />
                  • Includes breathable organic cotton garment cover and cedar hanger
                </p>
              </div>
            </div>
            <span className="font-sans font-medium text-xs text-charcoal whitespace-nowrap">
              {standardCost === 0 ? "Free" : formatPrice(standardCost)}
            </span>
          </div>
        </div>

        {/* Express Bespoke Option */}
        <div
          onClick={() => setSelectedMethod("express")}
          className={`p-6 border cursor-pointer transition-all relative ${
            selectedMethod === "express"
              ? "border-charcoal bg-surface shadow-sm ring-1 ring-charcoal"
              : "border-border/80 bg-surface-muted/40 hover:border-charcoal/40"
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-sand-100/60 flex items-center justify-center text-sand-800 flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 stroke-1 text-sand-800" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-base text-charcoal font-normal">
                    Atelier Express Bespoke Dispatch
                  </h3>
                  <span className="text-[10px] uppercase tracking-wider bg-charcoal text-white px-2 py-0.5 font-medium">
                    VIP
                  </span>
                </div>
                <p className="text-xs text-charcoal-50 font-light mt-1">
                  Estimated Arrival: 1–2 Business Days (Priority Queue)
                </p>
                <p className="text-[11px] text-charcoal-50 font-light mt-2 leading-relaxed">
                  • Priority hand-finishing and inspection by Master Tailor
                  <br />
                  • Dedicated private courier vehicle with live SMS coordination
                  <br />
                  • Complimentary handheld garment steamer kit included
                </p>
              </div>
            </div>
            <span className="font-sans font-medium text-xs text-charcoal whitespace-nowrap">
              {formatPrice(expressCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 pt-4 border-t border-border/80">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-12 px-6 text-xs uppercase tracking-luxury font-medium border-border"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-2" />
          <span>Return to Address</span>
        </Button>

        <Button
          type="submit"
          className="h-12 px-8 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900"
        >
          Continue to Payment
        </Button>
      </div>
    </form>
  );
}
