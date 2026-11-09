"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  X,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  Droplets,
  FlaskConical,
  ExternalLink,
  Info,
  Zap,
} from "lucide-react";
import { Product, ProductVariant } from "@/data/products";
import { useCart, getBundleUnitPrice } from "@/context/CartContext";

function getSafeImageUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("/api/proxy-image") || url.startsWith("/")) return url;
  if (url.startsWith("http")) return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  return url;
}

export default function ProductModal() {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    formatPrice,
    setIsCheckoutOpen,
  } = useCart();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [bundleTier, setBundleTier] = useState<1 | 2 | 3>(1);

  if (!selectedProduct) return null;

  const currentVariant =
    selectedVariant || selectedProduct.variants[0] || {
      name: "Standard",
      colorHex: "#0032A0",
      inStock: true,
    };

  const images =
    selectedProduct.gallery && selectedProduct.gallery.length > 0
      ? selectedProduct.gallery
      : [selectedProduct.image];

  const currentUnitPrice = getBundleUnitPrice(selectedProduct.price, bundleTier);
  const currentTotal = currentUnitPrice * bundleTier;

  const handleAddToCart = () => {
    addToCart(selectedProduct, currentVariant, bundleTier, true);
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, currentVariant, bundleTier, false);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-full sm:max-w-4xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden sm:my-auto max-h-[92dvh] sm:max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Pill */}
        <div className="sm:hidden flex justify-center pt-2 pb-1 bg-slate-50 shrink-0">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* Action icons top right */}
        <div className="absolute top-2.5 right-3 sm:top-4 sm:right-4 z-20 flex items-center gap-1.5">
          <a
            href={`/product/${encodeURIComponent(selectedProduct.id)}`}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-[#002B7F] transition-colors shadow-xs cursor-pointer"
            title="Open dedicated product page"
          >
            <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
          <button
            onClick={() => setSelectedProduct(null)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/95 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-950 transition-colors shadow-xs cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="w-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Visual Gallery */}
            <div className="p-3 sm:p-6 bg-slate-50 flex flex-col justify-between">
              <div className="relative aspect-square w-full max-h-[220px] sm:max-h-none rounded-2xl overflow-hidden bg-white border border-slate-200/80 shadow-xs flex items-center justify-center p-2 sm:p-3">
              <img
                src={
                  getSafeImageUrl(images[activeImageIndex] || selectedProduct.image)
                }
                alt={selectedProduct.name}
                className="w-full h-full object-contain p-1 sm:p-2"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onError={(e) => {
                  const target = e.currentTarget;
                  const raw = images[activeImageIndex] || selectedProduct.image;
                  if (target.src.includes("/api/proxy-image") && raw) {
                    target.src = raw;
                  }
                }}
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                <span className="bg-[#002B7F] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs">
                  {selectedProduct.brand}
                </span>
                {selectedProduct.badge && (
                  <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                    {selectedProduct.badge}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activeImageIndex === idx
                        ? "border-[#002B7F] shadow-xs"
                        : "border-slate-200 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-contain p-1 bg-white"
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Micro-Trust */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-200 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Factory-Sealed Formula</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Express Courier Dispatch</span>
              </div>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="p-4 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-mono text-slate-400">
                  {selectedProduct.sku} • {selectedProduct.size}
                </span>
                <div className="flex items-center gap-1 text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{selectedProduct.rating}</span>
                  <span className="text-slate-400">
                    ({selectedProduct.reviewCount.toLocaleString()} reviews)
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-950 tracking-tight">
                {selectedProduct.name}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                {selectedProduct.shortDescription}
              </p>

              {/* Target & Key Ingredients */}
              <div className="mt-4 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <div className="text-[11px] font-bold text-[#002B7F] uppercase tracking-wider flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>Target: {selectedProduct.skinType}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedProduct.keyIngredients.map((ing, i) => (
                    <span
                      key={i}
                      className="bg-white border border-blue-200 text-blue-900 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Variants */}
              {selectedProduct.variants.length > 1 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-700">
                      Select Size / Substitute ({selectedProduct.variants.length} available):
                    </span>
                    <button
                      type="button"
                      onClick={() => alert("Note: product may differ in color or size depending on edition/batch.")}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-[#002B7F] hover:bg-blue-100 text-[11px] font-semibold transition-colors cursor-pointer"
                      title="Click for substitute details"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Notice</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.map((v) => (
                      <button
                        key={v.name}
                        onClick={() => setSelectedVariant(v)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                          currentVariant.name === v.name
                            ? "border-[#002B7F] bg-[#002B7F] text-white shadow-xs"
                            : "border-slate-200 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {v.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dropship Logistics & Origin Badge */}
              <div className="mt-3.5 flex items-center justify-between text-xs py-2 px-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-700 font-medium text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-[#002B7F]" />
                  <span>{selectedProduct.shippingDays || "2–5 Days Tracked Express Delivery"}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                  {selectedProduct.supplierSource || "Authorized Distributor"}
                </span>
              </div>

              {/* Verified Sourcing & Authenticity Certificate */}
              {selectedProduct.verification && (
                <div className="mt-4 p-3.5 bg-linear-to-br from-emerald-50/70 via-slate-50 to-blue-50/40 rounded-2xl border border-emerald-200/80 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Authenticity & Traceability Certificate</span>
                    </div>
                    <span className="text-[10px] font-mono font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      ✓ Audit Passed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2.5 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider font-semibold">
                        Official Registry
                      </span>
                      <span className="font-semibold text-slate-800 truncate block">
                        {selectedProduct.verification.registry}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider font-semibold">
                        Reference ID / License
                      </span>
                      <span className="font-mono font-bold text-[#002B7F] truncate block">
                        {selectedProduct.verification.referenceId}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider font-semibold">
                        Laboratory Origin
                      </span>
                      <span className="font-medium text-slate-700 truncate block">
                        {selectedProduct.verification.originCountry}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9.5px] uppercase tracking-wider font-semibold">
                        Batch Lot Number
                      </span>
                      <span className="font-mono font-semibold text-slate-700 truncate block">
                        {selectedProduct.verification.batchLotNumber}
                      </span>
                    </div>
                  </div>

                  {/* Laboratory Certifications */}
                  {Array.isArray(selectedProduct.verification.laboratoryCertifications) &&
                    selectedProduct.verification.laboratoryCertifications.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-emerald-100/70">
                        <span className="text-slate-500 text-[9.5px] uppercase tracking-wider font-semibold block mb-1">
                          Certified Standards & Compliance
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {selectedProduct.verification.laboratoryCertifications.map((cert, idx) => (
                            <span
                              key={idx}
                              className="bg-white border border-emerald-200 text-emerald-900 text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-2xs"
                            >
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                              <span>{cert}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Direct Link to Source */}
                  <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-emerald-100/70">
                    <span className="text-slate-500 text-[10px]">
                      Audited: {selectedProduct.verification.verifiedAt}
                    </span>
                    <a
                      href={selectedProduct.verification.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#002B7F] hover:text-blue-800 hover:underline"
                    >
                      <span>Verify Registry Listing</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {/* Clinical Results Card */}
              <div className="mt-4 p-3 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
                    <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Clinical Efficacy &amp; Results (14 Days)</span>
                  </div>
                  <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    +89% Measured Hydration
                  </span>
                </div>

                {/* 2-Panel Before vs After Comparison */}
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="font-bold font-mono text-rose-400 block mb-0.5">
                      Day 0 Baseline
                    </span>
                    <p className="text-slate-400 leading-tight">
                      Compromised lipid matrix, dryness &amp; redness.
                    </p>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                    <span className="font-bold font-mono text-emerald-400 block mb-0.5">
                      Day 14 Outcome
                    </span>
                    <p className="text-slate-300 leading-tight">
                      Restored barrier, smooth texture &amp; plump dew.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                  <span>Instrument: Corneometer CM 825</span>
                  <span className="text-emerald-400 font-semibold">100% Non-Comedogenic</span>
                </div>
              </div>

              {/* Multi-Pack Bundle Savings */}
              <div className="mt-5">
                <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
                  <span>Select Package Option:</span>
                  <span className="text-emerald-600 font-bold text-[11px]">
                    {bundleTier === 3
                      ? "Family Pack (-25%)"
                      : bundleTier === 2
                      ? "Duo Pack (-15%)"
                      : "Standard Single"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    onClick={() => setBundleTier(1)}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col justify-between ${
                      bundleTier === 1
                        ? "border-[#002B7F] bg-blue-50/60 ring-2 ring-[#002B7F]/20 font-bold shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">1 Unit</div>
                    <div className="text-xs font-mono font-extrabold text-slate-950 mt-0.5">
                      {formatPrice(selectedProduct.price)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Standard</div>
                  </button>

                  <button
                    onClick={() => setBundleTier(2)}
                    className={`p-3 rounded-2xl border text-center relative transition-all cursor-pointer flex flex-col justify-between ${
                      bundleTier === 2
                        ? "border-[#002B7F] bg-blue-50/60 ring-2 ring-[#002B7F]/20 font-bold shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                      SAVE 15%
                    </span>
                    <div className="text-xs font-bold text-slate-900">2-Pack</div>
                    <div className="text-xs font-mono font-extrabold text-slate-950 mt-0.5">
                      {formatPrice(getBundleUnitPrice(selectedProduct.price, 2))}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Duo Savings</div>
                  </button>

                  <button
                    onClick={() => setBundleTier(3)}
                    className={`p-3 rounded-2xl border text-center relative transition-all cursor-pointer flex flex-col justify-between ${
                      bundleTier === 3
                        ? "border-[#002B7F] bg-blue-50/60 ring-2 ring-[#002B7F]/20 font-bold shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[8.5px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs whitespace-nowrap">
                      SAVE 25%
                    </span>
                    <div className="text-xs font-bold text-slate-900">3-Pack</div>
                    <div className="text-xs font-mono font-extrabold text-slate-950 mt-0.5">
                      {formatPrice(getBundleUnitPrice(selectedProduct.price, 3))}
                    </div>
                    <div className="text-[10px] text-amber-800 font-medium mt-0.5">Value Pack</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-white mt-4 sm:mt-6 pt-3 pb-safe border-t border-slate-100 flex flex-col gap-2 shadow-xs">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-500">Total Price:</span>
                  <div className="text-xl sm:text-2xl font-bold font-mono text-slate-950">
                    {formatPrice(currentTotal)}
                  </div>
                </div>
                <div className="text-right text-xs text-emerald-600 font-semibold">
                  {bundleTier > 1 && (
                    <span>
                      You save{" "}
                      {formatPrice(selectedProduct.price * bundleTier - currentTotal)}!
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add to Bag
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-[#002B7F] hover:bg-blue-800 text-white font-extrabold py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-amber-300 text-amber-300 animate-pulse" />
                  Instant Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
