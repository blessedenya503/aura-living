"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import CustomerReviewsSection from "@/components/CustomerReviewsSection";
import ShopByConcern, { SkinConcernKey } from "@/components/ShopByConcern";
import CuratedBundlesSection from "@/components/CuratedBundlesSection";
import { PaymentLogosStrip } from "@/components/PaymentLogos";
import { CATEGORIES, ProductCategory, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import {
  Sparkles,
  Droplets,
  ShieldCheck,
  Truck,
  Check,
  Lock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Sun,
  Moon,
  FlaskConical,
  ArrowRight,
  SlidersHorizontal,
  Phone,
} from "lucide-react";

const MINIMAL_FAQS = [
  {
    q: "Are all skincare products 100% genuine and original?",
    a: "Yes. Every COSRX, CeraVe, Anua, and La Roche-Posay item is verified with original manufacturer batch codes and sealed packaging. We do not sell knockoffs or unverified market replicas.",
  },
  {
    q: "How fast is delivery worldwide?",
    a: "We ship worldwide with full tracking. Most orders arrive within 2–5 business days in major regions and 5–10 business days for international destinations, delivered door-to-door by reliable couriers.",
  },
  {
    q: "How do the multi-pack bundle discounts work?",
    a: "Select 2 units to unlock 15% off each, or 3 units to unlock 25% off plus automatic free tracked express delivery at checkout.",
  },
  {
    q: "What is your return & refund policy?",
    a: "Unopened and unused items in their original sealed packaging can be returned within 7 days of delivery. If your order arrives damaged, leaking, or wrong, message us on WhatsApp at +234 703 870 3778 within 48 hours of delivery with clear photos or a short video for a replacement or refund.",
  },
];

export default function HomePage() {
  const {
    products,
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    formatPrice,
    setSelectedProduct,
    isNightRecovery,
    isNightSweeping,
    sweepDirection,
    triggerNightRecoverySweep,
  } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>("All");
  const [selectedConcern, setSelectedConcern] = useState<SkinConcernKey>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const matchCat =
        selectedCategory === "All" || p.category === selectedCategory;

      // Skin Concern filtering - strict, targeted matching
      let matchConcern = true;
      if (selectedConcern !== "all") {
        const n = (p.name || "").toLowerCase();
        const b = (p.brand || "").toLowerCase();
        const cat = (p.category || "").toLowerCase();
        const ing = (p.keyIngredients || []).join(" ").toLowerCase();
        const ben = (p.benefits || []).join(" ").toLowerCase();

        if (selectedConcern === "acne") {
          // Explicit acne treatments: pimple patches, salicylic acid, effaclar, benzoyl, tea tree, blemish spot
          matchConcern =
            n.includes("patch") ||
            n.includes("pimple") ||
            n.includes("blemish") ||
            n.includes("acne") ||
            n.includes("salicylic") ||
            n.includes("effaclar") ||
            n.includes("comedomed") ||
            n.includes("kerato") ||
            n.includes("benzoyl") ||
            n.includes("tea-trica") ||
            ing.includes("salicylic acid") ||
            ing.includes("benzoyl peroxide") ||
            ing.includes("hydrocolloid");
        } else if (selectedConcern === "hydration") {
          // Deep hydration & humectant formulations: snail mucin, hyaluronic acid, dewy skin, water cream, torriden
          matchConcern =
            n.includes("snail") ||
            n.includes("hyaluron") ||
            n.includes("dewy") ||
            n.includes("water cream") ||
            n.includes("hydrat") ||
            n.includes("hydro") ||
            b.includes("torriden") ||
            ing.includes("hyaluronic") ||
            ing.includes("glycerin") ||
            ing.includes("polyglutamic");
        } else if (selectedConcern === "hyperpigmentation") {
          // Dark spots & tone brighteners: Vitamin C, Niacinamide, Alpha Arbutin, Luminous630, Tranexamic Acid
          matchConcern =
            n.includes("vitamin c") ||
            n.includes("luminous630") ||
            n.includes("dark spot") ||
            n.includes("arbutin") ||
            n.includes("brighten") ||
            n.includes("radiant") ||
            n.includes("niacinamide") ||
            ing.includes("vitamin c") ||
            ing.includes("ascorbic") ||
            ing.includes("arbutin") ||
            ing.includes("tranexamic acid");
        } else if (selectedConcern === "barrier") {
          // Skin barrier defense: Cicaplast, CeraVe Ceramides, Centella, Heartleaf, Panthenol
          matchConcern =
            n.includes("cicaplast") ||
            n.includes("ceramide") ||
            n.includes("barrier") ||
            n.includes("cica") ||
            n.includes("heartleaf") ||
            n.includes("centella") ||
            n.includes("baume b5") ||
            b.includes("skin1004") ||
            ing.includes("ceramide") ||
            ing.includes("panthenol") ||
            ing.includes("madecassoside");
        }
      }

      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        p.keyIngredients.some((ing) => ing.toLowerCase().includes(query));
      return matchCat && matchConcern && matchSearch;
    });

    // Smart priority sorting based on the active skin concern & viral trends
    const getProductPriorityScore = (p: Product) => {
      const n = (p.name || "").toLowerCase();
      const b = (p.brand || "").toLowerCase();

      // If user selected ACNE & BLEMISHES: COSRX Pimple Master Patch MUST be #1
      if (selectedConcern === "acne") {
        if (n.includes("cosrx") && n.includes("patch")) return 1000;
        if (n.includes("patch") || n.includes("pimple")) return 950;
        if (n.includes("effaclar") || n.includes("blemish cream")) return 900;
        if (n.includes("salicylic acid cleanser") || n.includes("acne control")) return 850;
        if (n.includes("comedomed") || n.includes("tea-trica")) return 800;
        return 500;
      }

      // If user selected HYDRATION: COSRX Snail Mucin, Tatcha Dewy Skin, Torriden
      if (selectedConcern === "hydration") {
        if (n.includes("snail 96") || (b.includes("cosrx") && n.includes("snail"))) return 1000;
        if (n.includes("dewy skin") || b.includes("tatcha")) return 950;
        if (b.includes("torriden") || n.includes("dive-in")) return 900;
        if (n.includes("hyaluronic") || n.includes("water cream")) return 850;
        return 500;
      }

      // If user selected HYPERPIGMENTATION: La Roche-Posay Pure Vitamin C10, Glow Recipe Dew Drops, Niacinamide
      if (selectedConcern === "hyperpigmentation") {
        if (n.includes("la roche") && n.includes("vitamin c")) return 1050;
        if (n.includes("dew drops") || n.includes("glow recipe")) return 1000;
        if (n.includes("niacinamide 10%")) return 950;
        if (n.includes("luminous630")) return 900;
        if (n.includes("vitamin c 23") || n.includes("vitamin c serum")) return 850;
        return 500;
      }

      // If user selected BARRIER: Cicaplast Baume B5+, Anua Heartleaf, CeraVe Barrier Cream
      if (selectedConcern === "barrier") {
        if (n.includes("cicaplast")) return 1000;
        if (n.includes("heartleaf 77%") || b.includes("anua")) return 950;
        if (n.includes("cerave") && (n.includes("moisturizing cream") || n.includes("barrier"))) return 900;
        if (b.includes("skin1004") && n.includes("centella")) return 850;
        return 500;
      }

      // Default All Concerns: Glow Recipe, Tatcha Skin Dew, Anua, COSRX, La Roche-Posay
      if (n.includes("glow recipe") || b.includes("glow recipe")) return 100;
      if (n.includes("tatcha") || b.includes("tatcha")) return 95;
      if (n.includes("dewy skin") || n.includes("dew drops") || n.includes("plum plump")) return 90;
      if (n.includes("heartleaf") || b.includes("anua")) return 85;
      if (n.includes("patch") || n.includes("snail 96") || b.includes("cosrx")) return 80;
      if (n.includes("cicaplast") || b.includes("la roche-posay")) return 78;
      if (n.includes("joseon") || b.includes("beauty of joseon")) return 75;
      if (b.includes("drunk elephant")) return 70;
      if (n.includes("aquaphor") || b.includes("eucerin")) return 65;
      if (b.includes("cerave")) return 60;
      if (b.includes("bioderma")) return 55;
      return 0;
    };

    if (sortBy === "price-asc") {
      list.sort((a, b) => {
        const scoreA = getProductPriorityScore(a);
        const scoreB = getProductPriorityScore(b);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return a.price - b.price;
      });
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => {
        const scoreA = getProductPriorityScore(a);
        const scoreB = getProductPriorityScore(b);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return b.price - a.price;
      });
    } else if (sortBy === "rating") {
      list.sort((a, b) => {
        const scoreA = getProductPriorityScore(a);
        const scoreB = getProductPriorityScore(b);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return b.rating - a.rating;
      });
    } else {
      list.sort((a, b) => {
        const scoreA = getProductPriorityScore(a);
        const scoreB = getProductPriorityScore(b);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return b.rating - a.rating;
      });
    }
    return list;
  }, [products, selectedCategory, selectedConcern, searchQuery, sortBy]);

  // Skin concern counts
  const concernCounts = useMemo(() => {
    return {
      all: products.length,
      acne: products.filter((p) => {
        const n = (p.name || "").toLowerCase();
        const ing = (p.keyIngredients || []).join(" ").toLowerCase();
        return (
          n.includes("patch") ||
          n.includes("pimple") ||
          n.includes("blemish") ||
          n.includes("acne") ||
          n.includes("salicylic") ||
          n.includes("effaclar") ||
          n.includes("comedomed") ||
          n.includes("kerato") ||
          n.includes("benzoyl") ||
          n.includes("tea-trica") ||
          ing.includes("salicylic acid") ||
          ing.includes("benzoyl peroxide") ||
          ing.includes("hydrocolloid")
        );
      }).length,
      hydration: products.filter((p) => {
        const n = (p.name || "").toLowerCase();
        const b = (p.brand || "").toLowerCase();
        const ing = (p.keyIngredients || []).join(" ").toLowerCase();
        return (
          n.includes("snail") ||
          n.includes("hyaluron") ||
          n.includes("dewy") ||
          n.includes("water cream") ||
          n.includes("hydrat") ||
          b.includes("torriden") ||
          ing.includes("hyaluronic")
        );
      }).length,
      hyperpigmentation: products.filter((p) => {
        const n = (p.name || "").toLowerCase();
        const ing = (p.keyIngredients || []).join(" ").toLowerCase();
        return (
          n.includes("vitamin c") ||
          n.includes("luminous630") ||
          n.includes("dark spot") ||
          n.includes("arbutin") ||
          n.includes("brighten") ||
          n.includes("niacinamide") ||
          ing.includes("vitamin c") ||
          ing.includes("arbutin")
        );
      }).length,
      barrier: products.filter((p) => {
        const n = (p.name || "").toLowerCase();
        const b = (p.brand || "").toLowerCase();
        const ing = (p.keyIngredients || []).join(" ").toLowerCase();
        return (
          n.includes("cicaplast") ||
          n.includes("ceramide") ||
          n.includes("barrier") ||
          n.includes("heartleaf") ||
          n.includes("centella") ||
          b.includes("skin1004") ||
          ing.includes("ceramide") ||
          ing.includes("panthenol")
        );
      }).length,
    };
  }, [products]);

  // Featured El Niño Bundle
  const elNinoBundle = useMemo(() => {
    return products.find((p) => p.id === "bundle-el-nino");
  }, [products]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const handleCategoryChange = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-[#002B7F] transition-colors duration-700 ease-in-out relative ${
        isNightRecovery
          ? "night-recovery-active bg-[#050B18] text-white"
          : "bg-[#FBFBFC] text-slate-900"
      }`}
    >
      {/* Sweeping Dark Blue Gradient Wave when clicking Night Recovery / Dawn Wave on Morning Shield */}
      {isNightSweeping && (
        <div
          className={
            sweepDirection === "to-night"
              ? "night-recovery-wave"
              : "dawn-recovery-wave"
          }
          key={sweepDirection}
        />
      )}

      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Curated Skincare Bundles: El Niño Skincare Bundle Showcase */}
        {elNinoBundle && <CuratedBundlesSection bundleProduct={elNinoBundle} />}

        {/* Shop by Skin Concern Section */}
        <ShopByConcern
          selectedConcern={selectedConcern}
          onSelectConcern={(c) => {
            setSelectedConcern(c);
            setCurrentPage(1);
          }}
          counts={concernCounts}
        />

        {/* Main Products Catalog Section */}
        <section
          id="catalog-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        >
          {/* Clean Collection Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Skincare Collection
            </h2>
            <div className="w-10 h-0.5 bg-[#002B7F] mx-auto mt-1.5 mb-1 rounded-full" />
            <p className="text-xs text-slate-500">
              Authentic, dermatologist-tested formulas.
            </p>
          </div>

          {/* Section Controls & Search Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
            <div className="text-xs font-bold text-slate-800">
              {products.length} Authenticated Formulas
            </div>

            {/* Quick Search Input & Sort */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    handleSearchChange(e.target.value);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onClick={() => setIsSearchOpen(true)}
                  placeholder="Search serums, SPF, ceramides..."
                  className="w-full pl-8 pr-3 py-1.5 text-[11px] bg-white border border-slate-200 focus:border-[#002B7F] rounded-xl text-slate-800 placeholder:text-slate-400 outline-hidden transition-all"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold py-1.5 px-2.5 rounded-xl focus:outline-hidden cursor-pointer"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Filter Strip */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-3">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? products.length
                  : products.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? "bg-[#002B7F] text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      selectedCategory === cat
                        ? "bg-blue-800 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Product Results Counter & Page Size */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-2 border-b border-slate-100">
            <div>
              <span className="font-bold text-slate-900 font-mono">
                {filteredProducts.length}
              </span>{" "}
              Products
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-slate-400">View:</span>
              {[24, 48, 96].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold cursor-pointer ${
                    pageSize === size
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
              <Droplets className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">
                No matching creams found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Try selecting &ldquo;All&rdquo; or clearing your search query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedConcern("all");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="mt-4 px-4 py-2 bg-[#002B7F] text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Sleek Pagination Bar */}
              {totalPages > 1 && (
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="text-xs text-slate-500">
                    Page <span className="font-bold text-slate-900 font-mono">{currentPage}</span> of{" "}
                    <span className="font-bold text-slate-900 font-mono">{totalPages}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 600, behavior: "smooth" });
                      }}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>

                    {/* Compact page buttons */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 5 && currentPage > 3) {
                        pageNum = Math.min(totalPages - 4 + i, currentPage - 2 + i);
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => {
                            setCurrentPage(pageNum);
                            window.scrollTo({ top: 600, behavior: "smooth" });
                          }}
                          className={`w-8 h-8 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                            currentPage === pageNum
                              ? "bg-[#002B7F] text-white shadow-xs"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => {
                        setCurrentPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 600, behavior: "smooth" });
                      }}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Customer Reviews */}
        <CustomerReviewsSection />
      </main>

      {/* Modern Minimalist Footer */}
      <footer className="bg-slate-950 text-white border-t border-slate-800 pt-10 pb-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#002B7F] flex items-center justify-center font-bold text-white text-xs">
                AU
              </div>
              <span className="font-bold text-white tracking-tight text-sm">
                AURA<span className="text-blue-400">.STORE</span>
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <PaymentLogosStrip className="flex items-center gap-2" />
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-400 font-medium">
                <Link href="/about" className="hover:text-white transition-colors">
                  About AURA SKIN
                </Link>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Order
                </Link>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery
                </Link>
                <Link href="/returns" className="hover:text-white transition-colors">
                  Returns &amp; Refunds
                </Link>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#catalog-section" className="hover:text-white transition-colors">
                  Shop Verified Catalog
                </Link>
                {/* Contact & WhatsApp at the bottom with international formatting */}
                <a
                  href="https://wa.me/2347038703778?text=Hello%20AURA%2C%20I%20have%20an%20inquiry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+23407038703778</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} AURA.STORE. Authentic Dermatological Skincare.</p>
            <p>21st.dev Component Architecture • SSL 256-Bit Encrypted</p>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <GlobalSearchModal />
    </div>
  );
}
