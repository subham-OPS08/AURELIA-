"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { COLLECTIONS } from "@/lib/data/collections";

export function FeaturedCollections() {
  return (
    <section id="collections" className="py-24 bg-background border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-luxury text-sand font-medium block mb-2">
              Curated Archives
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-light tracking-tight">
              Seasonal Editions
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-50 font-light max-w-md leading-relaxed">
            Explorations of form, monolithic tailoring, and tactile surfaces developed with world-renowned Italian weaving mills.
          </p>
        </div>

        {/* Collections Grid (Editorial Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {COLLECTIONS.map((col, index) => (
            <Link
              key={col.id}
              href={`#collection-${col.slug}`}
              className="group block relative overflow-hidden bg-sand-100"
            >
              {/* Image Container with Luxury Zoom Effect */}
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center transition-transform duration-1000 ease-luxury group-hover:scale-108"
                />
                {/* Subtle dark gradient overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/90" />
              </div>

              {/* Season & Item Count Badge */}
              <div className="absolute top-5 left-5 right-5 flex justify-between items-center text-[10px] uppercase tracking-luxury text-white/90">
                <span className="px-2.5 py-1 bg-black/40 backdrop-blur-sm border border-white/20">
                  {col.season}
                </span>
                <span className="text-white/70">{col.itemCount} Pieces</span>
              </div>

              {/* Bottom Editorial Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-white mb-2 leading-tight">
                      {col.title}
                    </h3>
                    <p className="text-xs text-white/70 font-light line-clamp-2 leading-relaxed mb-4">
                      {col.subtitle}
                    </p>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-white/40 flex items-center justify-center text-white flex-shrink-0 group-hover:bg-white group-hover:text-charcoal transition-all duration-300 ml-3">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="overflow-hidden h-0 group-hover:h-5 transition-all duration-300">
                  <span className="text-[11px] uppercase tracking-luxury text-sand-300 flex items-center gap-1 font-medium">
                    Explore Archive &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
