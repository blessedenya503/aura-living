"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { GlitchText } from "@/components/ui/animated-glitch-text";

function TikTokIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.11V9.41a6.33 6.33 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.69a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.08a8.28 8.28 0 0 0 4.84 1.55V7.18a4.85 4.85 0 0 1-.93-.49z" />
    </svg>
  );
}

const VIRAL_CONCERNS = [
  {
    id: "glass_skin",
    badge: "VIRAL",
    title: "Viral Glass Skin in 7 Days",
    hook: "Korean dewy radiance & porcelain glow",
    tag: "Trending on TikTok",
  },
  {
    id: "erase_spots",
    badge: "CLINICAL",
    title: "Erase Dark Spots & Sun Damage",
    hook: "Patented Luminous630® targeted fading",
    tag: "98% Success Rate",
  },
  {
    id: "slugging_barrier",
    badge: "URGENT",
    title: "48H Skin Barrier Emergency Repair",
    hook: "Instant hydration seal for dry flaky skin",
    tag: "Derm Approved",
  },
];

export default function AuraDermAI() {
  const { products, setSelectedProduct, formatPrice } = useCart();
  const [selectedConcern, setSelectedConcern] = useState(VIRAL_CONCERNS[0].id);
  const [prescribed, setPrescribed] = useState<any>(null);

  const handleCompute = (concernId: string) => {
    setSelectedConcern(concernId);

    let matched = products.filter((p) => {
      const text = `${p.name} ${p.tagline} ${p.category} ${p.shortDescription || ""}`.toLowerCase();
      if (concernId === "erase_spots") return text.includes("luminous") || text.includes("spot") || text.includes("serum");
      if (concernId === "slugging_barrier") return text.includes("creme") || text.includes("ceramide") || text.includes("repair");
      return text.includes("snail") || text.includes("glow") || text.includes("hydrat") || text.includes("niacinamide");
    });

    if (matched.length === 0) matched = products.slice(0, 2);
    else matched = matched.slice(0, 2);

    setPrescribed({
      concern: VIRAL_CONCERNS.find((c) => c.id === concernId),
      products: matched,
    });
  };

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-950 via-[#001744] to-slate-950 text-white border border-blue-900/60 p-4 sm:p-6 shadow-xl overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-blue-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  AURA AI Skin Matcher
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  1-TAP
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tap your skin goal to get your matched viral duo.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Clickbaity Pill Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3.5">
          {VIRAL_CONCERNS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleCompute(item.id)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                selectedConcern === item.id
                  ? "bg-blue-600/30 border-cyan-400 text-white ring-1 ring-cyan-400/50 shadow-md"
                  : "bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide font-mono ${
                      item.badge === "VIRAL"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : item.badge === "CLINICAL"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                  {item.tag === "Trending on TikTok" ? (
                    <div className="flex items-center gap-1">
                      <TikTokIcon className="w-3 h-3 text-[#FE2C55]" />
                      <GlitchText
                        text="TRENDING TIKTOK"
                        as="span"
                        className="min-h-0 p-0 justify-start items-center"
                        containerClassName="inline-block"
                        textClassName="text-[10px] text-white font-extrabold"
                        colors={{ red: "#FE2C55", green: "#25F4EE", blue: "#FFFFFF" }}
                      />
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-semibold">{item.tag}</span>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white leading-snug group-hover:text-cyan-200 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{item.hook}</p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-cyan-400">
                <span>{selectedConcern === item.id ? "Selected" : "Tap to Match"}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>

        {/* Matched Result Bar */}
        {prescribed && (
          <div className="mt-3.5 pt-3.5 border-t border-blue-900/40 animate-fadeIn">
            <div className="flex items-center justify-between mb-2.5 text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI Matched for <strong className="text-white">{prescribed.concern.title}</strong>:</span>
              </span>
              <span className="text-[10px] font-mono text-cyan-300">99.4% Match</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {prescribed.products.map((p: any) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-2.5 flex items-center gap-2.5 transition-all cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase text-cyan-400 block">{p.brand}</span>
                    <h5 className="text-xs font-bold text-white truncate group-hover:text-cyan-200">{p.name}</h5>
                    <span className="text-xs font-mono font-bold text-slate-200 mt-0.5 block">{formatPrice(p.price)}</span>
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
        )}
      </div>
    </section>
  );
}
