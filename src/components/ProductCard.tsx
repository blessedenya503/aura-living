"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Plus, Check, Eye, ShieldCheck, CheckCircle2, Info } from "lucide-react";
import { Product, ProductVariant } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { GlitchText } from "@/components/ui/animated-glitch-text";

function TikTokIcon({ className = "w-3 h-3" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.41a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.69a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.28 8.28 0 0 0 4.84 1.55V7.18a4.85 4.85 0 0 1-.93-.49z" />
    </svg>
  );
}

interface ProductCardProps {
  product: Product;
}

function getSafeImageUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("/api/proxy-image") || url.startsWith("/")) {
    return url;
  }
  if (url.startsWith("http")) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, formatPrice, setSelectedProduct } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0]
  );
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => getSafeImageUrl(product.image));

  React.useEffect(() => {
    setImgSrc(getSafeImageUrl(product.image));
  }, [product.image]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant, 1, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const discountPercent =
    product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
        )
      : null;

  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Product Image Stage */}
      <div className="relative w-full h-48 sm:h-64 bg-white p-3 overflow-hidden flex items-center justify-center border-b border-slate-100">
        {/* Only the Product Brand Badge as requested */}
        <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
          <span className="bg-[#002B7F] text-white text-[9.5px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shadow-xs">
            {product.brand}
          </span>
        </div>

        {discountPercent && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
              Save {discountPercent}%
            </span>
          </div>
        )}

        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={() => {
            if (imgSrc.startsWith("/api/proxy-image") && product.image) {
              setImgSrc(product.image);
            }
          }}
        />

        {/* Floating Quick View hint on hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-blue-700" />
            Quick View
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Header row: Size & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-mono text-[11px] font-medium text-slate-400">
              {product.size}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">
                ({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
              </span>
            </div>
          </div>

          {/* Product Name (Uniform min-height for perfect grid alignment) */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#002B7F] transition-colors line-clamp-2 min-h-[2.25rem] leading-snug">
            {product.name}
          </h3>

          {/* Skin Type / Concise Benefit Pill */}
          <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-1 min-h-[1rem]">
            {product.tagline}
          </p>

          {/* Verified Traceability Micro-Badge */}
          {product.verification && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-800 bg-emerald-50/80 border border-emerald-200/60 rounded-md px-2 py-0.5 w-fit">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="font-mono text-[9.5px] font-medium text-emerald-900 truncate">
                {product.verification.referenceId}
              </span>
              <span className="text-emerald-300">•</span>
              <span className="text-[9.5px] text-emerald-700 font-medium truncate">
                {product.verification.originCountry.split(",")[0]}
              </span>
            </div>
          )}

          {/* Ingredient Pills */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {product.keyIngredients.slice(0, 2).map((ing, idx) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md truncate max-w-[140px]"
              >
                {ing}
              </span>
            ))}
          </div>

          {/* Variant Selector (if multiple) */}
          {product.variants.length > 1 && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-semibold text-slate-500">
                  Options ({product.variants.length}):
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    alert("Note: product may differ in color or size depending on edition/batch.");
                  }}
                  className="p-1 -mr-1 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer group/tip relative"
                  title="Click for substitute details"
                  aria-label="Substitute notification"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {product.variants.map((v) => (
                  <button
                    key={v.name}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVariant(v);
                    }}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all shrink-0 ${
                      selectedVariant.name === v.name
                        ? "border-[#002B7F] bg-blue-50/80 text-[#002B7F]"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {v.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-slate-950 font-mono">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-mono">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              isAdded
                ? "bg-emerald-600 text-white scale-95"
                : "bg-slate-900 hover:bg-[#002B7F] text-white hover:scale-102"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
