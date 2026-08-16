"use client";

import React from "react";
import { Check, Clock, PackageCheck, Truck, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStatusTrackerProps {
  status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "failed";
}

const STAGES = [
  { key: "paid", label: "Acquisition Paid", icon: Clock },
  { key: "processing", label: "Florence Inspection", icon: PackageCheck },
  { key: "shipped", label: "White-Glove Courier", icon: Truck },
  { key: "delivered", label: "Delivered to Residence", icon: Home },
];

export function OrderStatusTracker({ status }: OrderStatusTrackerProps) {
  if (status === "cancelled" || status === "failed") {
    return (
      <div className="p-4 bg-red-50/70 border border-red-200 text-red-800 text-xs">
        <span className="font-medium uppercase tracking-wider block mb-1">
          Status: {status.toUpperCase()}
        </span>
        <p className="font-light">
          This order has been {status}. Please contact the AURÉLIA concierge if you need assistance.
        </p>
      </div>
    );
  }

  const getStageIndex = () => {
    switch (status) {
      case "pending":
        return 0;
      case "paid":
        return 0;
      case "processing":
        return 1;
      case "shipped":
        return 2;
      case "delivered":
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex();

  return (
    <div className="py-6 px-4 bg-surface-muted/40 border border-border">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const Icon = stage.icon;

          return (
            <React.Fragment key={stage.key}>
              <div className="flex flex-col items-center text-center space-y-2">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500",
                    isCompleted
                      ? "bg-charcoal text-white"
                      : isCurrent
                      ? "bg-sand text-white ring-4 ring-sand-100"
                      : "bg-surface text-charcoal-50 border border-border"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4 stroke-1" />}
                </div>

                <span
                  className={cn(
                    "text-[10px] uppercase tracking-luxury font-medium max-w-[90px] leading-tight",
                    isCurrent ? "text-charcoal font-semibold" : isCompleted ? "text-charcoal" : "text-charcoal-50"
                  )}
                >
                  {stage.label}
                </span>
              </div>

              {idx < STAGES.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-[1px] mx-2 transition-colors duration-500",
                    idx < currentIndex ? "bg-charcoal" : "bg-border"
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
