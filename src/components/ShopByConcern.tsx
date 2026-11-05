"use client";

import React from "react";
import { Droplets, Sparkles, ShieldCheck, Flame, ArrowRight } from "lucide-react";

export type SkinConcernKey = "all" | "acne" | "hydration" | "hyperpigmentation" | "barrier";

interface ConcernOption {
  key: SkinConcernKey;
  label: string;
  tagline: string;
  icon: React.ElementType;
  badge: string;
}

const CONCERNS: ConcernOption[] = [
  {
    key: "acne",
    label: "Acne & Blemishes",
    tagline: "Salicylic acid, BHA & purifying pore solutions",
    icon: Flame,
    badge: "Clarifying",
  },
  {
    key: "hydration",
    label: "Hydration & Moisture",
    tagline: "Hyaluronic acid, glycerin & deep dew drops",
    icon: Droplets,
    badge: "Plump & Dewy",
  },
  {
    key: "hyperpigmentation",
    label: "Hyperpigmentation",
    tagline: "Vitamin C, niacinamide & dark spot correctors",
    icon: Sparkles,
    badge: "Brightening",
  },
  {
    key: "barrier",
    label: "Skin Barrier Care",
    tagline: "Ceramides, centella, cica & soothing relief",
    icon: ShieldCheck,
    badge: "Repair & Calming",
  },
];

interface ShopByConcernProps {
  selectedConcern: SkinConcernKey;
  onSelectConcern: (concern: SkinConcernKey) => void;
  counts: Record<SkinConcernKey, number>;
}

export default function ShopByConcern({
  selectedConcern,
  onSelectConcern,
  counts,
}: ShopByConcernProps) {
  return (
    <section className="py-10 sm:py-14 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#002B7F] mb-1.5">
              <span>Targeted Clinical Solutions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Shop by Skin Concern
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">
              Find formulas specifically clinically vetted for your skin priority.
            </p>
          </div>

          {selectedConcern !== "all" && (
            <button
              onClick={() => onSelectConcern("all")}
              className="text-xs font-bold text-[#002B7F] hover:underline self-start sm:self-end flex items-center gap-1 cursor-pointer"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 4 Concern Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CONCERNS.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedConcern === c.key;
            const count = counts[c.key] || 0;

            return (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  onSelectConcern(isSelected ? "all" : c.key);
                  const el = document.getElementById("catalog-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`p-4 sm:p-5 rounded-2xl border text-left transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#002B7F] border-[#002B7F] text-white shadow-lg ring-2 ring-blue-400/40"
                    : "bg-slate-50/60 hover:bg-white border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-2xs hover:shadow-md"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? "bg-white/15 text-white"
                          : "bg-blue-50 text-[#002B7F] group-hover:bg-[#002B7F] group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-200/70 text-slate-700"
                      }`}
                    >
                      {count} items
                    </span>
                  </div>

                  <h3
                    className={`text-sm sm:text-base font-extrabold tracking-tight ${
                      isSelected ? "text-white" : "text-slate-950"
                    }`}
                  >
                    {c.label}
                  </h3>
                  <p
                    className={`text-[11px] sm:text-xs mt-1 line-clamp-2 leading-relaxed ${
                      isSelected ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {c.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/50 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isSelected ? "text-blue-200" : "text-[#002B7F]"
                    }`}
                  >
                    {isSelected ? "Filter Active" : "Explore"}
                  </span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-1 ${
                      isSelected ? "text-white" : "text-slate-400 group-hover:text-[#002B7F]"
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
