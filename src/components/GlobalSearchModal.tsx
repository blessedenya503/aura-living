"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  X,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Droplets,
  ShieldCheck,
  Check,
  Flame,
  Tag,
  BrainCircuit,
  Loader2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/data/products";
import { Typewriter } from "@/components/ui/typewriter-text";
import { GlitchText } from "@/components/ui/animated-glitch-text";

function TikTokIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.41a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.69a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.28 8.28 0 0 0 4.84 1.55V7.18a4.85 4.85 0 0 1-.93-.49z" />
    </svg>
  );
}

const POPULAR_SEARCH_PILLS = [
  "Beauty of Joseon SPF",
  "COSRX Pimple Patch",
  "CeraVe Moisturizing",
  "The Ordinary Niacinamide",
  "El Niño Bundle",
  "La Roche-Posay Vitamin C",
  "Anua Heartleaf",
  "Snail Mucin",
];

export default function GlobalSearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    products,
    setSelectedProduct,
    addToCart,
    formatPrice,
  } = useCart();

  const [selectedChannel, setSelectedChannel] = useState<string>("All");
  const [addedProductId, setAddedProductId] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Trigger Live Gemini AI consultation on search query change (debounced)
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) {
      setAiInsight(null);
      setIsAiLoading(false);
      return;
    }

    setIsAiLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/ai-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });
        const data = await res.json();
        if (data.success && data.ai) {
          setAiInsight(data.ai);
        }
      } catch (err) {
        console.warn("AI search error:", err);
      } finally {
        setIsAiLoading(false);
      }
    }, 550);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      document.body.style.overflow = "hidden";
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSearchOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Live filtered and ranked products across catalog
  const searchResults = useMemo(() => {
    const rawQ = searchQuery.trim().toLowerCase();
    if (!rawQ) return [];

    // Normalize accents (e.g. niño -> nino)
    const normalize = (str: string) =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const q = normalize(rawQ);
    const words = q.split(/\s+/).filter((w) => w.length > 0);

    const scored = products
      .map((p) => {
        const name = normalize(p.name || "");
        const brand = normalize(p.brand || "");
        const cat = normalize(p.category || "");
        const skinType = normalize(p.skinType || "");
        const sku = normalize(p.sku || "");
        const desc = normalize(p.shortDescription || "");
        const tagline = normalize(p.tagline || "");
        const ingredients = (p.keyIngredients || [])
          .map((i) => normalize(i))
          .join(" ");

        let score = 0;

        // Exact query matches
        if (p.id === "bundle-el-nino" && (q.includes("el nino") || q.includes("bundle") || q.includes("climate"))) {
          score += 400;
        }
        if (brand === q) score += 200;
        if (brand.startsWith(q)) score += 120;
        if (brand.includes(q)) score += 90;
        if (name.includes(q)) score += 100;
        if (sku.includes(q)) score += 80;
        if (cat.includes(q)) score += 60;
        if (ingredients.includes(q)) score += 50;
        if (skinType.includes(q)) score += 30;

        // Word-level scoring
        let matchedWordsCount = 0;
        words.forEach((w) => {
          let wordHit = false;
          if (brand.includes(w)) {
            score += 35;
            wordHit = true;
          }
          if (name.includes(w)) {
            score += 25;
            wordHit = true;
          }
          if (cat.includes(w)) {
            score += 15;
            wordHit = true;
          }
          if (ingredients.includes(w)) {
            score += 15;
            wordHit = true;
          }
          if (skinType.includes(w)) {
            score += 10;
            wordHit = true;
          }
          if (tagline.includes(w) || desc.includes(w)) {
            score += 5;
            wordHit = true;
          }
          if (wordHit) matchedWordsCount++;
        });

        // Boost items matching all query words
        if (words.length > 1 && matchedWordsCount === words.length) {
          score += 100;
        }

        return { product: p, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product);

    return scored.slice(0, 30);
  }, [products, searchQuery, selectedChannel]);

  // Curated trending products shown when search is blank
  const suggestedTrends = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsSearchOpen(false);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product, product.variants[0], 1, false);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1400);
  };

  if (!isSearchOpen) return null;

  return (
    <div
      onClick={() => setIsSearchOpen(false)}
      className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-2xl flex flex-col items-center pt-8 sm:pt-16 md:pt-20 px-3 sm:px-6 pb-8 overflow-y-auto animate-fadeIn transition-all duration-300"
    >
      {/* Central Big Search Console */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto sm:my-0 ring-1 ring-white/10"
      >
        {/* Big Search Input Header */}
        <div className="p-3.5 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center gap-3 relative">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-600/20 text-[#00F2FE] border border-blue-500/30 flex items-center justify-center shrink-0 shadow-md">
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="flex-1 min-w-0 relative flex items-center overflow-hidden">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sunscreen, niacinamide, cerave..."
              className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base font-semibold focus:outline-hidden tracking-tight z-10"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-semibold transition-colors cursor-pointer shrink-0 border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Popular Quick-Filter Pills */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-cyan-400" />
            Trending:
          </span>
          {POPULAR_SEARCH_PILLS.map((pill) => (
            <button
              key={pill}
              onClick={() => {
                setSearchQuery(pill);
                inputRef.current?.focus();
              }}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 transition-all whitespace-nowrap cursor-pointer shrink-0"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Channel Filters when Searching */}
        {searchQuery && (
          <div className="px-4 sm:px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white font-mono">
                {searchResults.length}
              </span>{" "}
              {searchResults.length === 1 ? "result" : "results"} found
            </div>
          </div>
        )}

        {/* Results Container / Suggestions */}
        <div className="max-h-[55vh] overflow-y-auto p-4 sm:p-6 space-y-3">
          {/* Live Gemini AI Consultation Bar */}
          {searchQuery.trim().length >= 3 && (
            <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-cyan-500/30 text-white shadow-lg space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] font-mono">
                    AURA DermAI™ Live Clinical Insight
                  </span>
                </div>
                {isAiLoading && (
                  <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-mono">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Analyzing formula...</span>
                  </div>
                )}
              </div>

              {aiInsight ? (
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-white">
                    {aiInsight.headline}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {aiInsight.dermatologistAdvice}
                  </p>
                  {aiInsight.highlightedIngredients && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {aiInsight.highlightedIngredients.map((ing: string) => (
                        <span key={ing} className="px-2 py-0.5 rounded-md bg-blue-900/60 border border-blue-700/60 text-cyan-200 text-[10px] font-mono font-semibold">
                          ⚡ {ing}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : isAiLoading ? (
                <p className="text-[11px] text-slate-400 italic">
                  Querying medical literature &amp; catalog active ingredients for &ldquo;{searchQuery}&rdquo;...
                </p>
              ) : null}
            </div>
          )}

          {searchQuery.trim() === "" ? (
            /* Blank state: Featured viral picks */
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <TikTokIcon className="w-3.5 h-3.5 text-[#FE2C55]" />
                  <GlitchText
                    text="TRENDING TIKTOK PRODUCTS"
                    as="span"
                    className="min-h-0 p-0 justify-start items-center"
                    containerClassName="inline-block"
                    textClassName="text-[11px] font-extrabold uppercase tracking-wider text-white"
                    colors={{ red: "#FE2C55", green: "#FE2C55", blue: "#FFFFFF" }}
                  />
                  <span className="text-slate-400 font-semibold">• Bestselling Formulas</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  Fast Tracked Delivery
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestedTrends.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelectProduct(prod)}
                    className="p-3 bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center gap-3 transition-all cursor-pointer group"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800 p-1 flex items-center justify-center">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                        {prod.brand}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate">
                        {prod.name}
                      </h4>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xs font-bold font-mono text-white">
                          {formatPrice(prod.price)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {prod.size}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchResults.length === 0 ? (
            /* No exact results state -> Show Winning Products recommendation */
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-xs sm:text-sm">
                      We couldn&apos;t find your product
                    </h4>
                    <p className="text-[11px] text-amber-300/80 mt-0.5">
                      Try these winning clinical &amp; viral formulations instead:
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold self-start sm:self-auto transition-colors cursor-pointer shrink-0"
                >
                  Clear Search
                </button>
              </div>

              {/* Winning Products Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5 font-mono">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    Top Ranked Winning Products
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold font-mono">
                    High Conversion Winners
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {suggestedTrends.slice(0, 4).map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className="p-3 bg-slate-950/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 rounded-2xl flex items-center gap-3 transition-all cursor-pointer group"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800 p-1 flex items-center justify-center">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">
                            {prod.brand}
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono">
                            WINNER
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-200 transition-colors">
                          {prod.name}
                        </h4>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xs font-bold font-mono text-white">
                            {formatPrice(prod.price)}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {prod.size}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shrink-0 shadow-xs"
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Live matching results */
            searchResults.map((product) => {
              const isAdded = addedProductId === product.id;
              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="p-2.5 sm:p-3.5 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-2xl flex items-center justify-between gap-2.5 sm:gap-4 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800 p-0.5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider truncate">
                          {product.brand}
                        </span>
                        {product.isBundle && (
                          <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                            KIT
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {product.name}
                      </h4>

                      <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-slate-400 font-mono">
                        <span>{product.size}</span>
                        {product.keyIngredients?.[0] && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="truncate max-w-[140px] sm:max-w-none text-slate-400">
                              {product.keyIngredients[0]}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Add to Cart button */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs sm:text-base font-bold font-mono text-white">
                        {formatPrice(product.price)}
                      </div>
                      {product.compareAtPrice > product.price && (
                        <div className="text-[9px] sm:text-[10px] text-slate-500 line-through font-mono">
                          {formatPrice(product.compareAtPrice)}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleQuickAdd(e, product)}
                      className={`p-2 sm:p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isAdded
                          ? "bg-emerald-600 text-white"
                          : "bg-blue-600 hover:bg-blue-500 text-white shadow-md active:scale-95"
                      }`}
                      title="Add to Bag"
                    >
                      {isAdded ? (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      ) : (
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Bar */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{products.length} Authentic Formulas Indexed</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-500">
            <span>Press <strong className="text-slate-300">ESC</strong> to exit</span>
            <span>Click item for clinical details</span>
          </div>
        </div>
      </div>
    </div>
  );
}
