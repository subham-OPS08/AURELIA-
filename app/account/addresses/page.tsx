"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Plus, Trash2, Check, Loader2, Star } from "lucide-react";
import { Tables } from "@/types/database.types";

export default function AddressesPage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [addresses, setAddresses] = useState<Tables<"addresses">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New address form state
  const [label, setLabel] = useState("Home Residence");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("India");
  const [isDefault, setIsDefault] = useState(false);

  const fetchAddresses = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });

    setAddresses(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, [user]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    // If making default, unset other defaults
    if (isDefault) {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    const { error } = await supabase.from("addresses").insert({
      user_id: user.id,
      label: label.trim(),
      full_name: fullName.trim(),
      phone: phone.trim(),
      address_line1: addressLine1.trim(),
      address_line2: addressLine2.trim() || null,
      city: city.trim(),
      state: state.trim(),
      postal_code: postalCode.trim(),
      country: country.trim(),
      is_default: isDefault || addresses.length === 0,
    });

    setIsSubmitting(false);

    if (!error) {
      setShowAddForm(false);
      resetForm();
      fetchAddresses();
    }
  };

  const handleSetDefault = async (addressId: string) => {
    if (!user) return;
    await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    await supabase
      .from("addresses")
      .update({ is_default: true })
      .eq("id", addressId);

    fetchAddresses();
  };

  const handleDelete = async (addressId: string) => {
    await supabase.from("addresses").delete().eq("id", addressId);
    fetchAddresses();
  };

  const resetForm = () => {
    setLabel("Home Residence");
    setFullName("");
    setPhone("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("India");
    setIsDefault(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-xs text-charcoal-50 flex items-center justify-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin text-sand" />
        <span>Loading saved residences...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-charcoal font-light tracking-tight">
            Saved Residences & Destinations
          </h2>
          <p className="text-xs text-charcoal-50 mt-1 font-light">
            Manage your delivery addresses for seamless checkout dispatch.
          </p>
        </div>

        <Button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="h-10 px-5 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900"
        >
          <Plus className="w-3.5 h-3.5 mr-2" />
          <span>{showAddForm ? "Cancel" : "Add Residence"}</span>
        </Button>
      </div>

      {/* Add New Address Form Accordion */}
      {showAddForm && (
        <form
          onSubmit={handleAddAddress}
          className="p-6 sm:p-8 bg-surface border border-border space-y-4 max-w-2xl animate-fadeIn"
        >
          <h3 className="font-serif text-lg text-charcoal font-normal">Add New Residence</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="label">Residence Label</Label>
              <Input
                id="label"
                type="text"
                placeholder="e.g. Primary Residence / Penthouse"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                className="h-10 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Lady Eleanor Vance"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-10 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="phone">Contact Telephone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="h-10 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="addressLine1">Street Address</Label>
              <Input
                id="addressLine1"
                type="text"
                placeholder="12 Kensington Avenue"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
                className="h-10 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="addressLine2">Apartment / Suite</Label>
              <Input
                id="addressLine2"
                type="text"
                placeholder="Apt 4B"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className="h-10 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                type="text"
                placeholder="Mumbai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="h-10 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                type="text"
                placeholder="Maharashtra"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="h-10 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="postalCode">Postal Code / PIN</Label>
              <Input
                id="postalCode"
                type="text"
                placeholder="400001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                className="h-10 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="h-10 text-xs bg-surface border-border focus:border-charcoal"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              id="isDefault"
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded-xs border-border text-charcoal focus:ring-sand"
            />
            <label htmlFor="isDefault" className="text-xs text-charcoal-50 font-light cursor-pointer">
              Set as primary default delivery residence
            </label>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 px-6 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save Residence"
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="p-12 bg-surface-muted/40 border border-border text-center space-y-3">
          <MapPin className="w-8 h-8 text-sand-800 mx-auto stroke-1" />
          <h3 className="font-serif text-lg text-charcoal font-normal">No Saved Residences</h3>
          <p className="text-xs text-charcoal-50 max-w-sm mx-auto font-light leading-relaxed">
            Add your primary residence or international destinations to enjoy accelerated checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-6 border bg-surface flex flex-col justify-between space-y-4 ${
                addr.is_default ? "border-charcoal ring-1 ring-charcoal/40" : "border-border"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-serif text-base text-charcoal font-normal">
                    {addr.label || "Residence"}
                  </span>
                  {addr.is_default ? (
                    <span className="text-[10px] uppercase tracking-wider bg-sand-100 text-sand-800 px-2 py-0.5 font-medium">
                      Primary
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[10px] uppercase tracking-luxury text-charcoal-50 hover:text-charcoal transition-colors"
                    >
                      Make Primary
                    </button>
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

              <div className="flex justify-end pt-2 border-t border-border/40">
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-charcoal-50 hover:text-red-700 p-1 text-xs uppercase tracking-wider flex items-center gap-1 transition-colors"
                  title="Remove Residence"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
