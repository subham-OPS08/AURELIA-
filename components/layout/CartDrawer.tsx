"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { useAuth } from "@/lib/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const router = useRouter();
  const { items, isOpen, closeCart, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const { isAuthenticated, openAuthModal, setPendingCheckout } = useAuth();

  const freeShippingThreshold = 50000;
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleProceedToCheckout = () => {
    closeCart();
    if (isAuthenticated) {
      router.push("/checkout");
    } else {
      setPendingCheckout(true);
      openAuthModal();
    }
  };

  // Lock scroll when open
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
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-screen max-w-md bg-background text-charcoal shadow-2xl flex flex-col justify-between border-l border-border"
            >
              {/* Header */}
              <div className="p-6 border-b border-border/80 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <h2 className="font-serif text-lg tracking-wider uppercase font-normal">
                    Shopping Bag
                  </h2>
                  <span className="text-xs text-charcoal-50 font-sans tracking-widest">
                    ({totalItems} {totalItems === 1 ? "item" : "items"})
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 text-charcoal-50 hover:text-charcoal transition-colors focus:outline-none"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Complimentary Shipping Progress */}
              <div className="bg-sand-50/60 px-6 py-3 border-b border-border/60">
                <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-charcoal-100 mb-1.5">
                  <span>
                    {subtotal >= freeShippingThreshold ? (
                      <strong className="text-sand-800 font-medium">
                        ✓ Complimentary Express Courier Active
                      </strong>
                    ) : (
                      <>
                        Add{" "}
                        <strong className="text-charcoal font-medium">
                          {formatPrice(freeShippingThreshold - subtotal)}
                        </strong>{" "}
                        for Complimentary Courier
                      </>
                    )}
                  </span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="w-full bg-sand-200/50 h-1 overflow-hidden">
                  <div
                    className="bg-sand h-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items List or Empty State */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-sand-100 flex items-center justify-center mb-4 text-sand-700">
                      <ShoppingBag className="w-7 h-7 stroke-1" />
                    </div>
                    <h3 className="font-serif text-xl tracking-wide mb-2">
                      Your bag is empty
                    </h3>
                    <p className="text-xs text-charcoal-50 max-w-xs leading-relaxed mb-6 font-light">
                      Explore our curated collection of timeless garments crafted from the world’s finest natural fibers.
                    </p>
                    <Button onClick={closeCart} variant="outline" size="sm">
                      Discover Collection
                    </Button>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 pb-6 border-b border-border/60 last:border-b-0 group"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-28 bg-sand-100/50 flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="font-serif text-sm text-charcoal leading-snug line-clamp-1">
                              {item.product.name}
                            </h4>
                            <span className="text-xs font-sans font-medium text-charcoal whitespace-nowrap">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                          </div>

                          {/* Variant specs */}
                          <div className="mt-1 flex items-center gap-3 text-[11px] text-charcoal-50 tracking-wider uppercase font-light">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-border inline-block"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                              <span>{item.selectedColor.name}</span>
                            </div>
                            <span>•</span>
                            <span>Size {item.selectedSize}</span>
                          </div>
                        </div>

                        {/* Quantity Stepper and Remove */}
                        <div className="flex items-center justify-between mt-3 pt-2">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-sand-100 text-charcoal transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-3 text-xs font-sans font-medium text-charcoal min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-sand-100 text-charcoal transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-charcoal-50 hover:text-red-700 transition-colors p-1 text-[11px] uppercase tracking-wider flex items-center gap-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer / Summary */}
              {items.length > 0 && (
                <div className="p-6 border-t border-border bg-surface-muted/30 space-y-4">
                  <div className="space-y-1.5 text-xs text-charcoal-50 font-light">
                    <div className="flex justify-between text-charcoal font-normal text-sm pt-1">
                      <span className="font-serif">Subtotal</span>
                      <span className="font-sans font-medium text-base">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Express White-Glove Shipping</span>
                      <span className="text-sand-800 font-medium">Complimentary</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span>Taxes & Duties</span>
                      <span>Calculated at checkout</span>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 flex items-center justify-center gap-2 group bg-charcoal text-white hover:bg-charcoal-900"
                    onClick={handleProceedToCheckout}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-charcoal-50 uppercase tracking-widest text-center pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-sand" />
                    <span>Encrypted 256-Bit Checkout • 30-Day Returns</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
