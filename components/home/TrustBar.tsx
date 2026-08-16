import React from "react";
import { Package, Sparkles, Compass, ShieldCheck } from "lucide-react";

const TRUST_PILLARS = [
  {
    icon: Package,
    title: "Complimentary Delivery",
    desc: "Insured global courier with signature on arrival.",
  },
  {
    icon: Sparkles,
    title: "Bespoke Alterations",
    desc: "Complimentary custom tailoring at all atelier salons.",
  },
  {
    icon: Compass,
    title: "Noble Sourcing",
    desc: "100% traceable cashmere, virgin wool, & pure silk.",
  },
  {
    icon: ShieldCheck,
    title: "Private Concierge",
    desc: "Dedicated personal styling & 30-day effortless returns.",
  },
];

export function TrustBar() {
  return (
    <section className="bg-surface-muted border-b border-border/80 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {TRUST_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex items-start gap-4 p-3 group transition-colors"
              >
                <div className="p-2.5 bg-background border border-border text-sand-800 flex-shrink-0 group-hover:border-sand transition-colors">
                  <Icon className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm text-charcoal font-medium tracking-wide mb-1">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-charcoal-50 font-light leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
