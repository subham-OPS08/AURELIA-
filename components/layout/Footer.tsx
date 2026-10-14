"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail("");
      }, 4000);
    }
  };

  return (
    <footer className="bg-surface-dark text-white/80 pt-20 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section: Brand Statement & Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-neutral-800">
          <div className="lg:col-span-5 space-y-6">
            <span className="font-serif text-2xl tracking-[0.25em] text-white block uppercase">
              AURÉLIA
            </span>
            <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-md">
              A bespoke fashion house grounded in restraint, material integrity, and architectural silhouette. Designed in Paris, meticulously hand-crafted in Italian and French ateliers.
            </p>
            <div className="flex items-center gap-6 pt-2">
              {["Instagram", "Pinterest", "Spotify", "Editorial"].map((item) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xs uppercase tracking-luxury text-neutral-400 hover:text-white transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 lg:pl-12">
            <div className="bg-neutral-900/60 border border-neutral-800 p-8">
              <span className="text-[11px] uppercase tracking-luxury text-sand-300 block mb-2 font-medium">
                The Atelier Dispatch
              </span>
              <h3 className="font-serif text-2xl text-white mb-2">
                Receive private collection invitations & 10% off your inaugural order.
              </h3>
              <p className="text-xs text-neutral-400 mb-6 font-light">
                Curated seasonal previews, private salon access, and architectural notes delivered once per month.
              </p>

              {isSubscribed ? (
                <div className="flex items-center gap-2 text-sand-300 text-sm py-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Your invitation has been reserved. Welcome to AURÉLIA.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 bg-neutral-800/80 border border-neutral-700 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-sand transition-colors"
                  />
                  <Button
                    type="submit"
                    variant="sand"
                    className="h-12 px-8 flex items-center justify-center gap-2 group whitespace-nowrap"
                  >
                    <span>Subscribe</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Middle Section: Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 border-b border-neutral-800 text-xs">
          <div>
            <h4 className="text-xs uppercase tracking-luxury text-white font-medium mb-4">
              Collections
            </h4>
            <ul className="space-y-3 font-light text-neutral-400">
              <li>
                <Link href="#women" className="hover:text-white transition-colors">
                  Women&apos;s Ready-to-Wear
                </Link>
              </li>
              <li>
                <Link href="#men" className="hover:text-white transition-colors">
                  Men&apos;s Tailoring
                </Link>
              </li>
              <li>
                <Link href="#cashmere" className="hover:text-white transition-colors">
                  Mongolian Cashmere
                </Link>
              </li>
              <li>
                <Link href="#silks" className="hover:text-white transition-colors">
                  Mulberry Silks
                </Link>
              </li>
              <li>
                <Link href="#leather" className="hover:text-white transition-colors">
                  Tuscan Leather Goods
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-luxury text-white font-medium mb-4">
              Client Services
            </h4>
            <ul className="space-y-3 font-light text-neutral-400">
              <li>
                <Link href="/account" className="hover:text-white transition-colors">
                  Client Portal & Orders
                </Link>
              </li>
              <li>
                <Link href="/account/wishlist" className="hover:text-white transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link href="#concierge" className="hover:text-white transition-colors">
                  Private Styling Concierge
                </Link>
              </li>
              <li>
                <Link href="#shipping" className="hover:text-white transition-colors">
                  Complimentary Shipping
                </Link>
              </li>
              <li>
                <Link href="#returns" className="hover:text-white transition-colors">
                  Exchanges & Returns
                </Link>
              </li>
              <li>
                <Link href="#alterations" className="hover:text-white transition-colors">
                  Bespoke Alterations
                </Link>
              </li>
              <li>
                <Link href="#care" className="hover:text-white transition-colors">
                  Garment Preservation Guide
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-luxury text-white font-medium mb-4">
              The Atelier
            </h4>
            <ul className="space-y-3 font-light text-neutral-400">
              <li>
                <Link href="#story" className="hover:text-white transition-colors">
                  Philosophy & Provenance
                </Link>
              </li>
              <li>
                <Link href="#sustainability" className="hover:text-white transition-colors">
                  Artisanal Traceability
                </Link>
              </li>
              <li>
                <Link href="#materials" className="hover:text-white transition-colors">
                  Fabric Sourcing Standards
                </Link>
              </li>
              <li>
                <Link href="#press" className="hover:text-white transition-colors">
                  Press & Media Archive
                </Link>
              </li>
              <li>
                <Link href="#careers" className="hover:text-white transition-colors">
                  Atelier Apprenticeships
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-luxury text-white font-medium mb-4">
              Locations & Boutique
            </h4>
            <div className="space-y-3 font-light text-neutral-400 leading-relaxed">
              <p>
                <strong className="text-white font-medium">Paris Flagship</strong>
                <br />
                28 Place Vendôme, 75001 Paris
              </p>
              <p>
                <strong className="text-white font-medium">London Salon</strong>
                <br />
                14 Mount Street, Mayfair, London
              </p>
              <p>
                <strong className="text-white font-medium">New York Suite</strong>
                <br />
                740 Madison Avenue, New York
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Legal, Currency & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div className="flex items-center gap-6 font-light">
            <span>© {new Date().getFullYear()} AURÉLIA ATELIER INC.</span>
            <Link href="#privacy" className="hover:text-neutral-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#terms" className="hover:text-neutral-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="#accessibility" className="hover:text-neutral-300 transition-colors">
              Accessibility
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-neutral-400">
              <Globe className="w-3.5 h-3.5" />
              <span>International • USD ($)</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-400 text-[10px] tracking-widest uppercase border-l border-neutral-800 pl-4">
              <span>Visa</span>
              <span>•</span>
              <span>Mastercard</span>
              <span>•</span>
              <span>Amex</span>
              <span>•</span>
              <span>Apple Pay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
