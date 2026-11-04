"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  Droplets,
  Share2,
  ArrowLeft,
  Check,
  ChevronRight,
  ShieldAlert,
  Clock,
  Heart,
  PhoneCall,
} from "lucide-react";
import { Product, ProductVariant } from "@/data/products";
import { useCart, getBundleUnitPrice } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import AuraAiChatModal from "@/components/AuraAiChatModal";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";

function getSafeImageUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("/api/proxy-image") || url.startsWith("/")) return url;
  if (url.startsWith("http")) return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  return url;
}

interface ProductDetailPageProps {
  initialProduct: Product;
  relatedProducts: Product[];
}

export function ProductDetailPage({
  initialProduct,
  relatedProducts,
}: ProductDetailPageProps) {
  const router = useRouter();
  const { addToCart, formatPrice, setIsCheckoutOpen } = useCart();

  const [product] = useState<Product>(initialProduct);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants[0] || null
  );
  const [bundleTier, setBundleTier] = useState<1 | 2 | 3>(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);

  const images =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const currentVariant =
    selectedVariant ||
    product.variants[0] || {
      name: "Standard Size",
      colorHex: "#002B7F",
      inStock: true,
    };

  const currentUnitPrice = getBundleUnitPrice(product.price, bundleTier);
  const currentTotal = currentUnitPrice * bundleTier;

  const handleAddToCart = () => {
    addToCart(product, currentVariant, bundleTier, true);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, currentVariant, bundleTier, false);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      const shareUrl = window.location.href;
      if (navigator.share) {
        navigator.share({
          title: `${product.name} • AURA`,
          text: `Check out authentic ${product.brand} - ${product.name} on AURA!`,
          url: shareUrl,
        }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 flex flex-col selection:bg-blue-100 selection:text-[#002B7F]">
      {/* Top Navigation */}
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between py-3 mb-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href="/"
              className="hover:text-[#002B7F] flex items-center gap-1 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalog</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium text-slate-700">{product.brand}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 truncate max-w-[200px] sm:max-w-xs">
              {product.name}
            </span>
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-[#002B7F] hover:border-blue-300 text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>

        {/* Product Hero Grid */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-4 sm:p-8 lg:p-10 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Gallery Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-square w-full bg-slate-50/70 rounded-2xl border border-slate-100 p-6 flex items-center justify-center overflow-hidden group">
                {/* Brand & Badge Tags */}
                <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-1.5 items-start">
                  <span className="bg-[#002B7F] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-xs">
                    {product.brand}
                  </span>
                  {product.badge && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      {product.badge}
                    </span>
                  )}
                  {product.verification && (
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Verified Batch
                    </span>
                  )}
                </div>

                <img
                  src={getSafeImageUrl(images[activeImageIndex] || product.image)}
                  alt={product.name}
                  className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border p-1 overflow-hidden transition-all shrink-0 cursor-pointer ${
                        activeImageIndex === idx
                          ? "border-[#002B7F] ring-2 ring-[#002B7F]/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <img
                        src={getSafeImageUrl(img)}
                        alt={`${product.name} thumb ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Clinical Authenticity Trust Banner */}
              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start gap-3 text-xs text-blue-950">
                <ShieldCheck className="w-5 h-5 text-[#002B7F] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#002B7F]">Authenticity & Verification</div>
                  <p className="text-[11px] text-blue-900/80 mt-0.5 leading-relaxed">
                    Audited genuine batch codes. Packaged in sealed tamper-evident containers with tracked courier dispatch.
                  </p>
                </div>
              </div>
            </div>

            {/* Info & Buying Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">
                      ({product.reviewCount} customer reviews)
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-mono text-slate-500">
                    SKU: {product.sku}
                  </span>
                  {product.size && (
                    <>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600">
                        {product.size}
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-950 leading-tight">
                  {product.name}
                </h1>

                {product.tagline && (
                  <p className="text-sm font-medium text-slate-600 mt-2">
                    {product.tagline}
                  </p>
                )}

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-950">
                    {formatPrice(currentUnitPrice)}
                  </span>
                  {product.compareAtPrice > product.price && (
                    <>
                      <span className="text-base font-mono text-slate-400 line-through">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                      <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                        Save {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-sm text-slate-600 mt-4 leading-relaxed">
                  {product.shortDescription ||
                    "Clinically formulated for daily skin barrier support, moisture retention, and smooth texture. Safe for sensitive skin types."}
                </p>

                {/* Key Ingredients & Skin Target */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Target Skin Type
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {product.skinType || "All Skin Types & Barrier Care"}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      Category
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Key Active Ingredients */}
                {product.keyIngredients && product.keyIngredients.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-semibold text-slate-600 block mb-2">
                      Key Active Ingredients:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.keyIngredients.map((ing, i) => (
                        <span
                          key={i}
                          className="bg-white border border-slate-200 text-slate-700 text-xs font-medium px-2.5 py-1 rounded-lg"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variants Selector */}
                {product.variants && product.variants.length > 1 && (
                  <div className="mt-6">
                    <span className="text-xs font-bold text-slate-800 block mb-2">
                      Select Variant:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.name}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`text-xs font-medium px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
                            currentVariant.name === v.name
                              ? "border-[#002B7F] bg-blue-50/70 text-[#002B7F] font-bold ring-1 ring-[#002B7F]"
                              : "border-slate-200 text-slate-700 hover:border-slate-300 bg-white"
                          }`}
                        >
                          {v.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Multi-Pack Bundle Tier Selector */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">
                      Bundle & Save (Recommended):
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      Unlocked at checkout
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    {/* Tier 1 */}
                    <button
                      type="button"
                      onClick={() => setBundleTier(1)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        bundleTier === 1
                          ? "border-[#002B7F] bg-blue-50/60 ring-2 ring-[#002B7F]/20 font-bold"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">1 Unit</div>
                      <div className="text-xs font-mono text-slate-600 mt-1">
                        {formatPrice(product.price)}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Standard</div>
                    </button>

                    {/* Tier 2 */}
                    <button
                      type="button"
                      onClick={() => setBundleTier(2)}
                      className={`p-3 rounded-2xl border text-center relative transition-all cursor-pointer ${
                        bundleTier === 2
                          ? "border-[#002B7F] bg-blue-50/60 ring-2 ring-[#002B7F]/20 font-bold"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                        SAVE 15%
                      </span>
                      <div className="text-xs font-bold text-slate-900">2-Pack</div>
                      <div className="text-xs font-mono text-slate-600 mt-1">
                        {formatPrice(getBundleUnitPrice(product.price, 2))}/ea
                      </div>
                      <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Duo Savings</div>
                    </button>

                    {/* Tier 3 */}
                    <button
                      type="button"
                      onClick={() => setBundleTier(3)}
                      className={`p-3 rounded-2xl border text-center relative transition-all cursor-pointer ${
                        bundleTier === 3
                          ? "border-[#002B7F] bg-blue-50/60 ring-2 ring-[#002B7F]/20 font-bold"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                        SAVE 25%
                      </span>
                      <div className="text-xs font-bold text-slate-900">3-Pack</div>
                      <div className="text-xs font-mono text-slate-600 mt-1">
                        {formatPrice(getBundleUnitPrice(product.price, 3))}/ea
                      </div>
                      <div className="text-[10px] text-amber-700 font-medium mt-0.5">Free Express Ship</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Purchase Call-To-Action Box */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Subtotal ({bundleTier} unit{bundleTier > 1 ? "s" : ""}):</span>
                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-950">
                      {formatPrice(currentTotal)}
                    </div>
                  </div>
                  {bundleTier > 1 && (
                    <div className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                      You save {formatPrice(product.price * bundleTier - currentTotal)}!
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="w-full bg-[#002B7F] hover:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Instant Checkout</span>
                  </button>
                </div>

                {/* Delivery Guarantee Info */}
                <div className="mt-4 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tracked door delivery (Lagos, Abuja & nationwide)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1–4 business days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits & Clinical Verifications Tabs/Grid */}
        {product.benefits && product.benefits.length > 0 && (
          <div className="mb-12 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#002B7F]" />
              <span>Key Clinical Benefits & Results</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {product.benefits.map((b, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-700 font-medium leading-relaxed">
                    {b}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related Skincare Items */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                  You Might Also Like
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Frequently paired with {product.name}
                </p>
              </div>
              <Link
                href="/"
                className="text-xs font-bold text-[#002B7F] hover:underline flex items-center gap-1"
              >
                <span>View Full Store</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Global Modals */}
      <CartDrawer />
      <CheckoutModal />
      <GlobalSearchModal />
      <AuraAiChatModal isOpen={isAiChatOpen} onClose={() => setIsAiChatOpen(false)} />
      <ProductModal />
    </div>
  );
}
