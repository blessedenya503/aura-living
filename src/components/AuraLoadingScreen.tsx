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
      {/* Glowing Aura Ring with Pulsing Logo */}
      <div className="relative flex items-center justify-center">
        {/* Outer Radiant Glow */}
        <div className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#002B7F] via-blue-500 to-cyan-400 opacity-40 blur-xl animate-pulse" />
        
        {/* Spinning Gradient Orbit */}
        <div className="relative w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-[#002B7F] via-blue-600 to-cyan-400 animate-spin">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center shadow-inner">
            {/* Center AU letters with luminous gradient */}
            <span className="font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-amber-300 animate-pulse select-none">
              AU
            </span>
          </div>
        </div>
      </div>

      {/* AURA Wordmark & Status */}
      <div className="mt-5 text-center flex flex-col items-center">
        <h2 className="text-xl font-black tracking-widest text-slate-950 dark:text-white uppercase select-none">
          AURA
        </h2>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
          <span className="text-xs font-semibold text-slate-400 tracking-wider font-mono select-none">
            Loading Skincare Experience...
          </span>
        </div>
      </div>
    </div>
  );
}
