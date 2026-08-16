"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, Loader2, User, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name || user.user_metadata?.full_name || "");
          setPhone(data.phone || "");
        } else {
          setFullName(user.user_metadata?.full_name || "");
        }
        setIsLoading(false);
      });
  }, [user, supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setSavedSuccess(false);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName.trim(),
      phone: phone.trim(),
      updated_at: new Date().toISOString(),
    });

    setIsSaving(false);

    if (!error) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
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
          Manage your personal details and primary contact telephone for white-glove courier appointments.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 sm:p-8 bg-surface border border-border space-y-6 max-w-xl">
        {savedSuccess && (
          <div className="p-3 bg-sand-100/70 border border-sand-300 text-charcoal text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-sand-800" />
            <span>Client profile updated successfully.</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={user?.email || ""}
            disabled
            className="h-11 text-xs bg-surface-muted border-border text-charcoal-50 cursor-not-allowed"
          />
          <span className="text-[10px] text-charcoal-50 font-light block">
            Email address is tied to your Supabase security credentials.
          </span>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Lady Eleanor Vance"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-11 text-xs bg-surface border-border focus:border-charcoal"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone Number (White-Glove Dispatch)</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-11 text-xs bg-surface border-border focus:border-charcoal"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 px-8 text-xs uppercase tracking-luxury font-medium bg-charcoal text-white hover:bg-charcoal-900"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving Changes...
              </span>
            ) : (
              "Save Profile Details"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
