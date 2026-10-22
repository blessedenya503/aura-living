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
import ClinicalBeforeAfterShowcase from "@/components/ClinicalBeforeAfterShowcase";
import AuraDermAI from "@/components/AuraDermAI";
import { PaymentLogosStrip } from "@/components/PaymentLogos";
import { CATEGORIES, ProductCategory, Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import {
  Sparkles,
  Droplets,
  ShieldCheck,
  Truck,
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
} from "lucide-react";

const MINIMAL_FAQS = [
  {
    q: "Are all skincare products 100% genuine and fresh-batch?",
    a: "Yes. Every NIVEA, CeraVe, and La Roche-Posay formula is sourced directly from authenticated European & global pharmaceutical supply chains, stored in climate-controlled hubs.",
  },
  {
    q: "How do the multi-pack bundle discounts work?",
    a: "Select 2 units to unlock 15% off each, or 3 units to unlock 25% off plus automatic free tracked express shipping at checkout.",
  },
  {
    q: "What is your satisfaction guarantee?",
    a: "If any product doesn't suit your skin barrier within 30 days of arrival, contact our concierge desk for an exchange or full refund.",
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
  const [selectedBrand, setSelectedBrand] = useState<string>("All Brands");
  const [selectedSupplier, setSelectedSupplier] = useState<string>("All Channels");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [routineTab, setRoutineTab] = useState<"am" | "pm">("am");

  // Brands list
  const availableBrands = useMemo(() => {
    let sourceProducts = products;
    if (selectedSupplier === "Amazon Prime Dropship") {
      sourceProducts = products.filter((p) => p.supplierSource === "Amazon Prime Dropship");
    } else if (selectedSupplier === "Alibaba Trade Assurance Dropship") {
      sourceProducts = products.filter((p) => p.supplierSource === "Alibaba Trade Assurance Dropship");
    }
    const brands = Array.from(new Set(sourceProducts.map((p) => p.brand).filter(Boolean)));
    return ["All Brands", ...brands];
  }, [products, selectedSupplier]);

  // Counts
  const amazonCount = useMemo(
    () => products.filter((p) => p.supplierSource === "Amazon Prime Dropship").length,
    [products]
  );
  const alibabaCount = useMemo(
    () => products.filter((p) => p.supplierSource === "Alibaba Trade Assurance Dropship").length,
    [products]
  );

  // Filter & Sort products
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      const matchCat =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchBrand =
        selectedBrand === "All Brands" || p.brand === selectedBrand;
      const matchSupplier =
        selectedSupplier === "All Channels" || p.supplierSource === selectedSupplier;
      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        (p.sku && p.sku.toLowerCase().includes(query)) ||
        p.keyIngredients.some((ing) => ing.toLowerCase().includes(query));
      return matchCat && matchBrand && matchSupplier && matchSearch;
    });

    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [products, selectedCategory, selectedBrand, selectedSupplier, searchQuery, sortBy]);

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

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setCurrentPage(1);
  };

  const handleSupplierChange = (source: string) => {
    setSelectedSupplier(source);
    setSelectedBrand("All Brands");
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  // Curated 3-step routine products
  const amRoutine = useMemo(() => {
    return [
      products.find((p) => p.id === "prod-the-ordinary-niacinamide"),
      products.find((p) => p.id === "prod-nivea-soft"),
      products.find((p) => p.id === "prod-nivea-q10-power"),
    ].filter(Boolean) as Product[];
  }, [products]);

  const pmRoutine = useMemo(() => {
    return [
      products.find((p) => p.id === "prod-paulas-choice-bha"),
      products.find((p) => p.id === "prod-nivea-luminous630"),
      products.find((p) => p.id === "prod-nivea-creme-classic") ||
        products.find((p) => p.id === "prod-laroche-posay-cicaplast"),
    ].filter(Boolean) as Product[];
  }, [products]);

  const activeRoutineProducts = routineTab === "am" ? amRoutine : pmRoutine;

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

        {/* 21st.dev Inspired Minimalist Routine Bento */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="bg-linear-to-b from-blue-50/50 to-slate-50 border border-blue-100/80 rounded-3xl p-6 sm:p-10 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#002B7F] flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5" />
                  Clinical Regimen
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
                  Targeted Skin Protocol
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Dermatologist-sequenced formulas for daily barrier resilience.
                </p>
              </div>

              {/* Routine Switcher */}
              <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 self-start sm:self-auto shadow-xs">
                <button
                  onClick={() => {
                    setRoutineTab("am");
                    triggerNightRecoverySweep(false);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    routineTab === "am"
                      ? "bg-[#002B7F] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span>Morning Shield</span>
                </button>
                <button
                  onClick={() => {
                    setRoutineTab("pm");
                    triggerNightRecoverySweep(true);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    routineTab === "pm"
                      ? "bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-cyan-200 ring-2 ring-cyan-400/50 shadow-lg shadow-blue-950/60"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                  <span>Night Recovery</span>
                </button>
              </div>
            </div>

            {/* 3 Step Protocol Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {activeRoutineProducts.map((prod, idx) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 text-xs">
                      <span className="font-mono font-bold text-[#002B7F] bg-blue-50 px-2 py-0.5 rounded-md">
                        Step 0{idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {idx === 0
                          ? "Active Prep"
                          : idx === 1
                          ? "Hydration"
                          : "Barrier Lock"}
                      </span>
                    </div>
                    <div className="relative w-full h-40 rounded-xl overflow-hidden bg-white mb-3 border border-slate-200 p-2 flex items-center justify-center">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      {prod.brand}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 min-h-[2.5rem] leading-snug">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1 min-h-[1.25rem]">
                      {prod.tagline}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {formatPrice(prod.price)}
                    </span>
                    <button
                      onClick={() => setSelectedProduct(prod)}
                      className="text-xs font-semibold text-[#002B7F] hover:underline cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clinical Before & After Sliding Show */}
            <ClinicalBeforeAfterShowcase />
          </div>
        </section>

        {/* AURA DermAI Diagnostic Studio */}
        <AuraDermAI />

        {/* Main Skincare Catalog Section */}
        <section
          id="catalog-section"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#002B7F]" />
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
                  {Math.floor(products.length / 50) * 50}+ Verified Dropship Creams &amp; Skincare
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Direct pharmaceutical &amp; verified wholesale dropship catalog from Amazon Prime &amp; Alibaba Trade Assurance.
              </p>
            </div>

            {/* Quick Search Input & Sort */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72 group">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-[#002B7F] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    handleSearchChange(e.target.value);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onClick={() => setIsSearchOpen(true)}
                  placeholder="Search creams, brands, active..."
                  className="w-full pl-9 pr-12 py-2 text-xs bg-white hover:bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#002B7F] rounded-xl text-slate-800 placeholder:text-slate-400 shadow-2xs outline-hidden transition-all"
                />
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-200 rounded text-slate-400 font-bold">
                    ⌘K
                  </kbd>
                </div>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-slate-200 text-slate-700 text-xs font-semibold py-2 px-3 rounded-xl focus:outline-hidden shadow-2xs cursor-pointer"
              >
                <option value="featured">Featured Dropship</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Dropship Channel Selector */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
            <button
              onClick={() => handleSupplierChange("All Channels")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selectedSupplier === "All Channels"
                  ? "bg-slate-950 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <span>All Dropship Sources</span>
              <span className="text-[10px] bg-slate-800 text-slate-200 px-1.5 py-0.2 rounded-full font-mono">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => handleSupplierChange("Amazon Prime Dropship")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selectedSupplier === "Amazon Prime Dropship"
                  ? "bg-amber-500 text-slate-950 font-extrabold shadow-xs ring-1 ring-amber-600"
                  : "bg-amber-50/70 border border-amber-200 text-amber-900 hover:bg-amber-100"
              }`}
            >
              <span>Amazon Prime Dropship</span>
              <span className="text-[10px] bg-amber-600/20 text-amber-950 px-1.5 py-0.2 rounded-full font-mono">
                {amazonCount}
              </span>
            </button>

            <button
              onClick={() => handleSupplierChange("Alibaba Trade Assurance Dropship")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                selectedSupplier === "Alibaba Trade Assurance Dropship"
                  ? "bg-orange-600 text-white font-extrabold shadow-xs ring-1 ring-orange-400"
                  : "bg-orange-50/70 border border-orange-200 text-orange-900 hover:bg-orange-100"
              }`}
            >
              <span>Alibaba Trade Assurance</span>
              <span className="text-[10px] bg-orange-600/20 text-orange-950 px-1.5 py-0.2 rounded-full font-mono">
                {alibabaCount}
              </span>
            </button>
          </div>

          {/* Category Filter Strip */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-3">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? (selectedSupplier === "All Channels"
                      ? products.length
                      : products.filter((p) => p.supplierSource === selectedSupplier).length)
                  : (selectedSupplier === "All Channels"
                      ? products.filter((p) => p.category === cat).length
                      : products.filter(
                          (p) => p.category === cat && p.supplierSource === selectedSupplier
                        ).length);
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
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

          {/* Brand Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-6">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
              Brand:
            </span>
            {availableBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => handleBrandChange(brand)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedBrand === brand
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Product Results Counter & Page Size */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4 pb-2 border-b border-slate-100">
            <div>
              Showing{" "}
              <span className="font-bold text-slate-900 font-mono">
                {filteredProducts.length === 0
                  ? 0
                  : (currentPage - 1) * pageSize + 1}
                –{Math.min(currentPage * pageSize, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-900 font-mono">
                {filteredProducts.length.toLocaleString()}
              </span>{" "}
              verified dropship products
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-slate-400">Items per page:</span>
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
                Try selecting &ldquo;All Dropship Sources&rdquo; or clearing your ingredient query.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedBrand("All Brands");
                  setSelectedSupplier("All Channels");
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

        {/* Minimalist Trust Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#002B7F] flex items-center justify-center mb-3">
                <Droplets className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                48H Deep Moisture
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Clinically tested continuous barrier hydration.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Derm Approved
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Tolerant on sensitive, irritated, or dry barriers.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Pure Online Data
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Authentic formulations from official NIVEA labs.
              </p>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-3">
                <Truck className="w-4 h-4" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Express Courier
              </h4>
              <p className="text-[11px] text-slate-500 mt-1">
                Direct tracked dispatch to Europe, UK &amp; North America.
              </p>
            </div>
          </div>
        </section>

        {/* Minimalist Collapsible FAQ (No Wall of Text) */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#002B7F]">
              Need Clarity?
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 mt-1">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-2.5">
            {MINIMAL_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-5 py-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:text-[#002B7F] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180 text-[#002B7F]" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>
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
                AURA Health &amp; Skincare
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <PaymentLogosStrip className="flex items-center gap-2" />
              <div className="flex items-center gap-6 text-slate-400 font-medium">
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Order
                </Link>
                <Link href="#catalog-section" className="hover:text-white transition-colors">
                  Shop Verified Catalog
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} AURA Health &amp; Living. Real Skincare Data.</p>
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
