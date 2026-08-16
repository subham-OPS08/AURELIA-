import { PressMention, Testimonial } from "@/types/product";

export const PRESS_MENTIONS: PressMention[] = [
  {
    id: "press-1",
    publication: "VOGUE INTERNATIONAL",
    quote: "AURÉLIA represents the pinnacle of contemporary quiet luxury — sculptural purity that eschews logos for impeccable fabric architecture.",
    date: "September 2026",
  },
  {
    id: "press-2",
    publication: "THE FINANCIAL TIMES / HOW TO SPEND IT",
    quote: "A masterclass in restraint. The double-faced cashmere overcoat is the definitive wardrobe investment of the decade.",
    date: "October 2026",
  },
  {
    id: "press-3",
    publication: "HARPER'S BAZAAR",
    quote: "Sensorial luxury at its finest. Every piece feels like a private dialogue between wearer and master artisan.",
    date: "November 2026",
  },
  {
    id: "press-4",
    publication: "WALL STREET JOURNAL STYLE",
    quote: "The wardrobe foundation for discerning collectors who demand absolute precision without ostentation.",
    date: "August 2026",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    quote: "The weight and drape of the cashmere coat is unlike anything I've owned, even compared to Savile Row bespoke. A true modern masterpiece.",
    author: "Elena Rostova",
    location: "Zurich",
    verified: true,
  },
  {
    id: "test-2",
    quote: "The bias-cut silk gown moved like liquid air at the Paris opera. The unlined tailoring shows sheer artisanal mastery.",
    author: "Claire De La Tour",
    location: "Paris",
    verified: true,
  },
  {
    id: "test-3",
    quote: "Ordering was effortless and the white-glove packaging was an unboxing ritual in itself. Exemplary service.",
    author: "Marcus Vance",
    location: "London",
    verified: true,
  }
];
