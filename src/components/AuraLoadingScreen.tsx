"use client";

import React, { useState, useEffect } from "react";

export default function AuraLoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Graceful fadeout when page is fully interactive
    const handleReady = () => {
      setTimeout(() => setLoading(false), 450);
    };

    if (document.readyState === "complete") {
      handleReady();
    } else {
      window.addEventListener("load", handleReady);
      const timer = setTimeout(handleReady, 1200); // safety fallback
      return () => {
        window.removeEventListener("load", handleReady);
        clearTimeout(timer);
      };
    }
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[99999] bg-[#FBFBFC] dark:bg-[#050B18] flex flex-col items-center justify-center transition-opacity duration-500">
      {/* Radiant Pulsing Aura Monogram */}
      <div className="relative flex items-center justify-center">
        {/* Soft Ambient Radiance Pulse */}
        <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-amber-400/25 via-blue-500/20 to-cyan-400/25 blur-2xl animate-pulse" />
        
        {/* Outer Expanding Aura Wave */}
        <div className="absolute w-24 h-24 rounded-3xl bg-blue-500/10 border border-blue-400/20 animate-ping opacity-60 pointer-events-none" />

        {/* Luminous Pulsing Badge (No Spinning) */}
        <div className="relative w-20 h-20 rounded-2xl p-[2px] bg-gradient-to-tr from-[#002B7F] via-blue-600 to-amber-400 shadow-xl shadow-blue-900/20 animate-pulse">
          <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center border border-white/10">
            {/* Center AU Monogram */}
            <span className="font-serif font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-300 select-none">
              AU
            </span>
          </div>
        </div>
      </div>

      {/* AURA Wordmark & Status */}
      <div className="mt-6 text-center flex flex-col items-center animate-pulse">
        <h2 className="text-xl font-light tracking-[0.28em] text-slate-950 dark:text-white uppercase select-none font-serif">
          AURA
        </h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-[0.2em] uppercase select-none">
            Clinical &amp; Barrier Care
          </span>
        </div>
      </div>
    </div>
  );
}
