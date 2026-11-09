"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";

function getSafeImageUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("/api/proxy-image") || url.startsWith("/")) return url;
  if (url.startsWith("http")) return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  return url;
}

interface TrendSlide {
  id: string;
  brand: string;
  name: string;
  badge: string;
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

const FEATURED_SLIDES: TrendSlide[] = [
  {
    id: "prod-cosrx-28",
    brand: "COSRX",
    name: "Advanced Snail 96 Mucin Power Essence",
    badge: "Trending Worldwide",
    heroHeadline: "Glass Skin Dew.",
    heroHighlight: "Pure Hydration.",
    heroSubtitle:
      "Deeply hydrates and restores skin moisture barriers with 96.3% snail mucin.",
    heroImage: "/uploads/hero-61p-wtpDraL.jpg",
    fallbackPrice: 19.99,
    size: "100ml / 3.38 fl. oz",
    rating: 4.9,
    reviewCount: 48920,
    ingredients: ["96.3% Snail Secretion Filtrate", "Hyaluronic Acid", "Panthenol"],
  },
  {
    id: "prod-beautyofjoseon-30",
    brand: "Beauty of Joseon",
    name: "Relief Sun: Rice + Probiotics SPF 50+",
    badge: "Dermatologist Tested",
    heroHeadline: "Daily Defense.",
    heroHighlight: "Zero White Cast.",
    heroSubtitle:
      "Lightweight moisturizing sunscreen with rice extract and probiotics.",
    heroImage: "https://images.openbeautyfacts.org/images/products/880/996/813/0277/front_nl.21.400.jpg",
    fallbackPrice: 18.0,
    size: "50ml Tube",
    rating: 4.9,
    reviewCount: 31400,
    ingredients: ["30% Rice Extract", "Grain Probiotics", "Niacinamide"],
  },
  {
    id: "prod-anua-32",
    brand: "Anua",
    name: "Heartleaf 77% Soothing Balance Toner",
    badge: "Award Winner",
    heroHeadline: "Calm Redness.",
    heroHighlight: "77% Pure Heartleaf.",
    heroSubtitle:
      "Gentle balancing toner that soothes sensitive, irritated skin and clears pores.",
    heroImage: "https://images.openbeautyfacts.org/images/products/880/964/073/6025/front_nl.3.400.jpg",
    fallbackPrice: 22.0,
    size: "250ml Bottle",
    rating: 4.8,
    reviewCount: 24500,
    ingredients: ["77% Heartleaf Extract", "Centella Asiatica", "Panthenol"],
  },
  {
    id: "prod-larocheposay-22",
    brand: "La Roche-Posay",
    name: "Cicaplast Baume B5+ Soothing Balm",
    badge: "Barrier Care",
    heroHeadline: "Barrier Repair.",
    heroHighlight: "Cicaplast Baume B5+.",
    heroSubtitle:
      "Rich soothing cream with 5% Panthenol and Madecassoside for instant relief.",
    heroImage: "https://images.openbeautyfacts.org/images/products/333/787/581/6847/front_fr.12.400.jpg",
    fallbackPrice: 22.99,
    size: "40ml / 1.35 oz",
    rating: 4.9,
    reviewCount: 42100,
    ingredients: ["Madecassoside", "5% Panthenol", "Shea Butter"],
  },
];

export default function Hero() {
  const { products, addToCart, setSelectedProduct, formatPrice } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [added, setAdded] = useState(false);

  const activeCatalog = FEATURED_SLIDES;

  // Auto-play slideshow every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideDirection(1);
      setCurrentIndex((prev) => (prev + 1) % activeCatalog.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeCatalog.length]);

  const handlePrevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSlideDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + activeCatalog.length) % activeCatalog.length);
  };

  const handleNextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSlideDirection(1);
    setCurrentIndex((prev) => (prev + 1) % activeCatalog.length);
  };

  const activeSlide = activeCatalog[currentIndex] || activeCatalog[0];

  const matchingProduct = useMemo(() => {
    return (
      products.find(
        (p) =>
          p.id === activeSlide.id ||
          (p.brand.toLowerCase() === activeSlide.brand.toLowerCase() &&
            p.name.toLowerCase().includes(activeSlide.name.split(" ")[0].toLowerCase()))
      ) || null
    );
  }, [products, activeSlide]);

  const price = matchingProduct ? matchingProduct.price : activeSlide.fallbackPrice;

  const handleQuickAdd = () => {
    if (matchingProduct) {
      addToCart(matchingProduct, matchingProduct.variants[0], 1, false);
    } else {
      const syn: Product = {
        id: activeSlide.id,
        sku: `AURA-${activeSlide.brand.slice(0, 3).toUpperCase()}-01`,
        brand: activeSlide.brand,
        name: activeSlide.name,
        tagline: activeSlide.badge,
        size: activeSlide.size,
        skinType: "All Skin Types",
        category: "Active Serums & Toners",
        price: activeSlide.fallbackPrice,
        compareAtPrice: activeSlide.fallbackPrice * 1.25,
        supplierCost: activeSlide.fallbackPrice * 0.4,
        rating: activeSlide.rating,
        reviewCount: activeSlide.reviewCount,
        image: activeSlide.heroImage,
        gallery: [activeSlide.heroImage],
        variants: [{ name: "Standard", colorHex: "#002B7F", inStock: true }],
        keyIngredients: activeSlide.ingredients,
        benefits: ["Continuous barrier hydration", "Dermatologist tested"],
      };
      addToCart(syn, syn.variants[0], 1, false);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById("catalog-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="bg-[#0A0F1D] text-white border-b border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text description that strictly moves WITH current slide product */}
          <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col items-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-200 mb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>{activeSlide.badge}</span>
                  <span className="text-slate-400">•</span>
                  <span>{activeSlide.brand}</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {activeSlide.heroHeadline}{" "}
                  <span className="text-cyan-300">{activeSlide.heroHighlight}</span>
                </h1>

                <p className="mt-3 text-xs sm:text-base text-slate-300 leading-relaxed max-w-lg">
                  {activeSlide.heroSubtitle}
                </p>

                {/* Rating & Size single line */}
                <div className="flex items-center gap-4 mt-4 text-xs font-mono text-slate-300">
                  <span className="font-semibold text-amber-400">★ {activeSlide.rating}</span>
                  <span>({activeSlide.reviewCount.toLocaleString()} reviews)</span>
                  <span className="text-slate-500">•</span>
                  <span>{activeSlide.size}</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* CTAs */}
            <div className="flex items-center gap-3 mt-6 sm:mt-8 w-full sm:w-auto">
              <button
                onClick={handleQuickAdd}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • {formatPrice(price)}</span>
                  </>
                )}
              </button>

              <button
                onClick={scrollToCatalog}
                className="px-5 py-3 rounded-xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Shop All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Product Slide that moves in tandem */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center w-full">
            <div className="relative w-full max-w-md bg-slate-900/90 rounded-3xl p-4 sm:p-6 border border-slate-800">
              {/* Slide tabs at top */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl mb-4 overflow-x-auto no-scrollbar">
                {activeCatalog.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => {
                      setSlideDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-bold transition-all whitespace-nowrap cursor-pointer text-center ${
                      currentIndex === idx
                        ? "bg-blue-600 text-white"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {slide.brand}
                  </button>
                ))}
              </div>

              {/* Animated Product Image Viewport */}
              <div className="relative overflow-hidden rounded-2xl bg-white aspect-square max-h-[320px] flex items-center justify-center p-4">
                <AnimatePresence mode="wait" custom={slideDirection}>
                  <motion.div
                    key={activeSlide.id}
                    custom={slideDirection}
                    initial={{ opacity: 0, x: slideDirection * 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -slideDirection * 40 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="w-full h-full flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      if (matchingProduct) setSelectedProduct(matchingProduct);
                    }}
                  >
                    <img
                      src={getSafeImageUrl(activeSlide.heroImage)}
                      alt={activeSlide.name}
                      className="max-h-full max-w-full object-contain p-2 hover:scale-105 transition-transform"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Left/Right Slide Arrows */}
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center cursor-pointer transition-transform"
                  aria-label="Previous product"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center cursor-pointer transition-transform"
                  aria-label="Next product"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Slide Counter Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                {activeCatalog.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSlideDirection(idx > currentIndex ? 1 : -1);
                      setCurrentIndex(idx);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      currentIndex === idx ? "w-5 bg-cyan-400" : "w-1.5 bg-slate-700"
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
