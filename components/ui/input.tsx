import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "dark" | "underline";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "h-11 w-full border border-border bg-white px-3.5 py-2 text-sm text-charcoal placeholder:text-charcoal-50/70 focus-visible:outline-none focus-visible:border-charcoal transition-colors",
      dark:
        "h-11 w-full border border-neutral-700 bg-neutral-900 px-3.5 py-2 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:border-white transition-colors",
      underline:
        "h-11 w-full border-b border-border bg-transparent px-1 py-2 text-sm text-charcoal placeholder:text-charcoal-50/60 focus-visible:outline-none focus-visible:border-charcoal transition-colors",
    };

    return (
      <input
        type={type}
        className={cn(variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
