"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Search, Moon, Sun, TrendingUp, Ship, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CurrencySelector from "@/components/CurrencySelector";
import { Typewriter } from "@/components/ui/typewriter-text";

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
  } = useCart();

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-700 shadow-xs ${
        isNightRecovery
          ? "bg-slate-950/95 border-blue-900/50 text-white"
          : "bg-white/90 border-slate-200/80"
      }`}
    >
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-[#002B7F] to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            AU
          </div>
          <div className="flex flex-col">
            <span
              className={`text-lg font-bold tracking-tight transition-colors leading-none ${
                isNightRecovery
                  ? "text-white group-hover:text-cyan-300"
                  : "text-slate-900 group-hover:text-[#002B7F]"
              }`}
            >
              AURA
            </span>
            <span
              className={`text-[10px] uppercase tracking-widest font-semibold mt-0.5 transition-colors ${
                isNightRecovery ? "text-cyan-300" : "text-slate-500"
              }`}
            >
              Health &amp; Skincare
            </span>
          </div>
        </Link>

        {/* Interactive Search Bar (Mobile Icon + Desktop Input) */}
        <div className="flex-1 max-w-sm lg:max-w-md mx-1 sm:mx-4 relative group">
          {/* Mobile Tap Target (< sm) */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-600 transition-colors ml-auto cursor-pointer"
            aria-label="Open search modal"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Desktop & Tablet Full Input (>= sm) */}
          <div className="hidden sm:flex relative items-center w-full">
            <Search
              className={`w-4 h-4 absolute left-3.5 pointer-events-none transition-colors shrink-0 z-10 ${
                isNightRecovery ? "text-cyan-400" : "text-slate-400 group-hover:text-[#002B7F]"
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onClick={() => setIsSearchOpen(true)}
              placeholder=""
              className={`w-full pl-10 pr-12 py-2 rounded-xl text-xs font-medium transition-all outline-hidden shadow-2xs ${
                isNightRecovery
                  ? "bg-slate-900 border-blue-900 text-white placeholder:text-slate-400 focus:border-cyan-400 focus:bg-slate-950"
                  : "bg-slate-100 hover:bg-slate-200/80 focus:bg-white border-slate-200 focus:border-[#002B7F] text-slate-900 placeholder:text-slate-500"
              }`}
            />
            {!searchQuery && (
              <div className="absolute left-10 pointer-events-none text-xs text-slate-400 select-none flex items-center">
                <span>Ask DermAI:&nbsp;</span>
                <Typewriter
                  text={[
                    "Search creams, brands, actives...",
                    "Ask for dry skin barrier repair...",
                    "Find dark spot & hyperpigmentation serums...",
                    "Explore viral TikTok glass skin formulas...",
                    "Search CeraVe, NIVEA, COSRX...",
                  ]}
                  speed={75}
                  deleteSpeed={40}
                  delay={2000}
                  loop={true}
                  className="font-medium text-slate-500"
                />
              </div>
            )}
            <div className="absolute right-2.5 flex items-center gap-1 pointer-events-none">
              <kbd
                className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded shadow-2xs ${
                  isNightRecovery
                    ? "bg-slate-800 border border-slate-700 text-slate-300"
                    : "bg-white border border-slate-300 text-slate-500"
                }`}
              >
                ⌘K
              </kbd>
            </div>
          </div>
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
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Night Recovery Sweep Toggle Pill */}
          <button
            type="button"
            onClick={() => triggerNightRecoverySweep(!isNightRecovery)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border ${
              isNightRecovery
                ? "bg-linear-to-r from-blue-900 to-indigo-900 border-cyan-400/50 text-cyan-200 shadow-cyan-900/40"
                : "bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700"
            }`}
            title={
              isNightRecovery
                ? "Night Recovery active: click to switch to Morning Shield"
                : "Click for Night Recovery dark blue sweep"
            }
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

          {/* User Sign In Link */}
          <Link
            href="/login"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs border ${
              isNightRecovery
                ? "bg-slate-900 border-slate-800 text-slate-200 hover:text-white hover:border-cyan-400"
                : "bg-slate-100 hover:bg-slate-200/80 border-slate-200 text-slate-700 hover:text-slate-900"
            }`}
            title="Customer Sign In"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline text-[11px]">Sign In</span>
          </Link>

          {/* Cart Bag Pill */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-slate-900 hover:bg-[#002B7F] text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] cursor-pointer"
            aria-label="View shopping bag"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Bag</span>
            {totalItems > 0 && (
              <span className="bg-amber-400 text-slate-950 text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4.5 text-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
