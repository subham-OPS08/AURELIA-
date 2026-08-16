import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { ProductGrid } from "@/components/home/ProductGrid";
import { BrandStory } from "@/components/home/BrandStory";
import { PressQuotes } from "@/components/home/PressQuotes";
import { Newsletter } from "@/components/home/Newsletter";
import { getProductCatalog } from "@/lib/queries/products";

export const revalidate = 60; // ISR revalidation every 60 seconds

export default async function HomePage() {
  const products = await getProductCatalog();

  return (
    <div className="flex flex-col w-full bg-background overflow-hidden">
      {/* 1. Full-Viewport Luxury Video Hero */}
      <HeroSection />

      {/* 2. Trust Bar Service Pillars */}
      <TrustBar />

      {/* 3. Featured Editorial Collections */}
      <FeaturedCollections />

      {/* 4. Curated New Arrivals & Icons Grid (Supabase Catalog) */}
      <ProductGrid products={products} />

      {/* 5. The Atelier Brand Story & Craftsmanship */}
      <BrandStory />

      {/* 6. Press Mentions & Client Reviews */}
      <PressQuotes />

      {/* 7. Private Invitation Newsletter */}
      <Newsletter />
    </div>
  );
}
