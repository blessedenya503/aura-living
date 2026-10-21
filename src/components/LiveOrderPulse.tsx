"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, ArrowUpRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

const RECENT_BUYERS = [
  { name: "Marcus V.", city: "Austin, TX", pack: "2-Pack Duo (Saved 15%)", time: "14s ago" },
  { name: "Chloe H.", city: "London, UK", pack: "3-Pack Family Bundle", time: "32s ago" },
  { name: "Devon K.", city: "Toronto, ON", pack: "2-Pack Duo (Saved 15%)", time: "1m ago" },
  { name: "Sophia L.", city: "Seattle, WA", pack: "Standard Pack", time: "2m ago" },
  { name: "Liam B.", city: "Chicago, IL", pack: "3-Pack Family Bundle", time: "3m ago" },
];

export default function LiveOrderPulse() {
  const { products, setSelectedProduct } = useCart();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (dismissed || products.length === 0) return;

    const showTimer = setTimeout(() => {
      setVisible(true);
    }, 4500);

    const cycleInterval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % RECENT_BUYERS.length);
        setVisible(true);
      }, 900);
    }, 11000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(cycleInterval);
    };
  }, [dismissed, products.length]);

  if (dismissed || products.length === 0) return null;

  const buyer = RECENT_BUYERS[index % RECENT_BUYERS.length];
  const product = products[index % products.length];

  return (
    <div className="fixed bottom-5 left-5 z-40 pointer-events-none hidden sm:block">
      <AnimatePresence>
        {visible && product && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 360, damping: 26 }}
            onClick={() => setSelectedProduct(product)}
            className="pointer-events-auto group bg-slate-950/95 backdrop-blur-xl text-white border border-slate-800 rounded-2xl p-3.5 shadow-2xl flex items-center gap-3.5 max-w-xs cursor-pointer hover:border-pulse-500/60 transition-colors"
          >
            <div className="relative shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700"
              />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-slate-950" />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-emerald-400 truncate">
                  {buyer.name} • {buyer.city}
                </span>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {buyer.time}
                </span>
              </div>
              <p className="text-xs font-extrabold text-white truncate mt-0.5 group-hover:text-pulse-500 transition-colors">
                {product.name}
              </p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <span>Ordered {buyer.pack}</span>
                <ArrowUpRight className="w-3 h-3 text-pulse-500" />
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDismissed(true);
              }}
              aria-label="Dismiss notification"
              className="p-1 text-slate-500 hover:text-white self-start"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

