"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { User, Package, MapPin, Heart, LogIn, LogOut, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_ITEMS = [
  { href: "/account", label: "Client Profile & Settings", icon: User },
  { href: "/account/orders", label: "Order History & Tracking", icon: Package },
  { href: "/account/addresses", label: "Saved Residences", icon: MapPin },
  { href: "/account/wishlist", label: "Curated Wishlist", icon: Heart },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, signOut, openAuthModal } = useAuth();

  return (
    <div className="min-h-screen bg-background pt-28 pb-24 border-b border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Banner */}
        <div className="mb-10 pb-6 border-b border-border/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-luxury text-sand font-medium">
                Client Portal
              </span>
              <span className="text-[10px] uppercase tracking-wider bg-sand-100/80 text-sand-800 px-2 py-0.5 border border-sand-200">
                {isAuthenticated ? "VIP Atelier Member" : "Guest Client"}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-light tracking-tight">
              {isAuthenticated
                ? `Welcome, ${user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Esteemed Client"}`
                : "Account Settings & Client Portal"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-charcoal-50 font-light font-mono hidden sm:inline">
                  {user?.email}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await signOut();
                    router.push("/");
                  }}
                  className="h-9 px-4 text-[11px] uppercase tracking-luxury font-medium border-border hover:bg-surface-muted"
                >
                  <LogOut className="w-3.5 h-3.5 mr-1.5" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <Button
                onClick={openAuthModal}
                size="sm"
                className="h-9 px-5 text-[11px] uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900 flex items-center gap-2"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Sync Cloud</span>
              </Button>
            )}
          </div>
        </div>

        {/* Guest Synchronization Notice */}
        {!isAuthenticated && (
          <div className="mb-8 p-4 bg-sand-50/60 border border-sand-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sand-100 text-sand-800 rounded-none border border-sand-200">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-medium text-charcoal">
                  You are currently managing local client preferences & residences.
                </p>
                <p className="text-[11px] text-charcoal-50 font-light">
                  Sign in or create a complimentary atelier account to synchronize your orders and addresses across all devices.
                </p>
              </div>
            </div>
            <Button
              onClick={openAuthModal}
              variant="outline"
              size="sm"
              className="h-8 px-4 text-[10px] uppercase tracking-luxury border-charcoal/40 hover:bg-charcoal hover:text-white whitespace-nowrap"
            >
              Authenticate Account
            </Button>
          </div>
        )}

        {/* 2-Column Grid: Navigation Sidebar + Settings Content */}
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

              {isAuthenticated ? (
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
              ) : (
                <button
                  onClick={openAuthModal}
                  className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-luxury font-medium text-sand-800 hover:bg-surface-muted/80 transition-colors w-full text-left mt-2 border-t border-border/60"
                >
                  <LogIn className="w-4 h-4 flex-shrink-0" />
                  <span>Sign In</span>
                </button>
              )}
            </nav>

            {/* Atelier Concierge Box */}
            <div className="p-5 bg-surface border border-border space-y-2 mt-4 hidden lg:block">
              <div className="flex items-center gap-2 text-sand-800">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-luxury font-medium">
                  Atelier Concierge
                </span>
              </div>
              <p className="text-[11px] text-charcoal-50 font-light leading-relaxed">
                Need bespoke alterations or private styling assistance? Contact your dedicated concierge specialist.
              </p>
              <a
                href="mailto:concierge@aurelia-atelier.luxury"
                className="inline-block text-[11px] uppercase tracking-luxury text-charcoal hover:text-sand-800 font-medium underline underline-offset-4 pt-1"
              >
                concierge@aurelia.luxury
              </a>
            </div>
          </aside>

          {/* Main Account View Content */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
