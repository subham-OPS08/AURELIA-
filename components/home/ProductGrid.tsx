"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/types/product";
import { PRODUCTS as FALLBACK_PRODUCTS } from "@/lib/data/products";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["All", "Women", "Men", "Accessories"] as const;

interface ProductGridProps {
  products?: Product[];
}

export function ProductGrid({ products = FALLBACK_PRODUCTS }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>("All");

  const productList = products && products.length > 0 ? products : FALLBACK_PRODUCTS;

  const filteredProducts =
    activeCategory === "All"
      ? productList
      : productList.filter((p) => p.category === activeCategory);

  return (
    <section id="women" className="py-24 bg-background border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-luxury text-sand font-medium block mb-2">
              Atelier Signatures
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-light tracking-tight">
              New Arrivals & Icons
            </h2>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 border-b border-border/80 pb-2 md:pb-0 md:border-b-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs uppercase tracking-luxury font-medium py-1.5 px-3 transition-all duration-300 relative ${
                  activeCategory === cat
                    ? "text-charcoal bg-surface-muted border border-border"
                    : "text-charcoal-50 hover:text-charcoal border border-transparent"
                }`}
              >
                {cat === "All" ? "All Creations" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA to view entire catalog */}
        <div className="mt-16 text-center">
          <Link href="#all-products">
            <Button
              variant="outline"
              size="lg"
              className="px-10 py-4 group border-border/80 hover:bg-surface-muted"
            >
              <span className="flex items-center gap-2 text-xs uppercase tracking-luxury">
                Discover All {productList.length} Pieces
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
