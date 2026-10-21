"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gauge,
  Wind,
  Layers,
  Play,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

type SimMode = "chopper" | "mister" | "vacuum";

export default function InteractiveDemoBench() {
  const [mode, setMode] = useState<SimMode>("chopper");

  // Chopper simulation state
  const [chopGridSize, setChopGridSize] = useState<"6mm" | "12mm" | "Julienne">(
    "6mm"
  );
  const [isChopping, setIsChopping] = useState(false);
  const [chopCount, setChopCount] = useState(1);

  // Mister simulation state
  const [sprayActive, setSprayActive] = useState(false);
  const [sprayAngle, setSprayAngle] = useState<60 | 30>(60);
  const [sprayStrokes, setSprayStrokes] = useState(3);

  // Vacuum simulation state
  const [vacuumKpa, setVacuumKpa] = useState(0);
  const [isSealing, setIsSealing] = useState(false);

  useEffect(() => {
    if (!isSealing) return;
    const interval = setInterval(() => {
      setVacuumKpa((prev) => {
        if (prev <= -65) {
          setIsSealing(false);
          return -65;
        }
        return prev - 5;
      });
    }, 90);
    return () => clearInterval(interval);
  }, [isSealing]);

  const triggerChop = () => {
    setIsChopping(true);
    setChopCount((c) => c + 1);
    setTimeout(() => setIsChopping(false), 550);
  };

  const triggerMist = () => {
    setSprayActive(true);
    setSprayStrokes((s) => s + 1);
    setTimeout(() => setSprayActive(false), 900);
  };

  const startVacuum = () => {
    setVacuumKpa(0);
    setIsSealing(true);
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-950 text-white border-y border-slate-800/80 relative overflow-hidden">
      {/* Subtle Ambient Mesh */}
      <div className="absolute -top-40 left-1/3 w-96 h-96 bg-pulse-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-pulse-500">
              <span className="w-2 h-2 rounded-full bg-pulse-500 animate-ping" />
              <span>Interactive Hardware Physics Lab</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Test the Mechanics Before You Buy
            </h2>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            {[
              {
                id: "chopper" as const,
                label: "01. 420J2 Dicing Matrix",
                icon: Layers,
              },
              {
                id: "mister" as const,
                label: "02. 0.5g Atomized Mist",
                icon: Wind,
              },
              {
                id: "vacuum" as const,
                label: "03. -65 kPa Vacuum Chamber",
                icon: Gauge,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = mode === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMode(tab.id)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors ${
                    active ? "text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="activeLabTab"
                      className="absolute inset-0 bg-pulse-500 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl">
          {/* Left 7 Cols: Animated Visualizer Canvas */}
          <div className="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-2xl p-6 relative min-h-[340px] flex flex-col justify-between overflow-hidden">
            {/* Top HUD Overlay */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider z-10">
              <span>
                TELEMETRY:{" "}
                <strong className="text-emerald-400">60 FPS ACTIVE</strong>
              </span>
              <span>
                {mode === "chopper" && `BLADE INSERT: ${chopGridSize} MATRIX`}
                {mode === "mister" && `DISPERSION CONE: ${sprayAngle}° FAN`}
                {mode === "vacuum" && `CHAMBER PRESSURE: ${vacuumKpa} kPa`}
              </span>
            </div>

            {/* Center Physics Animation */}
            <div className="my-auto py-8 flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                {mode === "chopper" && (
                  <motion.div
                    key="chopper-sim"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md flex flex-col items-center gap-6"
                  >
                    {/* Animated Press Plunger */}
                    <motion.div
                      animate={{
                        y: isChopping ? 44 : 0,
                        scaleY: isChopping ? 0.92 : 1,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 18,
                      }}
                      className="w-56 h-12 rounded-t-2xl bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-2 border-slate-500 flex items-center justify-center shadow-lg"
                    >
                      <span className="font-mono text-[10px] tracking-widest uppercase text-white font-bold">
                        HYDRAULIC PUSHER PLATE
                      </span>
                    </motion.div>

                    {/* 420J2 Stainless Steel Grid Matrix */}
                    <div
                      className={`grid ${
                        chopGridSize === "6mm"
                          ? "grid-cols-8"
                          : chopGridSize === "12mm"
                          ? "grid-cols-5"
                          : "grid-cols-10"
                      } gap-1.5 p-3 bg-slate-900 border-2 border-emerald-500/40 rounded-xl w-64 shadow-inner`}
                    >
                      {Array.from({
                        length:
                          chopGridSize === "6mm"
                            ? 24
                            : chopGridSize === "12mm"
                            ? 15
                            : 20,
                      }).map((_, i) => (
                        <motion.div
                          key={`${chopCount}-${i}`}
                          initial={{ scale: 0.4, opacity: 0.3, y: -12 }}
                          animate={{
                            scale: isChopping ? [1, 1.25, 1] : 1,
                            opacity: 1,
                            y: isChopping ? 18 : 0,
                          }}
                          transition={{
                            delay: i * 0.012,
                            type: "spring",
                            stiffness: 320,
                          }}
                          className="h-4 rounded-sm bg-gradient-to-br from-pulse-500 to-amber-500"
                        />
                      ))}
                    </div>

                    <p className="font-mono text-xs text-slate-400">
                      {chopCount * 24} Uniform Cubes Diced in{" "}
                      <strong className="text-white">
                        {(chopCount * 1.8).toFixed(1)}s
                      </strong>{" "}
                      (vs. {chopCount * 4} mins by knife)
                    </p>
                  </motion.div>
                )}

                {mode === "mister" && (
                  <motion.div
                    key="mister-sim"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md flex flex-col items-center justify-center gap-6"
                  >
                    <div className="relative w-full h-44 flex items-center justify-start pl-8">
                      {/* Nozzle Head */}
                      <div className="w-14 h-24 rounded-xl bg-gradient-to-b from-slate-700 to-slate-900 border border-slate-600 flex flex-col items-center justify-center z-10 shrink-0 shadow-xl">
                        <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                        <span className="font-mono text-[9px] text-slate-300 mt-2">
                          0.5g
                        </span>
                      </div>

                      {/* Atomized Mist Particle Cone */}
                      <div className="relative flex-1 h-full flex items-center">
                        {Array.from({ length: 28 }).map((_, i) => {
                          const spread =
                            sprayAngle === 60
                              ? (i - 14) * 5.2
                              : (i - 14) * 2.4;
                          const dist = 45 + (i % 7) * 32;
                          return (
                            <motion.span
                              key={`${sprayStrokes}-${i}`}
                              initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
                              animate={{
                                x: sprayActive ? dist * 1.35 : dist,
                                y: sprayActive ? spread * 1.25 : spread,
                                opacity: sprayActive ? [0, 1, 0.2] : 0.65,
                                scale: sprayActive ? [0.5, 1.4, 0.8] : 1,
                              }}
                              transition={{
                                duration: 0.75,
                                delay: (i % 6) * 0.03,
                                ease: "easeOut",
                              }}
                              className="absolute left-2 w-2 h-2 rounded-full bg-amber-400/80 blur-[0.5px]"
                            />
                          );
                        })}
                      </div>
                    </div>

                    <p className="font-mono text-xs text-slate-400">
                      Total Oil Dispensed:{" "}
                      <strong className="text-amber-400">
                        {(sprayStrokes * 0.5).toFixed(1)}g
                      </strong>{" "}
                      ({sprayStrokes * 4} kcal vs. 120 kcal pour)
                    </p>
                  </motion.div>
                )}

                {mode === "vacuum" && (
                  <motion.div
                    key="vacuum-sim"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-md flex flex-col items-center gap-6"
                  >
                    <div className="relative w-64 h-36 rounded-2xl border-2 border-emerald-500/40 bg-slate-900/90 flex items-center justify-center overflow-hidden p-4">
                      {/* Simulated Oxygen Molecules being evacuated */}
                      {Array.from({
                        length: Math.max(
                          2,
                          Math.round(((65 + vacuumKpa) / 65) * 24)
                        ),
                      }).map((_, i) => (
                        <motion.span
                          key={i}
                          animate={{
                            x: [
                              (i % 5) * 14 - 28,
                              ((i + 2) % 5) * 10 - 20,
                            ],
                            y: [(i % 4) * 10 - 15, ((i + 1) % 4) * 8 - 12],
                          }}
                          transition={{
                            repeat: Infinity,
                             repeatType: "mirror",
                            duration: 0.9,
                          }}
                          className="w-2 h-2 rounded-full bg-sky-400/60 mx-0.5"
                        />
                      ))}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="font-mono text-2xl font-extrabold text-white bg-slate-950/85 px-4 py-1.5 rounded-xl border border-slate-700">
                          {vacuumKpa} kPa
                        </span>
                      </div>
                    </div>

                    <p className="font-mono text-xs text-slate-400">
                      {vacuumKpa <= -65
                        ? "HERMETIC HEAT-SEAL COMPLETE — 5X SHELF LIFE LOCKED"
                        : "99.8% Oxygen Extraction prevents freezer burn & oxidation"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80 z-10">
              {mode === "chopper" && (
                <>
                  <div className="flex items-center gap-2">
                    {(["6mm", "12mm", "Julienne"] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setChopGridSize(g)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors ${
                          chopGridSize === g
                            ? "bg-white text-slate-950"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {g} Blade
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={triggerChop}
                    className="px-5 py-2.5 rounded-xl bg-pulse-500 hover:bg-pulse-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-pulse-500/25 active:scale-95 transition-transform"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Actuate Chop Stroke</span>
                  </button>
                </>
              )}

              {mode === "mister" && (
                <>
                  <div className="flex items-center gap-2">
                    {([60, 30] as const).map((ang) => (
                      <button
                        key={ang}
                        onClick={() => setSprayAngle(ang)}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-colors ${
                          sprayAngle === ang
                            ? "bg-white text-slate-950"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        {ang}° Nozzle Mode
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={triggerMist}
                    className="px-5 py-2.5 rounded-xl bg-pulse-500 hover:bg-pulse-600 text-white font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-pulse-500/25 active:scale-95 transition-transform"
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>Trigger 0.5g Mist Pulse</span>
                  </button>
                </>
              )}

              {mode === "vacuum" && (
                <>
                  <span className="font-mono text-xs text-emerald-400">
                    Dual Mode: Dry & Moist Foods
                  </span>
                  <button
                    onClick={startVacuum}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>
                      {isSealing
                        ? "Evacuating Air..."
                        : "Run -65 kPa Vacuum Cycle"}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Right 5 Cols: Engineering Breakdown */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-widest text-emerald-400">
                {mode === "chopper" && "// 420J2 JAPANESE STAINLESS METALLURGY"}
                {mode === "mister" && "// HIGH-PRESSURE FLUID ATOMIZATION"}
                {mode === "vacuum" && "// COMMERCIAL -65 KPA SUCTION TURBINE"}
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {mode === "chopper" &&
                  "Zero Crushed Cells. Razor-Clean Cuts in One Stroke."}
                {mode === "mister" &&
                  "Propellant-Free Micro-Mist for Crispy Air-Fryer Crusts."}
                {mode === "vacuum" &&
                  "Lock In Peak Freshness 5x Longer Without Freezer Burn."}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                {mode === "chopper" &&
                  "Cheap plastic choppers bruise tomatoes and bend on raw carrots. Our bevel-honed 420J2 surgical blades slice cleanly through dense root vegetables with 14 lbs of downward leverage."}
                {mode === "mister" &&
                  "Every pull pressurizes a precision 0.3mm vortex chamber, turning thick extra-virgin olive or avocado oil into a weightless 0.5-gram cloud across your air-fryer basket."}
                {mode === "vacuum" &&
                  "Extracts 99.8% of oxygen in 8 seconds flat before fusing a 3mm heavy-duty thermal weld—saving the average household over $1,200/year in spoiled produce and meats."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl">
                <span className="font-mono text-[10px] text-slate-400 uppercase block">
                  PREP TIME SAVED
                </span>
                <span className="text-2xl font-extrabold text-white mt-1 block">
                  {mode === "chopper"
                    ? "82% Faster"
                    : mode === "mister"
                    ? "75% Less Oil"
                    : "5x Shelf Life"}
                </span>
              </div>
              <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl">
                <span className="font-mono text-[10px] text-slate-400 uppercase block">
                  VERIFIED DURABILITY
                </span>
                <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
                  50,000+ Cycles
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
