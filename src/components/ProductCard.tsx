"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { Product } from "@/data/products";
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
  const { addToCart, formatPrice } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(() => getSafeImageUrl(product.image));

  React.useEffect(() => {
    setImgSrc(getSafeImageUrl(product.image));
  }, [product.image]);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.variants?.[0] || {
      name: "Standard",
      colorHex: "#002B7F",
      inStock: true,
    };
    addToCart(product, variant, 1, false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  return (
    <Link
      href={`/product/${encodeURIComponent(product.id)}`}
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-400 transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer shadow-xs hover:shadow-md"
    >
      {/* Product Image Stage */}
      <div className="relative w-full aspect-square bg-[#FAFAFA] p-3 flex items-center justify-center overflow-hidden">
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

      {/* Only Price and Simple Add Button Below */}
      <div className="p-3 border-t border-slate-100 flex items-center justify-between gap-2 bg-white">
        <div className="font-mono text-sm sm:text-base font-extrabold text-slate-950">
          {formatPrice(product.price)}
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
    </Link>
  );
}
