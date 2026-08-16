"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Check, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Tables } from "@/types/database.types";

export interface ShippingAddressData {
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface AddressStepProps {
  initialAddress: ShippingAddressData | null;
  onContinue: (address: ShippingAddressData) => void;
  isGuest?: boolean;
}

export function AddressStep({ initialAddress, onContinue, isGuest = false }: AddressStepProps) {
  const { user, isAuthenticated } = useAuth();
  const supabase = createClient();

  const [savedAddresses, setSavedAddresses] = useState<Tables<"addresses">[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(!isAuthenticated || isGuest);

  // Form State
  const [fullName, setFullName] = useState(initialAddress?.fullName || "");
  const [email, setEmail] = useState(initialAddress?.email || user?.email || "");
  const [phone, setPhone] = useState(initialAddress?.phone || "");
  const [addressLine1, setAddressLine1] = useState(initialAddress?.addressLine1 || "");
  const [addressLine2, setAddressLine2] = useState(initialAddress?.addressLine2 || "");
  const [city, setCity] = useState(initialAddress?.city || "");
  const [state, setState] = useState(initialAddress?.state || "");
  const [postalCode, setPostalCode] = useState(initialAddress?.postalCode || "");
  const [country, setCountry] = useState(initialAddress?.country || "India");
  const [saveToAccount, setSaveToAccount] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch saved addresses for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      setIsLoadingAddresses(true);
      supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false })
        .then(({ data, error }) => {
          setIsLoadingAddresses(false);
          if (data && data.length > 0) {
            setSavedAddresses(data);
            setSelectedAddressId(data[0].id);
            setShowNewAddressForm(false);
          } else {
            setShowNewAddressForm(true);
          }
        });
    }
  }, [isAuthenticated, user, supabase]);

  const handleSelectSaved = (addr: Tables<"addresses">) => {
    setSelectedAddressId(addr.id);
    setFullName(addr.full_name);
    setPhone(addr.phone || "");
    setAddressLine1(addr.address_line1);
    setAddressLine2(addr.address_line2 || "");
    setCity(addr.city);
    setState(addr.state);
    setPostalCode(addr.postal_code);
    setCountry(addr.country || "India");
    setShowNewAddressForm(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // If using a saved address
    if (!showNewAddressForm && selectedAddressId) {
      const selected = savedAddresses.find((a) => a.id === selectedAddressId);
      if (selected) {
        onContinue({
          fullName: selected.full_name,
          email: user?.email || email,
          phone: selected.phone || "",
          addressLine1: selected.address_line1,
          addressLine2: selected.address_line2 || undefined,
          city: selected.city,
          state: selected.state,
          postalCode: selected.postal_code,
          country: selected.country || "India",
        });
        return;
      }
    }

    // Validation for new/guest address
    if (!fullName.trim() || !email.trim() || !phone.trim() || !addressLine1.trim() || !city.trim() || !state.trim() || !postalCode.trim()) {
      setError("Please complete all required fields marked with *.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // Save to user account if logged in & checkbox checked
    if (isAuthenticated && user && saveToAccount && showNewAddressForm) {
      setIsSaving(true);
      await supabase.from("addresses").insert({
        user_id: user.id,
        full_name: fullName.trim(),
        phone: phone.trim(),
        address_line1: addressLine1.trim(),
        address_line2: addressLine2.trim() || null,
        city: city.trim(),
        state: state.trim(),
        postal_code: postalCode.trim(),
        country: country.trim(),
        is_default: savedAddresses.length === 0,
      });
      setIsSaving(false);
    }

    onContinue({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim() || undefined,
      city: city.trim(),
      state: state.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <span className="text-[11px] uppercase tracking-luxury text-sand font-medium block mb-1">
          Step 1 of 3
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-light tracking-tight">
          Client Delivery Address
        </h2>
        <p className="text-xs text-charcoal-50 mt-1 font-light">
          {isAuthenticated
            ? "Select a destination from your saved residences or enter a new address."
            : "Please specify your residential address for private courier dispatch."}
        </p>
      </div>

      {/* Saved Addresses List (Authenticated Only) */}
      {isAuthenticated && savedAddresses.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-luxury font-medium text-charcoal">
              Saved Residences
            </h3>
            <button
              type="button"
              onClick={() => setShowNewAddressForm((prev) => !prev)}
              className="text-xs uppercase tracking-luxury text-sand-800 hover:text-charcoal flex items-center gap-1 font-medium transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showNewAddressForm ? "Use Saved Address" : "Add New Residence"}</span>
            </button>
          </div>

          {!showNewAddressForm && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedAddresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectSaved(addr)}
                    className={`p-5 border cursor-pointer transition-all relative ${
                      isSelected
                        ? "border-charcoal bg-surface shadow-sm ring-1 ring-charcoal"
                        : "border-border/80 bg-surface-muted/40 hover:border-charcoal/40"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-sand" />
                        <span className="font-medium text-xs text-charcoal">{addr.label || "Residence"}</span>
                      </div>
                      {addr.is_default && (
                        <span className="text-[10px] uppercase tracking-wider bg-sand-100 text-sand-800 px-2 py-0.5 font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-charcoal">{addr.full_name}</p>
                    <p className="text-xs text-charcoal-50 font-light mt-1 leading-relaxed">
                      {addr.address_line1}
                      {addr.address_line2 && `, ${addr.address_line2}`}
                      <br />
                      {addr.city}, {addr.state} — {addr.postal_code}
                      <br />
                      {addr.country}
                    </p>
                    {addr.phone && <p className="text-xs text-charcoal-50 mt-1 font-light">Tel: {addr.phone}</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Address Form (Guest or New Address) */}
      {(showNewAddressForm || !isAuthenticated || savedAddresses.length === 0) && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Lady Eleanor Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-11 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="eleanor.vance@atelier.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number (for Courier Dispatch) *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-11 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="addressLine1">Street Address *</Label>
              <Input
                id="addressLine1"
                type="text"
                placeholder="Flat 4B, The Monolith Residences, 12 Kensington Way"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
                className="h-11 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="addressLine2">Apartment, Suite, Unit (Optional)</Label>
              <Input
                id="addressLine2"
                type="text"
                placeholder="Penthouse Suite"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="h-11 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                type="text"
                placeholder="Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="h-11 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="state">State / Province *</Label>
              <Input
                id="state"
                type="text"
                placeholder="Maharashtra"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="h-11 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Postal Code / PIN *</Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="400001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                className="h-11 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="country">Country *</Label>
              <Input
                id="country"
                type="text"
                placeholder="India"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="h-11 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2 pt-2">
              <input
                id="saveAddress"
                type="checkbox"
                checked={saveToAccount}
                onChange={(e) => setSaveToAccount(e.target.checked)}
                className="rounded-xs border-border text-charcoal focus:ring-sand"
              />
              <label htmlFor="saveAddress" className="text-xs text-charcoal-50 font-light cursor-pointer">
                Save this address to my profile for future bespoke acquisitions
              </label>
            </div>
          )}

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="h-12 px-8 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900 w-full sm:w-auto"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving Address...
                </span>
              ) : (
                "Continue to Delivery Method"
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Button for when a saved address is selected */}
      {!showNewAddressForm && isAuthenticated && savedAddresses.length > 0 && (
        <div className="pt-4">
          <Button
            type="button"
            onClick={handleSubmit}
            className="h-12 px-8 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900 w-full sm:w-auto"
          >
            Continue with Selected Residence
          </Button>
        </div>
      )}
    </div>
  );
}
