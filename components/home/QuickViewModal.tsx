"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShieldCheck, Truck, RefreshCw, ChevronDown, Plus, Minus } from "lucide-react";
import { useQuickView } from "@/lib/context/QuickViewContext";
import { useCart } from "@/lib/context/CartContext";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function QuickViewModal() {
  const { product, isOpen, closeQuickView } = useQuickView();
  const { addItem } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("details");
  const [isAdded, setIsAdded] = useState(false);

  // Sync state when product changes
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeQuickView();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeQuickView]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) return;
    addItem(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      closeQuickView();
    }, 500);
  };

  const toggleAccordion = (key: string) => {
    setActiveAccordion((prev) => (prev === key ? null : key));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeQuickView}
            className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative min-h-screen flex items-center justify-center p-3 sm:p-6 lg:p-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-4xl bg-background border border-border shadow-2xl overflow-hidden my-6"
            >
              {/* Close Button */}
              <button
                onClick={closeQuickView}
                className="absolute top-4 right-4 z-20 p-2 bg-background/80 hover:bg-background text-charcoal rounded-full border border-border backdrop-blur-sm transition-colors focus:outline-none"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
                {/* Left Column: Image Gallery (6 cols) */}
                <div className="md:col-span-6 bg-sand-50/50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border">
                  {/* Main Display Image */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand-100">
                    <Image
                      src={product.images[activeImageIndex] || product.images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-center transition-all duration-500"
                    />
                    {product.badge && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="dark">{product.badge}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {product.images.length > 1 && (
                    <div className="flex items-center gap-3 mt-4">
                      {product.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`relative w-16 h-20 bg-sand-100 border overflow-hidden transition-all ${
                            activeImageIndex === idx
                              ? "border-charcoal ring-1 ring-charcoal"
                              : "border-border/60 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <Image
                            src={img}
                            alt={`${product.name} thumbnail ${idx + 1}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Column: Product Customizer & Details (6 cols) */}
                <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
                  <div>
                    {/* Category & Serial */}
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-luxury text-sand-800 font-medium mb-1.5">
                      <span>{product.category} • {product.subcategory}</span>
                      <span className="text-charcoal-50 font-sans">REF-{product.id}</span>
                    </div>

                    {/* Product Name */}
                    <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-light mb-2">
                      {product.name}
                    </h2>

                    {/* Price */}
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-lg font-sans font-medium text-charcoal">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs font-sans text-charcoal-50 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                      <span className="text-[10px] uppercase tracking-wider text-sand-800 bg-sand-100 px-2 py-0.5">
                        Taxes Included
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-charcoal-50 font-light leading-relaxed mb-6">
                      {product.description}
                    </p>

                    {/* Color Selection */}
                    <div className="mb-5">
                      <div className="flex justify-between items-center text-xs uppercase tracking-wider text-charcoal mb-2">
                        <span className="font-medium">Color:</span>
                        <span className="text-charcoal-50 font-light">
                          {selectedColor?.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {product.colors.map((c) => (
                          <button
                            key={c.name}
                            onClick={() => setSelectedColor(c)}
                            className={`flex items-center gap-2 px-3 py-1.5 border text-xs transition-all ${
                              selectedColor?.name === c.name
                                ? "border-charcoal bg-surface-muted"
                                : "border-border/80 hover:border-charcoal/50"
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size Selection */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center text-xs uppercase tracking-wider text-charcoal mb-2">
                        <span className="font-medium">Select Size:</span>
                        <button
                          onClick={() => alert("Size Guide: Standard European tailored fit. Order your normal size or contact Atelier Concierge for bespoke sizing.")}
                          className="text-sand-800 underline underline-offset-2 hover:text-charcoal transition-colors font-light text-[11px]"
                        >
                          Size Guide
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`min-w-[44px] h-10 px-3 flex items-center justify-center text-xs uppercase font-medium transition-all ${
                              selectedSize === s
                                ? "bg-charcoal text-white border border-charcoal"
                                : "bg-transparent text-charcoal border border-border hover:border-charcoal"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quantity and Add to Bag */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex items-center border border-border h-12">
                        <button
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="px-3 h-full hover:bg-sand-100 transition-colors text-charcoal"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-sans font-medium text-charcoal min-w-[28px] text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => setQuantity((q) => q + 1)}
                          className="px-3 h-full hover:bg-sand-100 transition-colors text-charcoal"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <Button
                        onClick={handleAddToCart}
                        className="flex-1 h-12 text-xs uppercase tracking-luxury font-medium"
                      >
                        {isAdded ? (
                          <span className="flex items-center gap-2">
                            <Check className="w-4 h-4" /> Added to Bag
                          </span>
                        ) : (
                          <span>Add to Bag • {formatPrice(product.price * quantity)}</span>
                        )}
                      </Button>
                    </div>

                    {/* Guarantee Strip */}
                    <div className="grid grid-cols-2 gap-2 pt-2 pb-4 text-[11px] text-charcoal-50 font-light border-t border-border/60">
                      <div className="flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-sand-800" />
                        <span>Complimentary Courier</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 text-sand-800" />
                        <span>30-Day Atelier Returns</span>
                      </div>
                    </div>

                    {/* Accordion Specs */}
                    <div className="border-t border-border/60 divide-y divide-border/60 text-xs">
                      {/* Details & Origin */}
                      <div>
                        <button
                          onClick={() => toggleAccordion("details")}
                          className="w-full py-3 flex justify-between items-center text-charcoal uppercase tracking-wider text-left font-medium"
                        >
                          <span>Artisanal Details & Origin</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              activeAccordion === "details" ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {activeAccordion === "details" && (
                          <div className="pb-3 text-charcoal-50 font-light space-y-1.5">
                            <ul className="list-disc list-inside space-y-1">
                              {product.details.map((d, i) => (
                                <li key={i}>{d}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Fabric & Care */}
                      <div>
                        <button
                          onClick={() => toggleAccordion("care")}
                          className="w-full py-3 flex justify-between items-center text-charcoal uppercase tracking-wider text-left font-medium"
                        >
                          <span>Materials & Preservation</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              activeAccordion === "care" ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {activeAccordion === "care" && (
                          <div className="pb-3 text-charcoal-50 font-light space-y-2">
                            <p>
                              <strong>Materials:</strong> {product.materials}
                            </p>
                            <p>
                              <strong>Care:</strong> {product.care}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
