"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sun, Globe, Flame } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

function getSafeImageUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("/api/proxy-image") || url.startsWith("/")) return url;
  if (url.startsWith("http")) return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  return url;
}

interface CuratedBundlesSectionProps {
  bundleProduct?: Product;
}

export default function CuratedBundlesSection({ bundleProduct }: CuratedBundlesSectionProps) {
  const { formatPrice, currency, shippingCountry } = useCart();

  if (!bundleProduct) return null;

  const isNigeria =
    shippingCountry === "Nigeria" ||
    (currency === "NGN" && (!shippingCountry || shippingCountry === "Nigeria"));

  const bgImage =
    getSafeImageUrl(bundleProduct.image) ||
    "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop";

  return (
    <section className="py-8 sm:py-12 bg-[#0C0A09] text-stone-100 border-y border-stone-800 relative overflow-hidden">
      {/* Warm Heat & Earth Ambient Glow Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-700/25 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900/90 rounded-3xl border border-stone-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            {/* Visual: Sun-baked Earth / Heat climate imagery */}
            <div className="md:col-span-6 relative aspect-4/3 sm:aspect-square md:aspect-auto md:h-full min-h-[260px] sm:min-h-[320px] overflow-hidden">
              <img
                src={bgImage}
                alt="El Niño Heat and Earth Climate Defense"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-stone-900" />
              
              <span className="absolute top-4 left-4 z-10 bg-amber-500 text-stone-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                25% Off Climate Kit
              </span>
            </div>

            {/* Content: Clean, Heat & Earth Climate Defense */}
            <div className="md:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>Earth &amp; Heat Defense</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  El Niño Skincare Bundle
                </h2>

                <p className="text-xs sm:text-sm text-stone-400 mt-2 leading-relaxed">
                  Defend against extreme heat and UV stress. Includes Beauty of Joseon SPF 50+, CeraVe Lotion, and The Ordinary Niacinamide.
                  {isNigeria && (
                    <>
                      {" "}
                      <strong>Free portable fan with every order in Nigeria.</strong>
                    </>
                  )}
                </p>

                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-stone-300">
                  <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60">☀️ BoJ Relief Sun SPF 50+</span>
                  <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60">🧴 CeraVe Lotion</span>
                  <span className="bg-stone-800/80 px-2.5 py-1 rounded-md border border-stone-700/60">💧 The Ordinary Niacinamide</span>
                  {isNigeria && (
                    <span className="bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-md border border-amber-500/40">
                      🎁 Free portable fan with every order in Nigeria
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-mono font-extrabold text-amber-300">
                    {currency === "NGN" ? "₦49,400" : formatPrice(bundleProduct.price)}
                  </span>
                  {bundleProduct.compareAtPrice && (
                    <span className="text-sm sm:text-base line-through text-stone-500 font-mono">
                      {currency === "NGN" ? "₦65,830.40" : formatPrice(bundleProduct.compareAtPrice)}
                    </span>
                  )}
                  <span className="text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                    Save ₦16,430
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-stone-800 flex items-center gap-3">
                <Link
                  href={`/product/${encodeURIComponent(bundleProduct.id)}`}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-black uppercase tracking-wider shadow-md transition-colors"
                >
                  Order Bundle • 25% Off
                </Link>
                <Link
                  href={`/product/${encodeURIComponent(bundleProduct.id)}`}
                  className="text-xs font-semibold text-stone-300 hover:text-white underline"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
