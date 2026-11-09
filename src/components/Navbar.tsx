"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Moon, Sun, TrendingUp, Ship, User, Menu, X, Phone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CurrencySelector from "@/components/CurrencySelector";
import { Typewriter } from "@/components/ui/typewriter-text";
import { authClient } from "@/lib/auth-client";

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.41a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.69a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.28 8.28 0 0 0 4.84 1.55V7.18a4.85 4.85 0 0 1-.93-.49z" />
    </svg>
  );
}

export default function Navbar() {
  const {
    totalItems,
    setIsCartOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    isNightRecovery,
    triggerNightRecoverySweep,
    storeSettings,
  } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuraWordmark, setShowAuraWordmark] = useState(false);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    // Show AURA wordmark popping out of the logo for 2 seconds on first visit/load, then tuck back in
    setShowAuraWordmark(true);
    const timer = setTimeout(() => {
      setShowAuraWordmark(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-700 shadow-md ${
        isNightRecovery
          ? "bg-slate-950/90 border-blue-900/40 text-white shadow-black/40"
          : "bg-white/95 border-slate-200/80 shadow-slate-200/50"
      }`}
    >
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2">
        {/* Mobile Left: Menu Button beside the Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`sm:hidden p-2 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              isNightRecovery
                ? "bg-slate-900 border-slate-800 text-slate-200"
                : "bg-slate-100 border-slate-200 text-slate-800"
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo with Animated AURA Wordmark that pops out on first load for 2s then retracts */}
          <Link href="/" className="flex items-center gap-2 group relative shrink-0">
            {/* Circular Ring & Core */}
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-[#002B7F] via-blue-700 to-cyan-500 p-[1.5px] shadow-[0_0_12px_rgba(0,242,254,0.5)]">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                <span className="font-extrabold text-xs tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300">
                  AU
                </span>
              </div>
            </div>

            {/* Wordmark (pops out for 2s on load, then neatly tucks back in) */}
            <AnimatePresence>
              {showAuraWordmark && (
                <motion.div
                  initial={{ opacity: 0, x: -8, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -8, width: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden flex flex-col justify-center"
                >
                  <span
                    className={`text-base sm:text-lg font-black tracking-tight leading-none pr-1 ${
                      isNightRecovery ? "text-white" : "text-slate-950"
                    }`}
                  >
                    AURA
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Quick Brand Pills */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={scrollToCatalog}
            className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer px-2.5 py-1 rounded-full border ${
              isNightRecovery
                ? "bg-slate-900/80 border-slate-700/80 text-white hover:border-[#FE2C55]"
                : "bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-400"
            }`}
          >
            <TikTokIcon className="w-3.5 h-3.5 text-[#FE2C55] shrink-0" />
            <span className="font-bold tracking-tight">TikTok Viral</span>
          </button>
          <button
            onClick={scrollToCatalog}
            className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
              isNightRecovery ? "text-cyan-300 hover:text-white" : "text-[#002B7F] hover:underline"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Best Sellers</span>
          </button>
          <Link
            href="/track-order"
            className={`group inline-flex items-center gap-1.5 transition-colors ${
              isNightRecovery ? "text-slate-300 hover:text-white" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Ship className="w-3.5 h-3.5 text-blue-500 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            <span>Track Order</span>
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Night Recovery Sweep Toggle Pill (Desktop Only) */}
          <button
            type="button"
            onClick={() => triggerNightRecoverySweep(!isNightRecovery)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border ${
              isNightRecovery
                ? "bg-linear-to-r from-blue-900 to-indigo-900 border-cyan-400/50 text-cyan-200 shadow-cyan-900/40"
                : "bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700"
            }`}
          >
            {isNightRecovery ? (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span className="hidden md:inline text-[11px]">Night Mode</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline text-[11px]">Day</span>
              </>
            )}
          </button>

          {/* Circular Flag Currency Selector with Real-time Rates */}
          <CurrencySelector />

          {/* User Sign In / Account Link (Desktop Only) */}
          <Link
            href="/login"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border ${
              isNightRecovery
                ? "bg-slate-900 border-slate-800 text-slate-200 hover:text-white hover:border-cyan-400"
                : "bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
            title={session?.user ? `Signed in as ${session.user.email}` : "Customer Sign In"}
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline text-[11px] max-w-24 truncate">
              {session?.user ? session.user.name || session.user.email.split("@")[0] : "Sign In"}
            </span>
          </Link>

          {/* Cart Bag Pill */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-1.5 sm:gap-2 bg-slate-900 hover:bg-[#002B7F] text-white px-2.5 sm:px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] cursor-pointer shrink-0"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {totalItems > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[10px] sm:text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Slide-Down Menu when hamburger is clicked */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`sm:hidden border-t px-4 py-4 space-y-2.5 overflow-hidden shadow-lg ${
              isNightRecovery ? "bg-slate-950 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            <button
              onClick={() => {
                scrollToCatalog();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between text-left text-xs font-bold py-2.5 border-b border-slate-200/60"
            >
              <div className="flex items-center gap-2.5">
                <TikTokIcon className="w-4 h-4 text-[#FE2C55]" />
                <span>TikTok Viral Skincare</span>
              </div>
              <span className="text-slate-400 font-mono">→</span>
            </button>

            <button
              onClick={() => {
                scrollToCatalog();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between text-left text-xs font-bold py-2.5 border-b border-slate-200/60"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span>Best Sellers &amp; Verified Formulas</span>
              </div>
              <span className="text-slate-400 font-mono">→</span>
            </button>

            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between text-left text-xs font-bold py-2.5 border-b border-slate-200/60"
            >
              <div className="flex items-center gap-2.5">
                <Ship className="w-4 h-4 text-blue-500" />
                <span>Track Courier Order</span>
              </div>
              <span className="text-slate-400 font-mono">→</span>
            </Link>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-between text-left text-xs font-bold py-2.5 border-b border-slate-200/60"
            >
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-cyan-500" />
                <span>
                  {session?.user
                    ? `Account (${session.user.name || session.user.email})`
                    : "Customer Account / Sign In"}
                </span>
              </div>
              <span className="text-slate-400 font-mono">→</span>
            </Link>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Night Mode / Day:</span>
              <button
                type="button"
                onClick={() => triggerNightRecoverySweep(!isNightRecovery)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-1.5"
              >
                {isNightRecovery ? <Moon className="w-3.5 h-3.5 text-cyan-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                <span>{isNightRecovery ? "Night Active" : "Day Mode"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
