"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("success");
    setTimeout(() => {
      setEmail("");
      setStatus("idle");
    }, 5000);
  };

  return (
    <section className="py-24 bg-surface-muted border-b border-border/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-[11px] uppercase tracking-luxury text-sand font-medium block mb-3">
          Private Invitation
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-light tracking-tight mb-4">
          Join The Atelier Society
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-50 font-light max-w-xl mx-auto mb-8 leading-relaxed">
          Enjoy complimentary express shipping and 10% off your inaugural creation. Receive private previews of limited edition archives before public release.
        </p>

        {status === "success" ? (
          <div className="max-w-md mx-auto p-4 bg-background border border-sand-300 text-charcoal flex items-center justify-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-sand-800" />
            <span className="text-xs uppercase tracking-luxury font-medium">
              Your 10% welcome code has been dispatched.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-2.5"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="flex-1 h-12 bg-background border border-border px-4 text-xs text-charcoal placeholder:text-charcoal-50/60 focus:outline-none focus:border-charcoal transition-colors font-sans"
            />
            <Button
              type="submit"
              size="lg"
              className="h-12 px-8 flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              <span>Join</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </form>
        )}

        <div className="flex items-center justify-center gap-1.5 mt-4 text-[10px] text-charcoal-50/80 uppercase tracking-widest">
          <Lock className="w-3 h-3" />
          <span>Strictly confidential • Unsubscribe at any time</span>
        </div>
      </div>
    </section>
  );
}
