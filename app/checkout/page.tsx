"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { CheckoutSteps } from "@/components/checkout/CheckoutSteps";
import { AddressStep, ShippingAddressData } from "@/components/checkout/AddressStep";
import { DeliveryStep } from "@/components/checkout/DeliveryStep";
import { PaymentStep } from "@/components/checkout/PaymentStep";
import { OrderSummary, GiftCardData } from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const isGuestParam = searchParams.get("guest") === "true";

  const { items } = useCart();
  const { isAuthenticated } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddressData | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [appliedGiftCard, setAppliedGiftCard] = useState<GiftCardData | null>(null);

  // Step 1: Address completed
  const handleAddressContinue = (address: ShippingAddressData) => {
    setShippingAddress(address);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2: Delivery completed
  const handleDeliveryContinue = (method: "standard" | "express") => {
    setDeliveryMethod(method);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-24 bg-background">
        <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center mb-6 text-sand-800">
          <ShoppingBag className="w-8 h-8 stroke-1" />
        </div>
        <span className="text-[10px] uppercase tracking-luxury text-sand-800 font-medium block mb-2">
          AURÉLIA Haute Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-light mb-3">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-charcoal-50 max-w-md font-light leading-relaxed mb-8">
          Please select from our bespoke collection of Italian tailoring and noble silks before proceeding to checkout.
        </p>
        <Link href="/#women">
          <Button className="h-12 px-8 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900">
            Explore Autumn / Winter Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb / Return Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="text-xs uppercase tracking-luxury text-charcoal-50 hover:text-charcoal flex items-center gap-1.5 transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Catalog</span>
          </Link>
        </div>

        {/* Multi-Step Indicator */}
        <CheckoutSteps
          currentStep={currentStep}
          onStepClick={(step) => {
            if (step === 1 || (step === 2 && shippingAddress)) {
              setCurrentStep(step);
            }
          }}
        />

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Interactive Steps Form */}
          <div className="lg:col-span-7 space-y-8">
            {currentStep === 1 && (
              <AddressStep
                initialAddress={shippingAddress}
                onContinue={handleAddressContinue}
                isGuest={isGuestParam || !isAuthenticated}
              />
            )}

            {currentStep === 2 && (
              <DeliveryStep
                initialMethod={deliveryMethod}
                onContinue={handleDeliveryContinue}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && shippingAddress && (
              <PaymentStep
                shippingAddress={shippingAddress}
                deliveryMethod={deliveryMethod}
                appliedGiftCard={appliedGiftCard}
                onBack={() => setCurrentStep(2)}
              />
            )}
          </div>

          {/* Right Column: Persistent Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-32">
              <OrderSummary
                deliveryMethod={deliveryMethod}
                appliedGiftCard={appliedGiftCard}
                onApplyGiftCard={setAppliedGiftCard}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-sand mx-auto" />
            <p className="text-xs uppercase tracking-luxury text-charcoal-50 font-light">
              Preparing Checkout Experience...
            </p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
