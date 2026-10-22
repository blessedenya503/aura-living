"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShoppingBag,
  Check,
  ShieldCheck,
  Star,
  ArrowRight,
  Droplets,
  Flame,
  TrendingUp,
  Eye,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import { GlitchText } from "@/components/ui/animated-glitch-text";

function TikTokIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.41a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.69a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.28 8.28 0 0 0 4.84 1.55V7.18a4.85 4.85 0 0 1-.93-.49z" />
    </svg>
  );
}

interface TikTokViralTrend {
  id: string;
  brand: string;
  name: string;
  views: string;
  viralTag: string;
  trendHook: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImage: string;
  fallbackPrice: number;
  size: string;
  rating: number;
  reviewCount: number;
  ingredients: string[];
}

const TIKTOK_VIRAL_CATALOG: TikTokViralTrend[] = [
  {
    id: "prod-cosrx-snail-96",
    brand: "COSRX",
    name: "COSRX Advanced Snail 96 Mucin Power Essence",
    views: "4.8B Views",
    viralTag: "#TikTokMadeMeBuyIt • Viral Glass Skin",
    trendHook: "The #1 Most Viral Skincare Product on TikTok Globally",
    heroHeadline: "Glass Skin Dew.",
    heroHighlight: "4.8 Billion TikTok Sensation.",
    heroSubtitle:
      "Formulated with 96.3% Snail Secretion Filtrate to repair damaged moisture barriers, fade acne scars, and deliver intense luminous hydration.",
    heroImage:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop",
    fallbackPrice: 19.99,
    size: "100ml / 3.38 fl. oz",
    rating: 4.9,
    reviewCount: 48920,
    ingredients: ["96.3% Snail Secretion Filtrate", "Sodium Hyaluronate", "Allantoin", "Panthenol"],
  },
  {
    id: "prod-nivea-creme-classic",
    brand: "NIVEA",
    name: "NIVEA Creme Classic Intensive Hydration Tin",
    views: "1.5B Views",
    viralTag: "Viral #LaMerDupe Trend",
    trendHook: "Dermatologists & Beauty Creators Swear By It",
    heroHeadline: "The $8 Miracle Cream.",
    heroHighlight: "TikTok's Famous Crème Dupe.",
    heroSubtitle:
      "Skin-identical Eucerit® and Provitamin B5 deliver rich 48H continuous occlusive slugging that outperforms $350 luxury moisturizers.",
    heroImage:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop",
    fallbackPrice: 8.99,
    size: "250ml / 8.4 oz Classic Tin",
    rating: 4.9,
    reviewCount: 38200,
    ingredients: ["Eucerit®", "Panthenol (B5)", "Glycerin", "Lanolin Alcohol"],
  },
  {
    id: "prod-beauty-of-joseon-relief-sun",
    brand: "Beauty of Joseon",
    name: "Beauty of Joseon Relief Sun: Rice + Probiotics SPF 50+",
    views: "1.9B Views",
    viralTag: "TikTok #1 Holy Grail Sunscreen",
    trendHook: "Zero White Cast • Serum Texture",
    heroHeadline: "No White Cast.",
    heroHighlight: "TikTok's Holy Grail Sunscreen.",
    heroSubtitle:
      "Infused with 30% Rice Extract and fermented grain probiotics. Feels like a lightweight moisturizing cream without greasiness.",
    heroImage:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop",
    fallbackPrice: 18.0,
    size: "50ml Tube",
    rating: 4.9,
    reviewCount: 31400,
    ingredients: ["30% Rice Extract", "Grain Fermented Probiotics", "Niacinamide", "Vitamin E"],
  },
  {
    id: "prod-amz-1949",
    brand: "Anua",
    name: "Anua Heartleaf 77% Soothing Toner Balance & Calm",
    views: "2.4B Views",
    viralTag: "TikTok Viral #GlassSkin Toner",
    trendHook: "Korea's Olive Young #1 Viral Award Winner",
    heroHeadline: "Calm Redness.",
    heroHighlight: "77% Pure Heartleaf Extract.",
    heroSubtitle:
      "Soothes sensitive, breakout-prone skin while restoring optimal pH balance. The secret behind the viral TikTok 7-Skin Method.",
    heroImage:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1200&auto=format&fit=crop",
    fallbackPrice: 22.0,
    size: "250ml Bottle",
    rating: 4.8,
    reviewCount: 24500,
    ingredients: ["77% Houttuynia Cordata Extract", "Centella Asiatica", "Chamomilla Flower", "Panthenol"],
  },
  {
    id: "prod-laroche-posay-cicaplast",
    brand: "La Roche-Posay",
    name: "La Roche-Posay Cicaplast Baume B5+ Ultra-Repairing Balm",
    views: "3.2B Views",
    viralTag: "TikTok #SkinCycling & Slugging",
    trendHook: "Emergency Barrier Recovery in 1 Night",
    heroHeadline: "Overnight Repair.",
    heroHighlight: "TikTok Slugging Essential.",
    heroSubtitle:
      "Madecassoside, 5% Panthenol, and Tribioma prebiotics instantly rebuild damaged barriers from over-exfoliation and tretinoin peeling.",
    heroImage:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop",
    fallbackPrice: 22.99,
    size: "100ml Large Tube",
    rating: 4.9,
    reviewCount: 42100,
    ingredients: ["5% Panthenol (B5)", "Madecassoside", "Tribioma Prebiotics", "Shea Butter"],
  },
];

export default function Hero() {
  const { products, addToCart, setSelectedProduct, formatPrice, storeSettings } = useCart();
  const [selectedTrendIndex, setSelectedTrendIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const activeTrend = TIKTOK_VIRAL_CATALOG[selectedTrendIndex] || TIKTOK_VIRAL_CATALOG[0];

  // Try to find the matching product in our live 300+ catalog
  const matchingLiveProduct = useMemo(() => {
    return (
      products.find(
        (p) =>
          p.id === activeTrend.id ||
          p.name.toLowerCase().includes(activeTrend.brand.toLowerCase()) &&
            p.name.toLowerCase().includes(activeTrend.name.split(" ")[1]?.toLowerCase() || "")
      ) || null
    );
  }, [products, activeTrend]);

  const effectivePrice = matchingLiveProduct ? matchingLiveProduct.price : activeTrend.fallbackPrice;

  const handleQuickAdd = () => {
    if (matchingLiveProduct) {
      addToCart(matchingLiveProduct, matchingLiveProduct.variants[0], 1, true);
    } else {
      // Fallback synthetic product
      const syntheticProduct: Product = {
        id: activeTrend.id,
        sku: `TIKTOK-${activeTrend.brand.substring(0, 3).toUpperCase()}-01`,
        brand: activeTrend.brand,
        name: activeTrend.name,
        tagline: activeTrend.viralTag,
        size: activeTrend.size,
        skinType: "All Skin Types",
        category: "Active Serums & Toners",
        price: activeTrend.fallbackPrice,
        compareAtPrice: parseFloat((activeTrend.fallbackPrice * 1.35).toFixed(2)),
        supplierCost: parseFloat((activeTrend.fallbackPrice * 0.35).toFixed(2)),
        rating: activeTrend.rating,
        reviewCount: activeTrend.reviewCount,
        soldCountText: "Over 25K+ viral orders shipped",
        badge: "TikTok #1 Trending",
        shortDescription: activeTrend.heroSubtitle,
        keyIngredients: activeTrend.ingredients,
        benefits: [
          "Clinically proven rapid barrier hydration",
          "Loved by over 4.8B TikTok beauty creators",
          "Non-comedogenic and dermatologist tested"
        ],
        image: activeTrend.heroImage,
        gallery: [activeTrend.heroImage],
        variants: [{ name: "Standard Viral Size", colorHex: "#FE2C55", inStock: true }],
        stockLeft: 180,
        reviews: [],
        faqs: [],
        supplierSource: "Amazon Prime Dropship",
        shippingDays: "2–4 Days (Express Dropship)"
      };
      addToCart(syntheticProduct, syntheticProduct.variants[0], 1, true);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-[#070B14] text-white border-b border-slate-800">
      {/* 21st.dev Ambient Glow Grid Background - strictly behind content (z-0) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-70" />
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[450px] h-[300px] bg-[#00F2FE]/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[450px] h-[300px] bg-[#FE2C55]/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: TikTok Viral Showcase & High-Contrast Typography */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* TikTok Viral Live Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 border border-slate-700 text-white text-xs font-bold tracking-wide mb-6 shadow-xl backdrop-blur-md">
              <span className="p-1 rounded-full bg-black text-white flex items-center justify-center">
                <TikTokIcon className="w-3.5 h-3.5 text-cyan-400" />
              </span>
              <GlitchText
                text="TRENDING TIKTOK PRODUCTS"
                as="span"
                className="min-h-0 p-0 justify-start items-center"
                containerClassName="inline-block"
                textClassName="text-[11px] font-extrabold uppercase tracking-wider text-white"
                colors={{
                  red: "#FE2C55",
                  green: "#25F4EE",
                  blue: "#FFFFFF",
                }}
              />
              <span className="text-slate-200 font-mono text-[11px] font-semibold">
                • {activeTrend.views}
              </span>
            </div>

            {/* High-Contrast Crisp Headline (Responsive & Perfectly Aligned) */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] drop-shadow-md">
              {activeTrend.heroHeadline} <br />
              <span className="text-amber-300 drop-shadow-[0_2px_14px_rgba(252,211,77,0.45)]">
                {activeTrend.heroHighlight}
              </span>
            </h1>

            {/* High-Contrast Subtitle */}
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-slate-100 max-w-xl font-medium leading-relaxed drop-shadow-xs">
              {activeTrend.heroSubtitle}
            </p>

            {/* TikTok Virality Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-800 text-xs text-white">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500 animate-bounce" />
                <span className="font-bold text-white">{activeTrend.views} Global Impact</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-300" />
                <span className="text-slate-100 font-semibold">{activeTrend.viralTag}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-slate-100 font-semibold">Verified Fresh Batch</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6 sm:mt-8">
              <button
                onClick={handleQuickAdd}
                className="w-full sm:w-auto justify-center bg-linear-to-r from-cyan-500 via-blue-600 to-pink-600 hover:opacity-95 text-white font-bold px-6 sm:px-7 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-pink-950/40 transition-all hover:scale-[1.02] cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-white" />
                    <span>
                      Order TikTok Viral • {formatPrice(effectivePrice)}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={scrollToCatalog}
                className="w-full sm:w-auto justify-center bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold px-5 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <span>Browse Dropship Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Interactive TikTok Viral Hero Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-md bg-linear-to-b from-slate-900/95 via-slate-950 to-slate-950 rounded-3xl p-5 border border-slate-800/80 shadow-2xl backdrop-blur-md ring-1 ring-cyan-500/20">
              {/* TikTok Trend Switcher Navigation */}
              <div className="flex items-center justify-between gap-1 bg-slate-950/80 p-1 rounded-xl mb-4 border border-slate-800/80 overflow-x-auto no-scrollbar">
                {TIKTOK_VIRAL_CATALOG.map((trend, idx) => (
                  <button
                    key={trend.id}
                    onClick={() => setSelectedTrendIndex(idx)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer flex items-center justify-center gap-1 ${
                      selectedTrendIndex === idx
                        ? "bg-[#FE2C55] text-white shadow-md shadow-pink-900/30 ring-1 ring-pink-400"
                        : "text-slate-200 hover:text-white"
                    }`}
                  >
                    <span>{trend.brand}</span>
                    <span className="opacity-90 font-mono text-[9px]">({trend.views.split(" ")[0]})</span>
                  </button>
                ))}
              </div>

              {/* Spotlight Product Image with TikTok Overlays */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTrend.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer group shadow-inner"
                  onClick={() => {
                    if (matchingLiveProduct) setSelectedProduct(matchingLiveProduct);
                  }}
                >
                  <img
                    src={activeTrend.heroImage}
                    alt={activeTrend.name}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />

                  {/* Top Left: Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    <span className="bg-black/80 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-lg flex items-center gap-1 border border-slate-700">
                      <TikTokIcon className="w-3 h-3 text-cyan-400" />
                      <span>{activeTrend.views}</span>
                    </span>
                    <span className="bg-[#FE2C55] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                      {activeTrend.viralTag}
                    </span>
                  </div>

                  {/* Top Right: Brand badge */}
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#002B7F] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full shadow-md">
                      {activeTrend.brand}
                    </span>
                  </div>

                  {/* Floating Action Hint */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-white/95 text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-blue-700" />
                      View Viral Formula
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Product Meta Details */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{activeTrend.rating}</span>
                    <span className="text-slate-200 font-normal">
                      ({activeTrend.reviewCount.toLocaleString()} reviews)
                    </span>
                  </div>
                  <span className="text-slate-200 font-mono text-[11px] font-semibold">
                    {activeTrend.size}
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <h3 className="text-base font-bold text-white line-clamp-1">
                    {activeTrend.name}
                  </h3>
                  <div className="text-right">
                    <span className="text-lg font-bold text-white font-mono">
                      {formatPrice(effectivePrice)}
                    </span>
                  </div>
                </div>

                {/* Key Ingredients */}
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeTrend.ingredients.slice(0, 3).map((ing, i) => (
                    <span
                      key={i}
                      className="bg-slate-800 text-slate-100 border border-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md"
                    >
                      {ing}
                    </span>
                  ))}
                </div>

                {/* Instant Actions */}
                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      if (matchingLiveProduct) setSelectedProduct(matchingLiveProduct);
                    }}
                    className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Viral Details
                  </button>
                  <button
                    onClick={handleQuickAdd}
                    className="py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-[#FE2C55] hover:opacity-95 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Claim Deal
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
