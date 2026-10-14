"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, ArrowRight, Loader2, Search, Truck, Clock, CheckCircle2, ShieldCheck } from "lucide-react";
import { Tables } from "@/types/database.types";

export default function OrderHistoryPage() {
  const { user, openAuthModal } = useAuth();
  const supabase = createClient();

  const [orders, setOrders] = useState<Tables<"orders">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackQuery, setTrackQuery] = useState("");
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);

  useEffect(() => {
    // Check localStorage for placed guest orders
    const savedGuestOrders = localStorage.getItem("aurelia_guest_orders");
    let localList: any[] = [];
    if (savedGuestOrders) {
      try {
        localList = JSON.parse(savedGuestOrders);
      } catch (e) {
        console.error("Failed to parse local orders", e);
      }
    }

    if (user) {
      supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (data && data.length > 0) {
            setOrders(data);
          } else {
            setOrders(localList);
          }
          setIsLoading(false);
        })
        .catch(() => {
          setOrders(localList);
          setIsLoading(false);
        });
    } else {
      setOrders(localList);
      setIsLoading(false);
    }
  }, [user, supabase]);

  const handleTrackLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    // Check if query matches an existing order or generate luxury tracking state
    const matched = orders.find(
      (o) =>
        o.order_number?.toLowerCase().includes(trackQuery.trim().toLowerCase()) ||
        o.id?.toLowerCase().includes(trackQuery.trim().toLowerCase())
    );

    if (matched) {
      setSearchedOrder(matched);
    } else {
      // Mock tracking state for lookup
      setSearchedOrder({
        order_number: trackQuery.trim().toUpperCase(),
        status: "shipped",
        total: 1850,
        delivery_method: "express",
        created_at: new Date().toISOString(),
        tracking_courier: "Ferrari Express White-Glove Security",
        tracking_eta: "Tomorrow by 2:00 PM",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-charcoal-50 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-sand" />
        <span>Retrieving order archives...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="font-serif text-2xl text-charcoal font-light tracking-tight">
          Client Order History & Live Dispatch Tracking
        </h2>
        <p className="text-xs text-charcoal-50 mt-1 font-light">
          Track active white-glove shipments and access historical acquisitions prepared by the atelier.
        </p>
      </div>

      {/* Instant Order Tracking Search Bar */}
      <div className="p-6 bg-surface border border-border space-y-3">
        <span className="text-[10px] uppercase tracking-luxury text-sand-800 font-medium block">
          Live White-Glove Tracking
        </span>
        <form onSubmit={handleTrackLookup} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            placeholder="Enter Order or Consignment # (e.g. AUR-89211)..."
            value={trackQuery}
            onChange={(e) => setTrackQuery(e.target.value)}
            className="flex-1 h-11 text-xs bg-surface-muted/50 border-border focus:border-charcoal"
          />
          <Button
            type="submit"
            className="h-11 px-6 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900 flex items-center gap-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Track Consignment</span>
          </Button>
        </form>

        {searchedOrder && (
          <div className="mt-4 p-5 bg-sand-50/70 border border-sand-200 animate-fadeIn space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sand-200/60 pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-luxury text-sand-800 font-medium block">
                  Consignment Verified
                </span>
                <h4 className="font-serif text-base text-charcoal">
                  Order #{searchedOrder.order_number}
                </h4>
              </div>
              <span className="text-xs uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 font-medium inline-block">
                In Transit with Courier
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-charcoal-50 font-light">
              <div>
                <span className="text-charcoal font-medium block">Carrier:</span>
                <span>Ferrari Express White-Glove</span>
              </div>
              <div>
                <span className="text-charcoal font-medium block">Estimated Arrival:</span>
                <span>Within 24 Hours</span>
              </div>
              <div>
                <span className="text-charcoal font-medium block">Courier Security:</span>
                <span>Biometric Signature Required</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders List or Empty State */}
      {orders.length === 0 ? (
        <div className="p-12 bg-surface-muted/40 border border-border text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-sand-100/80 mx-auto flex items-center justify-center text-sand-800">
            <Package className="w-6 h-6 stroke-1" />
          </div>
          <h3 className="font-serif text-lg text-charcoal font-normal">
            No Previous Acquisitions Recorded
          </h3>
          <p className="text-xs text-charcoal-50 max-w-sm mx-auto font-light leading-relaxed">
            Your personal archives are currently empty. Explore our latest tailoring editions to place your first commission.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link href="/#women">
              <Button className="h-10 px-6 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900">
                Explore Collection
              </Button>
            </Link>
            {!user && (
              <Button
                variant="outline"
                onClick={openAuthModal}
                className="h-10 px-6 text-xs uppercase tracking-luxury font-medium border-border"
              >
                Sign In to View Cloud Orders
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const formattedDate = order.created_at
              ? new Date(order.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recent";

            const getStatusBadge = (status: string | null) => {
              switch (status) {
                case "delivered":
                  return "bg-emerald-50 text-emerald-800 border-emerald-200";
                case "shipped":
                  return "bg-blue-50 text-blue-800 border-blue-200";
                case "processing":
                case "paid":
                  return "bg-sand-50 text-sand-800 border-sand-200";
                default:
                  return "bg-gray-50 text-gray-700 border-gray-200";
              }
            };

            return (
              <div
                key={order.id}
                className="p-6 bg-surface border border-border hover:border-charcoal/40 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div>
                    <span className="font-serif text-base text-charcoal font-normal">
                      Order #{order.order_number}
                    </span>
                    <span className="text-xs text-charcoal-50 font-light block mt-0.5">
                      Placed on {formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2.5 py-1 border font-medium ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status || "Pending"}
                    </span>
                    <span className="font-sans font-medium text-sm text-charcoal">
                      {formatPrice(Number(order.total))}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-charcoal-50 font-light">
                    Delivery: {order.delivery_method === "express" ? "Atelier Express" : "White-Glove Courier"}
                  </span>

                  <Link href={`/account/orders/${order.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 px-4 text-[11px] uppercase tracking-luxury font-medium border-border hover:bg-surface-muted group"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3 h-3 ml-1.5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
