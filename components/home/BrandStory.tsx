"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BrandStory() {
  return (
    <section id="story" className="py-28 bg-surface-muted border-b border-border/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Storytelling (6 cols) */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full bg-sand-200 overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1200&auto=format&fit=crop"
                alt="AURÉLIA Florence Atelier Master Craftsman"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-1000 ease-luxury"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>

            {/* Floating Luxury Atelier Seal */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:right-6 bg-background border border-border p-5 sm:p-6 shadow-2xl max-w-[240px]">
              <div className="flex items-center gap-2 text-sand-800 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-luxury font-medium">
                  Atelier Provenance
                </span>
              </div>
              <p className="font-serif text-sm text-charcoal leading-snug">
                Hand-cut & finished in Biella and Florence, Italy.
              </p>
            </div>
          </div>

          {/* Right Column: Editorial Narrative (6 cols) */}
          <div className="lg:col-span-6 lg:pl-6 space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-luxury text-sand font-medium block mb-3">
                Philosophy & Heritage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-charcoal font-light tracking-tight leading-[1.15] mb-6">
                The Architecture of Restraint
              </h2>
              <blockquote className="font-serif italic text-lg sm:text-xl text-charcoal/80 border-l-2 border-sand pl-4 mb-6 leading-relaxed">
                &ldquo;Luxury is not the accumulation of ornament, but the absolute perfection of what remains when everything superfluous is removed.&rdquo;
              </blockquote>
            </div>

            <p className="text-sm sm:text-base text-charcoal-50 font-light leading-relaxed">
              Founded on the belief that true luxury speaks in a whisper, AURÉLIA works exclusively with heritage Italian and French weaving mills that have refined their noble fiber crafts across four generations.
            </p>

            <p className="text-sm sm:text-base text-charcoal-50 font-light leading-relaxed">
              Every garment is designed as an enduring architectural piece — engineered without fleeting seasonal trends, finished with unlined French seams, and cut to drape effortlessly across decades.
            </p>

            {/* Atelier Metric Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/80">
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-charcoal block font-light">
                  100%
                </span>
                <span className="text-[10px] uppercase tracking-luxury text-charcoal-50">
                  Noble Natural Fibers
                </span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-charcoal block font-light">
                  48h
                </span>
                <span className="text-[10px] uppercase tracking-luxury text-charcoal-50">
                  Hand-Finishing Time
                </span>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl text-charcoal block font-light">
                  Zero
                </span>
                <span className="text-[10px] uppercase tracking-luxury text-charcoal-50">
                  Synthetic Blends
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <Link href="#story">
                <Button variant="outline" size="lg" className="px-8 group">
                  <span className="flex items-center gap-2">
                    Discover Our Story
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
