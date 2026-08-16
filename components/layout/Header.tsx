"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X, User } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { useSearch } from "@/lib/context/SearchContext";
import { MobileNav } from "./MobileNav";
import { cn } from "@/lib/utils";

interface HeaderProps {
  darkHero?: boolean;
}

export function Header({ darkHero = true }: HeaderProps) {
  const { totalItems, openCart } = useCart();
  const { openSearch } = useSearch();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Determine text color based on scroll and hero state
  const isLightText = darkHero && !isScrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-500 ease-luxury",
          isScrolled
            ? "bg-background/90 backdrop-blur-md border-b border-border/80 py-3.5 shadow-sm"
            : "bg-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Mobile Menu Button (Left on mobile) */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={cn(
                "p-1.5 transition-colors focus:outline-none",
                isLightText ? "text-white hover:text-sand-200" : "text-charcoal hover:text-sand"
              )}
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { label: "Women", href: "#women" },
              { label: "Men", href: "#men" },
              { label: "Collections", href: "#collections" },
              { label: "Atelier", href: "#story" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-xs uppercase tracking-luxury font-medium relative group transition-colors duration-300",
                  isLightText ? "text-white/90 hover:text-white" : "text-charcoal/80 hover:text-charcoal"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover:w-full",
                    isLightText ? "bg-white" : "bg-charcoal"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Brand Wordmark (Center) */}
          <div className="flex-1 lg:flex-none text-center">
            <Link href="/" className="inline-block group">
              <span
                className={cn(
                  "font-serif text-xl sm:text-2xl tracking-[0.28em] font-light transition-all duration-500 block uppercase",
                  isLightText ? "text-white group-hover:text-sand-100" : "text-charcoal group-hover:text-sand-700"
                )}
              >
                Aurélia
              </span>
              <span
                className={cn(
                  "text-[8px] uppercase tracking-luxury-ultrawide block -mt-1 font-sans transition-colors duration-500",
                  isLightText ? "text-white/60" : "text-charcoal/50"
                )}
              >
                Haute Atelier
              </span>
            </Link>
          </div>

          {/* Action Icons (Search, Account, Cart) */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              onClick={openSearch}
              className={cn(
                "p-1.5 transition-colors duration-300 focus:outline-none flex items-center gap-1.5 group",
                isLightText ? "text-white/90 hover:text-white" : "text-charcoal/80 hover:text-charcoal"
              )}
              aria-label="Search Catalog"
            >
              <Search className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="hidden xl:inline-block text-[11px] uppercase tracking-luxury text-inherit font-light">
                Search
              </span>
            </button>

            <Link
              href="/account"
              className={cn(
                "hidden sm:flex items-center gap-1.5 p-1.5 transition-colors duration-300 group",
                isLightText ? "text-white/90 hover:text-white" : "text-charcoal/80 hover:text-charcoal"
              )}
              aria-label="User Account"
            >
              <User className="w-4 h-4 transition-transform group-hover:scale-110" />
              <span className="hidden xl:inline-block text-[11px] uppercase tracking-luxury text-inherit font-light">
                Account
              </span>
            </Link>

            <button
              onClick={openCart}
              className={cn(
                "relative p-1.5 transition-colors duration-300 focus:outline-none flex items-center gap-2 group",
                isLightText ? "text-white/90 hover:text-white" : "text-charcoal/80 hover:text-charcoal"
              )}
              aria-label={`Shopping Bag (${totalItems} items)`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-110" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-sand text-white font-sans text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold tracking-tight">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden md:inline-block text-[11px] uppercase tracking-luxury text-inherit font-light">
                Bag ({totalItems})
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Drawer */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
