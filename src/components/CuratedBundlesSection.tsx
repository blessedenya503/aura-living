"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Check,
  ShoppingBag,
  Layers,
  Clock,
  Sparkles,
} from "lucide-react";
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
  const { addToCart, formatPrice } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  if (!bundleProduct) return null;

  const isComingSoon = true; // explicitly set to Coming Soon as requested

  const handleAddBundle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isComingSoon) {
      alert("The El Niño Skincare Bundle is dropping soon! Stay tuned.");
      return;
    }
    addToCart(bundleProduct, bundleProduct.variants[0], 1, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <section className="py-8 sm:py-12 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Clean Header with Top Tagline */}
        <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-[#002B7F] block mb-1">
            Extreme Climate Defense Routine
          </span>
          <h2 className="text-xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            El Niño Skincare Bundle
          </h2>
          <div className="w-10 h-0.5 bg-[#002B7F] mx-auto my-2 rounded-full" />
          <p className="text-xs sm:text-sm text-slate-500">
            A simple, complete routine to protect and hydrate your skin in hot, dry weather.
          </p>
        </div>

        {/* Feature Showcase Card */}
        <div className="bg-[#FAFAFA] rounded-3xl border border-slate-200 p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Hero Showcase */}
            <div className="lg:col-span-5 relative flex flex-col items-center justify-center bg-white rounded-2xl p-4 sm:p-6 border border-slate-200">
              <span className="self-start bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full mb-3">
                Coming Soon
              </span>

              <div className="w-full aspect-square max-w-[280px] flex items-center justify-center">
                <img
                  src={getSafeImageUrl(bundleProduct.image)}
                  alt={bundleProduct.name}
                  className="max-h-56 sm:max-h-64 object-contain rounded-xl"
                />
              </div>

              <div className="mt-3 text-xs text-slate-500 font-medium text-center">
                4 Full-Size Steps • All Skin Types
              </div>
            </div>

            {/* Bundle Details & User-Friendly Steps */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-[#002B7F] uppercase tracking-wider text-[11px]">
                    Aura Curated
                  </span>
                  <span>•</span>
                  <span>Complete 4-Step Set</span>
                </div>

                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-950 mt-1">
                  Everything your skin needs for dry climate relief
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  Heatwaves and dry wind quickly dry out your skin, leading to tight, irritated skin. This 4-step routine locks in moisture all day without feeling greasy.
                </p>

                {/* 4 Clean, Plain-Language Steps */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-[#002B7F] block">STEP 1</span>
                    <strong className="text-xs text-slate-900 block mt-0.5">Gentle Face Cleanser</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">Cleans dust and sweat without drying skin.</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-[#002B7F] block">STEP 2</span>
                    <strong className="text-xs text-slate-900 block mt-0.5">Hydration Essence</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">Quenches thirsty skin with deep hydration.</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-[#002B7F] block">STEP 3</span>
                    <strong className="text-xs text-slate-900 block mt-0.5">Barrier Relief Serum</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">Soothes redness and strengthens your skin.</p>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold text-[#002B7F] block">STEP 4</span>
                    <strong className="text-xs text-slate-900 block mt-0.5">Moisture Seal Cream</strong>
                    <p className="text-[11px] text-slate-500 mt-0.5">Locks in moisture against dry winds all day.</p>
                  </div>
                </div>
              </div>

              {/* Price and Action Bar */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold block">Bundle Price</span>
                  <div className="flex items-baseline font-mono mt-0.5">
                    <span className="text-xl sm:text-2xl font-extrabold text-slate-950">
                      {formatPrice(bundleProduct.price)}
                    </span>
                    {bundleProduct.compareAtPrice > bundleProduct.price && (
                      <span className="text-xs text-slate-400 line-through -translate-y-1 ml-1.5">
                        {formatPrice(bundleProduct.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    href={`/product/${encodeURIComponent(bundleProduct.id)}`}
                    className="flex-1 sm:flex-none text-center px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100"
                  >
                    View Details
                  </Link>

                  <button
                    onClick={handleAddBundle}
                    disabled={isComingSoon}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-80"
                  >
                    Coming Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
