"use client";

import React, { useState, useRef } from "react";
import { MoveHorizontal, Clock, Sparkles } from "lucide-react";

interface BeforeAfterSliderProps {
  beforeLabel?: string;
  afterLabel?: string;
  beforeDescription: string;
  afterDescription: string;
  beforeTime?: string;
  afterTime?: string;
}

export default function BeforeAfterSlider({
  beforeLabel = "Standard Manual Knife Prep",
  afterLabel = "PrepPulse Engineered System",
  beforeDescription,
  afterDescription,
  beforeTime = "22 Mins Prep + Cleanup",
  afterTime = "18 Seconds Flat",
}: BeforeAfterSliderProps) {
  const [sliderPos, setSliderPos] = useState(52);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(rect.width - 8, clientX - rect.left));
    setSliderPos(Math.round((x / rect.width) * 100));
  };

  return (
    <div className="space-y-2.5 select-none">
      <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-slate-500">
        <span>Drag Slider to Compare Workflow</span>
        <span className="text-pulse-600 font-bold">{sliderPos}% Split</span>
      </div>

      <div
        ref={containerRef}
        onMouseMove={(e) => {
          if (e.buttons === 1) handleMove(e.clientX);
        }}
        onClick={(e) => handleMove(e.clientX)}
        onTouchMove={(e) => {
          if (e.touches[0]) handleMove(e.touches[0].clientX);
        }}
        className="relative h-48 sm:h-52 rounded-2xl overflow-hidden border border-slate-200 cursor-ew-resize shadow-inner"
      >
        {/* Background Layer: AFTER (PrepPulse Engineered Solution) */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3" /> {afterLabel}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
              <Clock className="w-3.5 h-3.5" /> {afterTime}
            </span>
          </div>

          <div className="max-w-md ml-auto text-right space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Precision Result
            </p>
            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
              {afterDescription}
            </p>
          </div>
        </div>

        {/* Clipped Foreground Layer: BEFORE (Old Manual Way) */}
        <div
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
          className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-100 to-rose-100 text-slate-900 p-5 sm:p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest bg-rose-600 text-white px-2.5 py-1 rounded-full">
              {beforeLabel}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-rose-700">
              <Clock className="w-3.5 h-3.5" /> {beforeTime}
            </span>
          </div>

          <div className="max-w-md space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-rose-700 font-bold">
              Conventional Bottleneck
            </p>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {beforeDescription}
            </p>
          </div>
        </div>

        {/* Draggable Divider Line & Handle */}
        <div
          style={{ left: `${sliderPos}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.6)] pointer-events-none"
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white text-slate-900 shadow-xl border-2 border-pulse-500 flex items-center justify-center">
            <MoveHorizontal className="w-4 h-4 text-pulse-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
