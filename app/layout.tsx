import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { CartProvider } from "@/lib/context/CartContext";
import { SearchProvider } from "@/lib/context/SearchContext";
import { QuickViewProvider } from "@/lib/context/QuickViewContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchModal } from "@/components/layout/SearchModal";
import { QuickViewModal } from "@/components/home/QuickViewModal";
import { AuthModal } from "@/components/auth/AuthModal";

export const metadata: Metadata = {
  title: "AURÉLIA Haute Atelier | Quiet Luxury & Architectural Fashion",
  description:
    "Explore the Autumn / Winter 2026 collection by AURÉLIA Atelier. Bespoke Italian cashmere overcoats, pure mulberry silks, and minimalist tailoring designed for enduring elegance.",
  keywords: [
    "Luxury Fashion",
    "Quiet Luxury",
    "Mongolian Cashmere",
    "Haute Atelier",
    "Minimalist Tailoring",
    "Italian Silk Gowns",
    "Designer Clothing",
  ],
  authors: [{ name: "AURÉLIA Atelier Paris" }],
  openGraph: {
    title: "AURÉLIA Haute Atelier — Quiet Luxury, Redefined",
    description:
      "A bespoke fashion house grounded in restraint, material integrity, and architectural silhouette.",
    url: "https://aurelia-atelier.luxury",
    siteName: "AURÉLIA Atelier",
    images: [
      {
        url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "AURÉLIA Atelier Campaign",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-sand selection:text-white">
        <AuthProvider>
          <CartProvider>
            <SearchProvider>
              <QuickViewProvider>
                {/* Persistent Shell Header */}
                <Header darkHero={true} />

                {/* Main App Content */}
                <main id="main-content" className="min-h-screen">
                  {children}
                </main>

                {/* Persistent Shell Footer */}
                <Footer />

                {/* Global Interactive Modals & Drawers */}
                <CartDrawer />
                <SearchModal />
                <QuickViewModal />
                <AuthModal />
              </QuickViewProvider>
            </SearchProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
