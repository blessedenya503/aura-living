"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Clock,
  FlaskConical,
  Activity,
  Layers,
} from "lucide-react";

import { DEFAULT_CLINICAL_CASES, type ClinicalStudyCase } from "@/lib/clinical-cases";

export type { ClinicalStudyCase };

export default function ClinicalBeforeAfterShowcase() {
  const [clinicalCases, setClinicalCases] = useState<ClinicalStudyCase[]>(DEFAULT_CLINICAL_CASES);
  const [activeCaseIdx, setActiveCaseIdx] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // 0 to 100%
  const [isPlaying, setIsPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  // Sync clinical study slides dynamically from store database
  useEffect(() => {
    let cancelled = false;
    fetch("/api/clinical-cases", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!cancelled && d && Array.isArray(d.cases) && d.cases.length > 0) {
          setClinicalCases(d.cases);
          setActiveCaseIdx(0);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const CLINICAL_CASES = clinicalCases;
  const currentCase = CLINICAL_CASES[Math.min(activeCaseIdx, CLINICAL_CASES.length - 1)] || DEFAULT_CLINICAL_CASES[0];

  // Auto-play slideshow timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveCaseIdx((prev) => (prev + 1) % CLINICAL_CASES.length);
      setSliderPos(50);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPlaying, CLINICAL_CASES.length]);

  const handleNext = () => {
    setActiveCaseIdx((prev) => (prev + 1) % CLINICAL_CASES.length);
    setSliderPos(50);
  };

  const handlePrev = () => {
    setActiveCaseIdx((prev) => (prev - 1 + CLINICAL_CASES.length) % CLINICAL_CASES.length);
    setSliderPos(50);
  };

  const updateSliderFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(rect.width - 5, clientX - rect.left));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    updateSliderFromClientX(e.clientX);
    setIsPlaying(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingRef.current) {
      updateSliderFromClientX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    if (e.touches[0]) updateSliderFromClientX(e.touches[0].clientX);
    setIsPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDraggingRef.current && e.touches[0]) {
      updateSliderFromClientX(e.touches[0].clientX);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-5 sm:p-8 shadow-xl overflow-hidden mt-8">
      {/* Top Header & Slide Show Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              <FlaskConical className="w-3 h-3" />
              CLINICAL RESULTS SHOWCASE
            </span>
            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Dermatologist Verified
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5">
            {currentCase.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {currentCase.indication} • {currentCase.duration}
          </p>
        </div>

        {/* Slide Controls & Auto-play Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer border border-slate-700"
            title={isPlaying ? "Pause Slideshow" : "Play Slideshow"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 text-cyan-400" />
                <span className="text-[11px]">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span className="text-[11px]">Auto Slide</span>
              </>
            )}
          </button>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
              aria-label="Previous clinical study"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-slate-400 px-2 font-semibold">
              {activeCaseIdx + 1} / {CLINICAL_CASES.length}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
              aria-label="Next clinical study"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Sliding Show Canvas & Split Slider */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Interactive Drag-to-Compare Slider (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-2.5 select-none">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span className="text-rose-400 font-bold uppercase tracking-wider">
              ◀ BEFORE ({currentCase.beforeTitle.split(":")[0]})
            </span>
            <span className="text-slate-500 font-medium">Drag to Compare Results</span>
            <span className="text-emerald-400 font-bold uppercase tracking-wider">
              AFTER ({currentCase.afterTitle.split(":")[0]}) ▶
            </span>
          </div>

          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="relative h-64 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden border border-slate-700/80 cursor-ew-resize shadow-2xl bg-slate-950"
            style={{ touchAction: "none" }}
          >
            {/* Background Layer: AFTER IMAGE */}
            <div className="absolute inset-0 w-full h-full">
              <img
                src={currentCase.afterImg}
                alt={currentCase.afterTitle}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* After Floating Tag */}
              <div className="absolute top-3 right-3 z-10 bg-emerald-950/85 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>AFTER: {currentCase.duration}</span>
              </div>
            </div>

            {/* Foreground Clipped Layer: BEFORE IMAGE */}
            <div
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <img
                src={currentCase.beforeImg}
                alt={currentCase.beforeTitle}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {/* Before Floating Tag */}
              <div className="absolute top-3 left-3 z-10 bg-rose-950/85 text-rose-300 border border-rose-500/40 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-md">
                <span>BEFORE: Day 0</span>
              </div>
            </div>

            {/* Draggable Divider Handle */}
            <div
              style={{ left: `${sliderPos}%` }}
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] pointer-events-none"
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold pointer-events-auto cursor-ew-resize hover:scale-110 transition-transform">
                ⇄
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 pt-1">
            {CLINICAL_CASES.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCaseIdx(idx);
                  setSliderPos(50);
                }}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeCaseIdx === idx ? "w-8 bg-cyan-400" : "w-2 bg-slate-700 hover:bg-slate-600"
                }`}
                aria-label={`Go to case ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Details & Measured Instrumentation Metrics (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Comparison Descriptions */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-rose-400">
                Baseline Condition
              </span>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {currentCase.beforeCondition}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {currentCase.afterTitle}
              </span>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed font-medium">
                {currentCase.afterResult}
              </p>
            </div>
          </div>

          {/* Clinical Instrumentation Metrics */}
          <div className="grid grid-cols-3 gap-2">
            {currentCase.metrics.map((metric, mIdx) => (
              <div
                key={mIdx}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-center flex flex-col justify-between"
              >
                <span className="text-[10px] text-slate-400 font-medium truncate">
                  {metric.label}
                </span>
                <span className="text-lg font-bold font-mono text-cyan-300 my-1">
                  {metric.value}
                </span>
                <span className="text-[9px] text-slate-500 font-mono truncate">
                  {metric.detail}
                </span>
              </div>
            ))}
          </div>

          {/* Dermatologist Verification Quote */}
          {currentCase.dermatologistQuote && (
            <div className="p-3.5 bg-blue-950/30 border border-blue-900/40 rounded-2xl flex items-start gap-2.5">
              <FlaskConical className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-slate-300 leading-relaxed italic">
                &ldquo;{currentCase.dermatologistQuote}&rdquo;
                <span className="block not-italic font-bold text-blue-400 text-[10px] mt-1 font-mono uppercase">
                  — Independent Dermatological Clinical Assessment
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
