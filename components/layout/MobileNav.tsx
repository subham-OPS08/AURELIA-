"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Globe } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { label: "Women's Collection", href: "/#women", count: "48 pieces" },
  { label: "Men's Collection", href: "/#men", count: "36 pieces" },
  { label: "Featured Collections", href: "/#collections", count: "A/W 26" },
  { label: "The Atelier Story", href: "/#story", count: "Craftsmanship" },
  { label: "Saved Wishlist", href: "/account/wishlist", count: "Curated" },
  { label: "Client Account", href: "/account", count: "Portal" },
];

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // Prevent scrolling when mobile nav is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 bg-surface-dark/95 backdrop-blur-xl text-background flex flex-col justify-between p-6 sm:p-10 lg:hidden"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <span className="font-serif text-lg tracking-luxury uppercase">
              AURÉLIA
            </span>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white transition-colors focus:outline-none"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Staggered Navigation Links */}
          <div className="py-8 flex-1 flex flex-col justify-center space-y-6">
            {navLinks.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.1 + index * 0.08,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-baseline justify-between py-2 border-b border-white/5 hover:border-white/20 transition-colors"
                >
                  <span className="font-serif text-2xl sm:text-3xl text-white/90 group-hover:text-sand-300 transition-colors">
                    {item.label}
                  </span>
                  <span className="text-[11px] font-sans uppercase tracking-luxury text-white/40 group-hover:text-white/70 flex items-center gap-1 transition-colors">
                    {item.count}
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Footer Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="border-t border-white/10 pt-6 space-y-4"
          >
            <div className="flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5" />
                <span className="tracking-widest uppercase">Global / USD ($)</span>
              </div>
              <span className="tracking-widest uppercase text-sand-300">
                Complimentary Courier Delivery
              </span>
            </div>
            <p className="text-[10px] text-white/40 tracking-luxury uppercase">
              © {new Date().getFullYear()} AURÉLIA ATELIER. ALL RIGHTS RESERVED.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
