import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "outline-light" | "ghost" | "link" | "sand" | "dark";
  size?: "sm" | "default" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center text-xs uppercase tracking-luxury font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-charcoal disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none";

    const variants = {
      default:
        "bg-charcoal text-background hover:bg-black active:scale-[0.99] border border-charcoal",
      dark:
        "bg-surface-dark text-background hover:bg-black border border-neutral-800",
      outline:
        "border border-charcoal/40 text-charcoal bg-transparent hover:bg-charcoal hover:text-background hover:border-charcoal",
      "outline-light":
        "border border-white/70 text-white bg-transparent hover:bg-white hover:text-charcoal hover:border-white backdrop-blur-[2px]",
      sand:
        "bg-sand text-white hover:bg-sand-600 border border-sand",
      ghost:
        "text-charcoal hover:bg-charcoal/5 active:bg-charcoal/10",
      link:
        "text-charcoal underline-offset-4 hover:underline p-0 h-auto tracking-widest",
    };

    const sizes = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 px-4 py-1.5 text-[11px]",
      lg: "h-13 px-8 py-3.5 text-[13px]",
      icon: "h-10 w-10 p-0 flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
