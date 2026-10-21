"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ChevronDown, Check, Globe2, Activity } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CURRENCIES, CurrencyCode } from "@/data/products";

export default function CurrencySelector() {
  const { currency, setCurrency, liveRates, isRatesLive } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeConfig = CURRENCIES[currency] || CURRENCIES.USD;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const currencyList = Object.values(CURRENCIES).filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      c.countryName.toLowerCase().includes(q) ||
      c.label.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button with Circular Flag Badge */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200/90 border border-slate-200/90 text-slate-800 text-xs font-semibold rounded-xl px-2.5 py-1.5 transition-all shadow-2xs hover:shadow-xs cursor-pointer select-none"
        aria-label="Select currency and country"
      >
        {/* Circular Flag Container */}
        <span className="w-5 h-5 rounded-full overflow-hidden border border-slate-300/80 shadow-2xs shrink-0 flex items-center justify-center bg-slate-200">
          <img
            src={`https://flagcdn.com/w40/${activeConfig.countryCode}.png`}
            alt={activeConfig.countryName}
            className="w-full h-full object-cover rounded-full"
            loading="lazy"
          />
        </span>
        <span className="font-mono text-slate-900 font-bold">{activeConfig.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-600" : ""
          }`}
        />
      </button>

      {/* Floating Circular Flag Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Globe2 className="w-3.5 h-3.5 text-[#002B7F]" />
              <span>International Currency</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
              <Activity className="w-2.5 h-2.5 animate-pulse text-emerald-600" />
              <span>{isRatesLive ? "Live API Rates" : "Standard Rates"}</span>
            </div>
          </div>

          {/* Quick Search */}
          <div className="p-2 border-b border-slate-100 bg-white">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or currency..."
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
              autoFocus
            />
          </div>

          {/* Currency List with Circular Flags */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 p-1">
            {currencyList.map((item) => {
              const isSelected = item.code === currency;
              const currentRate = liveRates[item.code] || item.rate;

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setCurrency(item.code);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-xl transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-blue-50/80 text-blue-900 font-bold"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Circular Flag Badge */}
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200/90 shadow-2xs shrink-0 flex items-center justify-center bg-slate-100 ring-1 ring-black/5">
                      <img
                        src={`https://flagcdn.com/w40/${item.countryCode}.png`}
                        alt={item.countryName}
                        className="w-full h-full object-cover rounded-full"
                        loading="lazy"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          {item.code}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium truncate">
                          ({item.symbol})
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block">
                        {item.countryName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400">
                      1 USD ≈ {item.symbol}{currentRate.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#002B7F] stroke-[2.5]" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer with Rate Guarantee */}
          <div className="p-2 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
            <span>Real-time conversion updated hourly</span>
          </div>
        </div>
      )}
    </div>
  );
}
