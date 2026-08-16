"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/context/AuthContext";
import { useCart } from "@/lib/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Trash2, Loader2, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const supabase = createClient();

  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("wishlist_items")
      .select(`
        id,
        product_id,
        created_at,
        product:products (*)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setWishlistItems(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const handleRemove = async (wishlistId: string) => {
    await supabase.from("wishlist_items").delete().eq("id", wishlistId);
    setWishlistItems((prev) => prev.filter((item) => item.id !== wishlistId));
  };

  const handleAddToCart = (product: any) => {
    const defaultColor = { name: "Oatmeal Melange", hex: "#D8D0C5" };
    addItem(
      {
        ...product,
        images: product.images || [
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop",
        ],
        colors: [defaultColor],
        sizes: ["S", "M", "L"],
      },
      "M",
      defaultColor,
      1
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-charcoal-50 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-sand" />
        <span>Retrieving curated wishlist...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="font-serif text-2xl text-charcoal font-light tracking-tight">
          Curated Client Wishlist
        </h2>
        <p className="text-xs text-charcoal-50 mt-1 font-light">
          Your saved haute couture pieces and limited editions for future commission.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="p-12 bg-surface-muted/40 border border-border text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-sand-100/80 mx-auto flex items-center justify-center text-sand-800">
            <Heart className="w-6 h-6 stroke-1" />
          </div>
          <h3 className="font-serif text-lg text-charcoal font-normal">
            Your Curated Wishlist is Empty
          </h3>
          <p className="text-xs text-charcoal-50 max-w-sm mx-auto font-light leading-relaxed">
            Save iconic overcoats and silk slip gowns as you browse our seasonal archives.
          </p>
          <Link href="/#women" className="inline-block pt-2">
            <Button className="h-10 px-6 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900">
              Discover Archives
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => {
            const product = item.product;
            if (!product) return null;

            return (
              <div
                key={item.id}
                className="group border border-border bg-surface flex flex-col justify-between overflow-hidden"
              >
                <div className="relative aspect-[3/4] w-full bg-sand-100 overflow-hidden">
                  <Image
                    src={
                      product.images?.[0] ||
                      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop"
                    }
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 p-2 bg-background/90 text-charcoal-50 hover:text-red-700 backdrop-blur-sm border border-border/80"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-luxury text-sand-800 font-medium block">
                      {product.category}
                    </span>
                    <h3 className="font-serif text-base text-charcoal font-normal line-clamp-1 mt-0.5">
                      {product.name}
                    </h3>
                    <p className="font-sans font-medium text-xs text-charcoal mt-1">
                      {formatPrice(Number(product.price))}
                    </p>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full h-10 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
