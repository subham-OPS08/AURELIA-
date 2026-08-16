import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "sand" | "outline" | "dark" | "gold";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-medium tracking-luxury transition-colors select-none";

  const variants = {
    default: "bg-surface-subtle text-charcoal border border-border",
    sand: "bg-sand-100 text-sand-800 border border-sand-200",
    gold: "bg-gold-light/30 text-sand-800 border border-gold-muted/40",
    dark: "bg-charcoal text-background border border-charcoal",
    outline: "border border-border text-charcoal-100 bg-transparent",
  };

  return <div className={cn(baseStyles, variants[variant], className)} {...props} />;
}

export { Badge };
