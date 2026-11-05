"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  Check,
  ShieldCheck,
  Droplets,
  ArrowRight,
  SunMedium,
  Wind,
  Layers,
  ThermometerSun,
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

  const handleAddBundle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(bundleProduct, bundleProduct.variants[0], 1, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const discountAmount = bundleProduct.compareAtPrice > bundleProduct.price
    ? bundleProduct.compareAtPrice - bundleProduct.price
    : 0;

  const discountPercent = bundleProduct.compareAtPrice > bundleProduct.price
    ? Math.round(((bundleProduct.compareAtPrice - bundleProduct.price) / bundleProduct.compareAtPrice) * 100)
    : 0;

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 bg-linear-to-b from-white via-slate-50/70 to-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-[10px] font-bold tracking-widest uppercase mb-3">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Curated Clinical Routine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight">
            Curated Skincare Bundles
          </h2>
          <div className="w-12 h-1 bg-[#002B7F] mx-auto mt-3 mb-2.5 rounded-full" />
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Multi-step treatment systems paired for synergistic results and climate-resilient skin barrier defense.
          </p>
        </div>

        {/* Feature Showcase Card: El Niño Skincare Bundle */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden hover:border-slate-300 transition-all">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Visual Hero Showcase */}
            <div className="lg:col-span-5 relative bg-slate-100 p-6 sm:p-8 flex flex-col justify-between overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200">
              {/* Badges */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="bg-[#002B7F] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                  <ThermometerSun className="w-3 h-3 text-amber-300" />
                  <span>Climate Defense</span>
                </span>
                {discountPercent > 0 && (
                  <span className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                    Save {discountPercent}% (${discountAmount.toFixed(0)} Off)
                  </span>
                )}
              </div>

              {/* Main Product Bundle Image */}
              <div className="relative my-6 aspect-4/3 flex items-center justify-center">
                <img
                  src={getSafeImageUrl(bundleProduct.image)}
                  alt={bundleProduct.name}
                  className="max-h-64 sm:max-h-72 w-full object-contain rounded-2xl drop-shadow-md hover:scale-102 transition-transform duration-500"
                />
              </div>

              {/* Included Steps Counter Pill */}
              <div className="relative z-10 flex items-center justify-between text-xs text-slate-600 bg-white/90 backdrop-blur-md rounded-xl p-3 border border-slate-200/70">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Layers className="w-4 h-4 text-[#002B7F]" />
                  <span>4-Step Synergistic Routine</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  All Skin Types
                </span>
              </div>
            </div>

            {/* Bundle Details & Itemized Slots */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-bold text-[#002B7F] uppercase tracking-wider text-[11px]">
                    {bundleProduct.brand}
                  </span>
                  <span>•</span>
                  <span>{bundleProduct.size}</span>
                  <span>•</span>
                  <span className="font-mono text-slate-400">SKU: {bundleProduct.sku}</span>
                </div>

                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-950 tracking-tight leading-snug">
                  {bundleProduct.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
                  {bundleProduct.tagline}
                </p>

                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  {bundleProduct.shortDescription}
                </p>

                {/* Bundle Products Breakdown (User Slot Reservoirs) */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Included In This Bundle
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Cohesive AM &amp; PM Routine
                    </span>
                  </div>

                  <div className="space-y-2">
                    {(bundleProduct.bundledItems && bundleProduct.bundledItems.length > 0
                      ? bundleProduct.bundledItems
                      : [
                          {
                            step: "Step 1: Hydrating Cleanser",
                            brand: "Slot 1",
                            name: "Gentle Restorative Moisture Cleanser",
                            size: "150ml",
                            role: "Purifies without stripping lipid barrier oils.",
                          },
                          {
                            step: "Step 2: Deep Moisture Essence",
                            brand: "Slot 2",
                            name: "Intensive Hydration Multi-Molecular Essence",
                            size: "150ml",
                            role: "Replenishes moisture reservoirs parched by dry heat.",
                          },
                          {
                            step: "Step 3: Barrier Serum",
                            brand: "Slot 3",
                            name: "Ceramide & Centella Barrier Treatment Serum",
                            size: "30ml",
                            role: "Halts trans-epidermal water loss and soothes redness.",
                          },
                          {
                            step: "Step 4: Shield Moisturizer",
                            brand: "Slot 4",
                            name: "Deep Climate Defense Seal Cream",
                            size: "50ml",
                            role: "Locks in 48H continuous hydration against dry winds.",
                          },
                        ]
                    ).map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors flex items-start gap-3"
                      >
                        <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#002B7F] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2 flex-wrap">
                            <span className="text-xs font-bold text-slate-900">
                              {item.name}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded-md">
                              {item.size}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                            <strong className="text-slate-700">{item.step}:</strong> {item.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Benefits Strip */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <SunMedium className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>Halts climate-induced dehydration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>Shields against dry winds &amp; heatwaves</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>Triple ceramides + hyaluronic acid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>100% genuine sealed manufacturer batches</span>
                  </div>
                </div>
              </div>

              {/* Price and Action Bar */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Complete Bundle Price
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-950">
                      {formatPrice(bundleProduct.price)}
                    </span>
                    {bundleProduct.compareAtPrice > bundleProduct.price && (
                      <span className="text-sm font-mono text-slate-400 line-through">
                        {formatPrice(bundleProduct.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Link
                    href={`/product/${encodeURIComponent(bundleProduct.id)}`}
                    className="flex-1 sm:flex-none px-4 py-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View Bundle</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </Link>

                  <button
                    onClick={handleAddBundle}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-slate-900 hover:bg-[#002B7F] text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Bundle Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add Bundle to Bag</span>
                      </>
                    )}
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
