"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import { useSearch } from "@/lib/context/SearchContext";
import { useQuickView } from "@/lib/context/QuickViewContext";
import { PRODUCTS } from "@/lib/data/products";
import { formatPrice } from "@/lib/utils";

const TRENDING_SEARCHES = [
  "Cashmere Coat",
  "Mulberry Silk",
  "Architectural Blazer",
  "Trousers",
  "Leather Tote",
];

export function SearchModal() {
  const { isOpen, closeSearch } = useSearch();
  const { openQuickView } = useQuickView();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus on input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeSearch]);

  const filteredProducts = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Search Content Container */}
          <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 lg:p-12">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl bg-background border border-border shadow-2xl overflow-hidden mt-8 sm:mt-16"
            >
              {/* Search Bar */}
              <div className="flex items-center px-6 py-5 border-b border-border/80 gap-4">
                <Search className="w-5 h-5 text-charcoal-50" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by garment, fabric, or collection..."
                  className="flex-1 bg-transparent text-charcoal text-base sm:text-lg focus:outline-none placeholder:text-charcoal-50/60 font-serif"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="p-1 text-charcoal-50 hover:text-charcoal transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={closeSearch}
                  className="text-xs uppercase tracking-luxury text-charcoal-50 hover:text-charcoal transition-colors pl-2 border-l border-border"
                >
                  Close
                </button>
              </div>

              {/* Suggestions / Results */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {query.trim() === "" ? (
                  <div>
                    <h3 className="text-xs uppercase tracking-luxury text-charcoal-50 mb-3 font-medium">
                      Trending Searches
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setQuery(tag)}
                          className="px-3.5 py-1.5 bg-surface-muted hover:bg-sand-100 text-xs text-charcoal transition-colors border border-border/60"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="font-serif text-lg text-charcoal mb-1">
                      No results found for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-xs text-charcoal-50 font-light">
                      Please check the spelling or search for broader categories like Outerwear, Silk, or Wool.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs text-charcoal-50 uppercase tracking-wider pb-2 border-b border-border/60">
                      <span>Products ({filteredProducts.length})</span>
                      <span>Click to preview</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredProducts.map((prod) => (
                        <div
                          key={prod.id}
                          onClick={() => {
                            closeSearch();
                            openQuickView(prod);
                          }}
                          className="flex gap-3 p-2 hover:bg-surface-muted cursor-pointer transition-colors border border-transparent hover:border-border group"
                        >
                          <div className="relative w-16 h-20 bg-sand-100 flex-shrink-0 overflow-hidden">
                            <Image
                              src={prod.images[0]}
                              alt={prod.name}
                              fill
                              sizes="64px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                            <span className="text-[10px] uppercase tracking-luxury text-sand-800 font-medium">
                              {prod.subcategory}
                            </span>
                            <h4 className="font-serif text-sm text-charcoal line-clamp-1 group-hover:text-sand-700 transition-colors">
                              {prod.name}
                            </h4>
                            <span className="text-xs font-sans font-medium text-charcoal mt-1">
                              {formatPrice(prod.price)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
