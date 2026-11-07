"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Check,
  ChevronRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { Product, ProductVariant } from "@/data/products";
import { useCart } from "@/context/CartContext";

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
  const { addToCart, formatPrice, isDiscountEligible } = useCart();
  const [selectedVariant] = useState<ProductVariant>(
    product.variants[0] || { name: "Standard", colorHex: "#002B7F", inStock: true }
  );
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => getSafeImageUrl(product.image));

  React.useEffect(() => {
    setImgSrc(getSafeImageUrl(product.image));
  }, [product.image]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedVariant, 1, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  // Slashed price display: smaller, raised like an exponent
  const hasDiscount = isDiscountEligible && product.compareAtPrice > product.price;

  // Clean brand display
  const brandName = product.brand || "Authentic";

  // First ingredient or short tagline
  const keySubtext =
    (product.keyIngredients && product.keyIngredients[0]) ||
    product.tagline ||
    "Clinical formula";

  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-400 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer shadow-xs hover:shadow-md"
    >
      {/* Product Image Stage */}
      <div className="relative w-full aspect-square bg-[#FAFAFA] p-3 flex items-center justify-center overflow-hidden border-b border-slate-100">
        {/* Subtle Brand Pill */}
        <span className="absolute top-2 left-2 z-10 bg-slate-900/90 text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md pointer-events-none">
          {brandName}
        </span>

        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onError={() => {
            if (imgSrc.startsWith("/api/proxy-image") && product.image) {
              setImgSrc(product.image);
            }
          }}
        />
      </div>

      {/* Card Content - Compact & Clean */}
      <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 gap-1.5">
        <div>
          {/* Line 1: Size & Rating with review count */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono leading-none">
            <span className="truncate max-w-[55%] text-slate-500 font-medium">
              {product.size || "Standard"}
            </span>
            <span className="flex items-center gap-0.5 font-semibold text-slate-800">
              ★ {product.rating || "4.8"}{" "}
              <span className="text-slate-400 font-normal">
                ({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount || 42})
              </span>
            </span>
          </div>

          {/* Line 2: Product Name (Single line, strictly truncated so all cards remain perfectly identical in height) */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#002B7F] transition-colors truncate mt-1">
            {product.name}
          </h3>

          {/* Line 3: Ingredient / Subtext (Single line truncate) */}
          <p className="text-[10.5px] sm:text-[11px] text-slate-500 truncate mt-0.5">
            {keySubtext}
          </p>
        </div>

        {/* Line 4: Price & Action */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 mt-1">
          {/* Price with superscript exponent slashed price */}
          <div className="flex items-baseline font-mono">
            <span className="text-sm sm:text-base font-extrabold text-slate-950">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-[11px] text-slate-400 line-through -translate-y-1 ml-1">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            type="button"
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 hover:bg-[#002B7F] text-white"
            }`}
            aria-label="Add to bag"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="text-[11px]">Added</span>
              </>
            ) : (
              <span className="text-[11px]">Add</span>
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
