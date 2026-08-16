"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PRESS_MENTIONS, TESTIMONIALS } from "@/lib/data/testimonials";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export function PressQuotes() {
  const [activeTab, setActiveTab] = useState<"press" | "clients">("press");
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeItems = activeTab === "press" ? PRESS_MENTIONS : TESTIMONIALS;

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % activeItems.length);
  };

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);
  };

  return (
    <section className="py-24 bg-background border-b border-border/80 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Tab Toggle */}
        <div className="inline-flex items-center p-1 bg-surface-muted border border-border/80 mb-12">
          <button
            onClick={() => {
              setActiveTab("press");
              setCurrentIndex(0);
            }}
            className={`px-5 py-2 text-xs uppercase tracking-luxury font-medium transition-all ${
              activeTab === "press"
                ? "bg-background text-charcoal shadow-sm border border-border"
                : "text-charcoal-50 hover:text-charcoal"
            }`}
          >
            Press Accolades
          </button>
          <button
            onClick={() => {
              setActiveTab("clients");
              setCurrentIndex(0);
            }}
            className={`px-5 py-2 text-xs uppercase tracking-luxury font-medium transition-all ${
              activeTab === "clients"
                ? "bg-background text-charcoal shadow-sm border border-border"
                : "text-charcoal-50 hover:text-charcoal"
            }`}
          >
            Client Reviews
          </button>
        </div>

        {/* Quote Content with AnimatePresence */}
        <div className="relative min-h-[200px] flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${currentIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mx-auto"
            >
              <Quote className="w-8 h-8 text-sand-300 mx-auto mb-6 opacity-60" />
              <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal font-light leading-relaxed mb-6">
                &ldquo;{activeItems[currentIndex].quote}&rdquo;
              </blockquote>

              <div className="space-y-1">
                <p className="text-xs uppercase tracking-luxury text-sand-800 font-medium">
                  {activeTab === "press"
                    ? (activeItems[currentIndex] as typeof PRESS_MENTIONS[0]).publication
                    : (activeItems[currentIndex] as typeof TESTIMONIALS[0]).author}
                </p>
                <p className="text-[11px] uppercase tracking-wider text-charcoal-50 font-light">
                  {activeTab === "press"
                    ? (activeItems[currentIndex] as typeof PRESS_MENTIONS[0]).date
                    : `${(activeItems[currentIndex] as typeof TESTIMONIALS[0]).location} • Verified Collector`}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Stepper Indicators */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prevItem}
            className="p-2 text-charcoal-50 hover:text-charcoal transition-colors border border-border/80 hover:border-charcoal focus:outline-none"
            aria-label="Previous quote"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {activeItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1 transition-all ${
                  currentIndex === idx ? "w-8 bg-charcoal" : "w-3 bg-border"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextItem}
            className="p-2 text-charcoal-50 hover:text-charcoal transition-colors border border-border/80 hover:border-charcoal focus:outline-none"
            aria-label="Next quote"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
