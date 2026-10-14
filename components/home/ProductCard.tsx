"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingBag, Check, Heart } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/context/CartContext";
import { useQuickView } from "@/lib/context/QuickViewContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addItem } = useCart();
  const { openQuickView } = useQuickView();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("aurelia_wishlist");
      if (saved) {
        const list = JSON.parse(saved);
        setIsWishlisted(
          list.some(
            (item: any) =>
              item?.product?.id === product.id || item?.id === product.id
          )
        );
      }
    } catch (e) {
      // ignore
    }
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem("aurelia_wishlist");
      let list = saved ? JSON.parse(saved) : [];
      if (isWishlisted) {
        list = list.filter(
          (item: any) =>
            (item?.product?.id || item?.id) !== product.id
        );
        setIsWishlisted(false);
      } else {
        list.push({ id: `wish-${product.id}`, product });
        setIsWishlisted(true);
      }
      localStorage.setItem("aurelia_wishlist", JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    setTimeout(() => {
      addItem(product, selectedSize, selectedColor, 1);
      setIsAdding(false);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }, 250);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const hasSecondImage = product.images.length > 1;

  return (
    <div
      className="group relative flex flex-col bg-background"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Showcase Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand-50/50 border border-border/40">
        {/* Primary Image */}
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover object-center transition-all duration-700 ease-luxury ${
            isHovered && hasSecondImage
              ? "opacity-0 scale-105"
              : "opacity-100 scale-100"
          }`}
        />

        {/* Secondary Image for Hover-Swap */}
        {hasSecondImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate angle`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover object-center transition-all duration-700 ease-luxury ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        )}

        {/* Top Badges (e.g., NEW ARRIVAL, ICONIC) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.badge && (
            <Badge
              variant={
                product.badge === "ICONIC"
                  ? "dark"
                  : product.badge === "LIMITED EDITION"
                  ? "gold"
                  : "sand"
              }
            >
              {product.badge}
            </Badge>
          )}
        </div>

        {/* Actions (Wishlist & Quick View) */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
          <button
            onClick={toggleWishlist}
            className={`p-2 bg-background/90 hover:bg-background border border-border/80 shadow-sm backdrop-blur-sm transition-colors focus:outline-none ${
              isWishlisted ? "text-red-700" : "text-charcoal hover:text-red-700"
            }`}
            aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            title={isWishlisted ? "In Wishlist" : "Save to Wishlist"}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-700" : ""}`} />
          </button>
          <button
            onClick={handleOpenQuickView}
            className="p-2 bg-background/90 hover:bg-background text-charcoal border border-border/80 shadow-sm backdrop-blur-sm transition-colors focus:outline-none"
            aria-label={`Quick view ${product.name}`}
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Overlay Bar (Slides up on desktop hover) */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="w-full py-2.5 px-4 bg-background/95 hover:bg-white text-charcoal border border-charcoal/20 text-[11px] uppercase tracking-luxury font-medium backdrop-blur-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg active:scale-98"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-sand-800" />
                <span>Added to Bag</span>
              </>
            ) : isAdding ? (
              <span>Preparing...</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-charcoal" />
                <span>Quick Add (Size {selectedSize})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details Info */}
      <div className="pt-4 pb-2 flex flex-col flex-1 justify-between">
        <div>
          {/* Subcategory & Swatches Row */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase tracking-luxury text-sand-800 font-medium">
              {product.subcategory}
            </span>

            {/* Color Swatches */}
            <div className="flex items-center gap-1.5">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedColor(color);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    selectedColor.name === color.name
                      ? "ring-1 ring-charcoal ring-offset-1 scale-110"
                      : "opacity-75 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  aria-label={`Select color ${color.name}`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={handleOpenQuickView}
            className="font-serif text-sm sm:text-base text-charcoal hover:text-sand-800 transition-colors cursor-pointer line-clamp-1 mb-1 font-normal"
          >
            {product.name}
          </h3>

          {/* Tagline / Materials preview */}
          <p className="text-[11px] text-charcoal-50 font-light line-clamp-1 mb-2">
            {product.materials.split(".")[0]}
          </p>
        </div>

        {/* Pricing Row */}
        <div className="flex items-baseline justify-between pt-1 border-t border-border/40">
          <div className="flex items-baseline gap-2">
            <span className="text-xs sm:text-sm font-sans font-medium text-charcoal">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] font-sans text-charcoal-50 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-1.5 text-charcoal hover:text-sand-800 focus:outline-none"
            aria-label="Add to bag"
          >
            {justAdded ? (
              <Check className="w-4 h-4 text-sand-800" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
