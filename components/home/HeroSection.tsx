"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Volume2, VolumeX, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Change these video/image URLs easily in one place
const HERO_CONFIG = {
  // Free high-quality editorial video loop (Pexels / CDN stock fashion footage)
  videoUrlDesktop:
    "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-leather-jacket-41584-large.mp4",
  videoUrlMobile:
    "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-leather-jacket-41584-large.mp4",
  // High-res luxury poster fallback
  posterImage:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2400&auto=format&fit=crop",
  eyebrow: "AUTUMN / WINTER 2026",
  headline: "Quiet Luxury, Redefined",
  subtext:
    "Architectural silhouettes cut from Mongolian cashmere and fluid mulberry silks.",
  ctaText: "Explore The Collection",
  ctaLink: "#collections",
};

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);

    // Track scroll to fade out scroll indicator
    const scrollHandler = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    return () => {
      mediaQuery.removeEventListener("change", handler);
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <section className="relative w-full h-[100vh] min-h-[600px] overflow-hidden bg-neutral-950 flex items-end sm:items-center justify-center">
      {/* Background Poster Fallback (Always rendered for instant LCP) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={HERO_CONFIG.posterImage}
          alt="AURÉLIA Autumn/Winter Campaign"
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-1000 ${
            videoLoaded && !prefersReducedMotion ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      {/* Autoplaying Background Video (Skipped if user prefers reduced motion) */}
      {!prefersReducedMotion && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={HERO_CONFIG.videoUrlDesktop} type="video/mp4" />
        </video>
      )}

      {/* Dark luxury gradient overlays for contrast & legibility */}
      {/* Bottom to top gradient (40-65% at bottom, transparent at top) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20 pointer-events-none" />
      {/* Top subtle vignette for header readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none h-40" />

      {/* Hero Content with Framer Motion Staggered Entrance */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 text-center pb-24 sm:pb-0 pt-20">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <span className="inline-block text-[11px] sm:text-xs uppercase tracking-[0.3em] text-sand-300 font-sans font-medium">
            {HERO_CONFIG.eyebrow}
          </span>
        </motion.div>

        {/* Large Serif Headline (2-4 words max) */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white font-light tracking-tight leading-[1.08] mb-6 max-w-4xl mx-auto drop-shadow-sm"
        >
          {HERO_CONFIG.headline}
        </motion.h1>

        {/* One-Line Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-base md:text-lg text-white/80 font-light max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed drop-shadow-sm"
        >
          {HERO_CONFIG.subtext}
        </motion.p>

        {/* Single Primary Ghost CTA Button (White border on video, fills solid on hover) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href={HERO_CONFIG.ctaLink}>
            <Button
              variant="outline-light"
              size="lg"
              className="px-10 py-4 text-xs tracking-luxury group border-white/80"
            >
              <span className="flex items-center gap-2">
                {HERO_CONFIG.ctaText}
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </span>
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Animated Scroll-Down Indicator (Fades out once user scrolls) */}
      <motion.div
        animate={{ opacity: hasScrolled ? 0 : 0.8 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[9px] uppercase tracking-[0.3em] text-white/70 font-light">
          Scroll
        </span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-white/80 to-transparent animate-pulse" />
      </motion.div>

      {/* Mute/Unmute Audio Toggle (Bottom Right Corner with Subtle Opacity) */}
      {!prefersReducedMotion && (
        <div className="absolute bottom-6 right-6 z-20">
          <button
            onClick={toggleSound}
            className="p-2.5 rounded-full bg-black/40 text-white/60 hover:text-white hover:bg-black/70 border border-white/20 backdrop-blur-sm transition-all duration-300 focus:outline-none"
            aria-label={isMuted ? "Unmute hero video audio" : "Mute hero video audio"}
            title={isMuted ? "Unmute audio" : "Mute audio"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4 text-sand-300" />
            )}
          </button>
        </div>
      )}
    </section>
  );
}
