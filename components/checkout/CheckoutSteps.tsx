"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutStepsProps {
  currentStep: number; // 1, 2, or 3
  onStepClick?: (step: number) => void;
}

const STEPS = [
  { step: 1, label: "Shipping Address" },
  { step: 2, label: "Delivery Method" },
  { step: 3, label: "Payment & Confirmation" },
];

export function CheckoutSteps({ currentStep, onStepClick }: CheckoutStepsProps) {
  return (
    <div className="w-full mb-8 pb-6 border-b border-border/80">
      <div className="flex items-center justify-between max-w-2xl">
        {STEPS.map((s, index) => {
          const isCompleted = s.step < currentStep;
          const isCurrent = s.step === currentStep;
          const isClickable = s.step < currentStep && onStepClick;

          return (
            <React.Fragment key={s.step}>
              <div
                onClick={() => isClickable && onStepClick(s.step)}
                className={cn(
                  "flex items-center gap-3 transition-colors",
                  isClickable && "cursor-pointer group"
                )}
              >
                {/* Step Circle Indicator */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                    isCompleted
                      ? "bg-charcoal text-white"
                      : isCurrent
                      ? "bg-sand text-white ring-4 ring-sand-100"
                      : "bg-surface-muted text-charcoal-50 border border-border"
                  )}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.step}
                </div>

                {/* Step Label */}
                <div className="hidden sm:block">
                  <span
                    className={cn(
                      "text-[11px] uppercase tracking-luxury font-medium transition-colors block",
                      isCurrent
                        ? "text-charcoal"
                        : isCompleted
                        ? "text-charcoal-100 group-hover:text-charcoal"
                        : "text-charcoal-50"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-[1px] mx-4 transition-colors duration-300",
                    s.step < currentStep ? "bg-charcoal" : "bg-border"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
