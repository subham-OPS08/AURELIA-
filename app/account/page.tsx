"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2, User, ShieldCheck, Sparkles, SlidersHorizontal, Bell } from "lucide-react";

export default function ProfilePage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const supabase = createClient();

  const [title, setTitle] = useState("Lady");
  const [fullName, setFullName] = useState("Eleanor Vance");
  const [email, setEmail] = useState("eleanor.vance@atelier-client.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [topSize, setTopSize] = useState("38 (M)");
  const [bottomSize, setBottomSize] = useState("36 (S)");
  const [preferredFit, setPreferredFit] = useState("Architectural Structured");
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [privateInvites, setPrivateInvites] = useState(true);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    // Load local storage preferences if available
    const savedLocal = localStorage.getItem("aurelia_client_profile");
    if (savedLocal) {
      try {
        const parsed = JSON.parse(savedLocal);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.title) setTitle(parsed.title);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.topSize) setTopSize(parsed.topSize);
        if (parsed.bottomSize) setBottomSize(parsed.bottomSize);
        if (parsed.preferredFit) setPreferredFit(parsed.preferredFit);
        if (parsed.smsAlerts !== undefined) setSmsAlerts(parsed.smsAlerts);
        if (parsed.privateInvites !== undefined) setPrivateInvites(parsed.privateInvites);
      } catch (e) {
        console.error("Failed to parse local profile", e);
      }
    }

    if (user) {
      setEmail(user.email || "");
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            setFullName(data.full_name || user.user_metadata?.full_name || "");
            setPhone(data.phone || "");
          } else if (user.user_metadata?.full_name) {
            setFullName(user.user_metadata.full_name);
          }
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [user, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    // Save locally
    const profileData = {
      title,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      topSize,
      bottomSize,
      preferredFit,
      smsAlerts,
      privateInvites,
    };
    localStorage.setItem("aurelia_client_profile", JSON.stringify(profileData));

    // Save to Supabase if authenticated
    if (user) {
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName.trim(),
        phone: phone.trim(),
        updated_at: new Date().toISOString(),
      });
    }

    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-charcoal-50 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-sand" />
        <span>Loading client profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="font-serif text-2xl text-charcoal font-light tracking-tight">
          Client Credentials & Preferences
        </h2>
        <p className="text-xs text-charcoal-50 mt-1 font-light">
          Manage your personal details, bespoke measurements, and courier notification preferences.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
        {savedSuccess && (
          <div className="p-4 bg-sand-100/90 border border-sand-300 text-charcoal text-xs flex items-center gap-2.5 animate-fadeIn">
            <Check className="w-4 h-4 text-sand-800 flex-shrink-0" />
            <span className="font-medium">
              Account settings & atelier preferences successfully recorded.
            </span>
          </div>
        )}

        {/* Section 1: Personal Credentials */}
        <div className="p-6 sm:p-8 bg-surface border border-border space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <User className="w-4 h-4 text-sand-800" />
            <h3 className="font-serif text-base text-charcoal font-normal">
              Personal Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-3 space-y-1.5">
              <Label htmlFor="title">Preferred Title</Label>
              <select
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-11 w-full text-xs bg-surface border border-border px-3 text-charcoal focus:border-charcoal focus:outline-none"
              >
                <option value="Lady">Lady</option>
                <option value="Lord">Lord</option>
                <option value="Ms.">Ms.</option>
                <option value="Mr.">Mr.</option>
                <option value="Dr.">Dr.</option>
                <option value="Mx.">Mx.</option>
              </select>
            </div>

            <div className="sm:col-span-9 space-y-1.5">
              <Label htmlFor="fullName">Full Legal Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Lady Eleanor Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="h-11 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!user}
              className={`h-11 text-xs border-border text-charcoal ${
                user ? "bg-surface-muted cursor-not-allowed text-charcoal-50" : "bg-surface"
              }`}
            />
            {user ? (
              <span className="text-[10px] text-charcoal-50 font-light block">
                Tied to your authenticated Supabase security login.
              </span>
            ) : (
              <span className="text-[10px] text-charcoal-50 font-light block">
                Used for order confirmations and bespoke delivery dispatches.
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone">Contact Telephone (Courier Appointment)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 text-xs bg-surface border-border focus:border-charcoal"
            />
          </div>
        </div>

        {/* Section 2: Sizing & Tailoring Preferences */}
        <div className="p-6 sm:p-8 bg-surface border border-border space-y-5">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <SlidersHorizontal className="w-4 h-4 text-sand-800" />
            <h3 className="font-serif text-base text-charcoal font-normal">
              Atelier Sizing & Silhouette Preferences
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="topSize">Preferred Outerwear / Top Size</Label>
              <select
                id="topSize"
                value={topSize}
                onChange={(e) => setTopSize(e.target.value)}
                className="h-11 w-full text-xs bg-surface border border-border px-3 text-charcoal focus:border-charcoal focus:outline-none"
              >
                <option value="34 (XS)">34 (XS - European)</option>
                <option value="36 (S)">36 (S - European)</option>
                <option value="38 (M)">38 (M - European)</option>
                <option value="40 (L)">40 (L - European)</option>
                <option value="42 (XL)">42 (XL - European)</option>
                <option value="Bespoke">Bespoke Custom Tailored</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bottomSize">Preferred Trousers Size</Label>
              <select
                id="bottomSize"
                value={bottomSize}
                onChange={(e) => setBottomSize(e.target.value)}
                className="h-11 w-full text-xs bg-surface border border-border px-3 text-charcoal focus:border-charcoal focus:outline-none"
              >
                <option value="34 (XS)">34 (XS - 26 inch)</option>
                <option value="36 (S)">36 (S - 28 inch)</option>
                <option value="38 (M)">38 (M - 30 inch)</option>
                <option value="40 (L)">40 (L - 32 inch)</option>
                <option value="42 (XL)">42 (XL - 34 inch)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="preferredFit">Preferred Silhouette Cut</Label>
            <select
              id="preferredFit"
              value={preferredFit}
              onChange={(e) => setPreferredFit(e.target.value)}
              className="h-11 w-full text-xs bg-surface border border-border px-3 text-charcoal focus:border-charcoal focus:outline-none"
            >
              <option value="Architectural Structured">Architectural Structured (Sharp shoulders, defined waist)</option>
              <option value="Fluid Drape">Fluid Drape (Bias-cut silks, relaxed ease)</option>
              <option value="Monolithic Cocoon">Monolithic Cocoon (Generous cashmere volume)</option>
            </select>
          </div>
        </div>

        {/* Section 3: Communication & Notifications */}
        <div className="p-6 sm:p-8 bg-surface border border-border space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Bell className="w-4 h-4 text-sand-800" />
            <h3 className="font-serif text-base text-charcoal font-normal">
              Private Communications
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="mt-0.5 border-border text-charcoal focus:ring-sand"
              />
              <div>
                <span className="text-xs font-medium text-charcoal block">
                  White-Glove Courier SMS Updates
                </span>
                <span className="text-[11px] text-charcoal-50 font-light block">
                  Receive live SMS notifications when your dedicated courier is 30 minutes away.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={privateInvites}
                onChange={(e) => setPrivateInvites(e.target.checked)}
                className="mt-0.5 border-border text-charcoal focus:ring-sand"
              />
              <div>
                <span className="text-xs font-medium text-charcoal block">
                  Seasonal Archive & Salon Previews
                </span>
                <span className="text-[11px] text-charcoal-50 font-light block">
                  Private access to limited-edition runway releases 48 hours prior to public presentation.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2 flex items-center justify-between">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-12 px-10 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving Settings...
              </span>
            ) : (
              "Save Account Settings"
            )}
          </Button>

          {!user && (
            <button
              type="button"
              onClick={openAuthModal}
              className="text-xs uppercase tracking-luxury text-sand-800 hover:text-charcoal underline underline-offset-4"
            >
              Sign In to Cloud Sync
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
