"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { User, Package, MapPin, Heart, LogOut, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/account", label: "Client Profile", icon: User },
  { href: "/account/orders", label: "Order History", icon: Package },
  { href: "/account/addresses", label: "Saved Residences", icon: MapPin },
  { href: "/account/wishlist", label: "Curated Wishlist", icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, signOut, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      openAuthModal();
    }
  }, [isLoading, isAuthenticated, openAuthModal]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-sand mx-auto" />
          <p className="text-xs uppercase tracking-luxury text-charcoal-50 font-light">
            Accessing Atelier Records...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-24 bg-background">
        <div className="w-16 h-16 rounded-full bg-sand-100/80 flex items-center justify-center mb-6 text-sand-800">
          <Sparkles className="w-8 h-8 stroke-1" />
        </div>
        <span className="text-[10px] uppercase tracking-luxury text-sand-800 font-medium block mb-2">
          AURÉLIA Haute Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-light mb-3">
          Private Client Authentication Required
        </h1>
        <p className="text-xs text-charcoal-50 max-w-md font-light leading-relaxed mb-8">
          Please sign in to view your orders, manage saved residences, and access concierge services.
        </p>
        <Button
          onClick={openAuthModal}
          className="h-12 px-8 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900"
        >
          Sign In to Account
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="mb-10 pb-6 border-b border-border/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-luxury text-sand font-medium block mb-1">
              Client Portal
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-light tracking-tight">
              Welcome, {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Esteemed Client"}
            </h1>
          </div>
          <span className="text-xs text-charcoal-50 font-light font-mono">
            {user?.email}
          </span>
        </div>

        {/* 2-Column Grid: Sidebar + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3 space-y-1">
            <nav className="flex lg:flex-col flex-wrap gap-1 p-2 bg-surface-muted/30 border border-border">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-luxury font-medium transition-colors w-full",
                      isActive
                        ? "bg-charcoal text-white shadow-sm"
                        : "text-charcoal-100 hover:text-charcoal hover:bg-surface-muted/80"
                    )}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <button
                onClick={async () => {
                  await signOut();
                  router.push("/");
                }}
                className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-luxury font-medium text-charcoal-50 hover:text-red-700 hover:bg-surface-muted/80 transition-colors w-full text-left mt-2 border-t border-border/60"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* Main Account View Content */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
