"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/lib/context/AuthContext";
import { Loader2, AlertCircle, Sparkles, ArrowRight } from "lucide-react";

export function AuthModal() {
  const router = useRouter();
  const {
    isAuthModalOpen,
    closeAuthModal,
    signIn,
    signUp,
    signInWithGoogle,
    pendingCheckout,
    setPendingCheckout,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setError(null);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    closeAuthModal();
  };

  const handleSuccessfulAuth = () => {
    handleClose();
    if (pendingCheckout) {
      setPendingCheckout(false);
      router.push("/checkout");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await signIn(email, password);
    setIsSubmitting(false);

    if (error) {
      setError(error);
    } else {
      handleSuccessfulAuth();
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    const { error } = await signUp(email, password, fullName);
    setIsSubmitting(false);

    if (error) {
      setError(error);
    } else {
      handleSuccessfulAuth();
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err: unknown) {
      setIsGoogleLoading(false);
      setError(err instanceof Error ? err.message : "Unable to initiate Google sign-in.");
    }
  };

  const handleGuestCheckout = () => {
    handleClose();
    setPendingCheckout(false);
    router.push("/checkout?guest=true");
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[440px] bg-background border-border/80 p-0 overflow-hidden shadow-2xl">
        {/* Top Header Banner */}
        <div className="bg-surface-muted/60 p-6 pb-4 border-b border-border/60 text-center">
          <span className="text-[10px] uppercase tracking-luxury-ultrawide text-sand-800 font-medium block mb-1">
            AURÉLIA Haute Atelier
          </span>
          <DialogTitle className="font-serif text-2xl font-light text-charcoal tracking-tight">
            Client Authentication
          </DialogTitle>
          <DialogDescription className="text-xs text-charcoal-50 mt-1 font-light">
            Sign in to access your curated orders, saved addresses, and concierge service.
          </DialogDescription>
        </div>

        <div className="p-6 pt-4 space-y-5">
          {/* Tabs: Login / Sign Up */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val as "login" | "signup");
              setError(null);
            }}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 border-b border-border/70 pb-0">
              <TabsTrigger value="login" className="text-xs uppercase tracking-luxury py-2 font-medium">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-xs uppercase tracking-luxury py-2 font-medium">
                Create Account
              </TabsTrigger>
            </TabsList>

            {/* Error Banner */}
            {error && (
              <div className="mt-3 p-3 bg-red-50/80 border border-red-200/80 text-red-800 text-xs flex items-start gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Login Tab Content */}
            <TabsContent value="login" className="space-y-4 pt-3">
              <form onSubmit={handleLogin} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email Address</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="client@aurelia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 text-xs border-border/80 focus:border-charcoal bg-surface"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="login-password">Password</Label>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10 text-xs border-border/80 focus:border-charcoal bg-surface"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 text-xs uppercase tracking-luxury font-medium mt-2 bg-charcoal text-white hover:bg-charcoal-900"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    "Sign In to Account"
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab Content */}
            <TabsContent value="signup" className="space-y-4 pt-3">
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Lady Eleanor Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-10 text-xs border-border/80 focus:border-charcoal bg-surface"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="client@aurelia.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10 text-xs border-border/80 focus:border-charcoal bg-surface"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-10 text-xs border-border/80 focus:border-charcoal bg-surface"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 text-xs uppercase tracking-luxury font-medium mt-2 bg-charcoal text-white hover:bg-charcoal-900"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    "Join AURÉLIA Atelier"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          {/* Social OAuth & Guest Actions */}
          <div className="space-y-3 pt-1">
            <div className="relative flex items-center justify-center">
              <Separator className="w-full" />
              <span className="absolute bg-background px-3 text-[10px] uppercase tracking-luxury text-charcoal-50 font-light">
                Or Continue With
              </span>
            </div>

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="w-full h-10 border-border hover:bg-surface-muted text-xs tracking-wider flex items-center justify-center gap-2.5 font-normal"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-charcoal-50" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </Button>

            {/* Guest Checkout Option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGuestCheckout}
                className="w-full py-2.5 px-4 bg-sand-50/70 hover:bg-sand-100/80 border border-sand-200/80 text-charcoal text-xs uppercase tracking-luxury font-medium transition-colors flex items-center justify-center gap-2 group"
              >
                <span>Continue as Guest</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-sand-800" />
              </button>
              <p className="text-[10px] text-center text-charcoal-50 font-light mt-1.5">
                No password required. You can create an account after placing your order.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
