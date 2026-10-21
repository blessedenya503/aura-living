"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  PackageSearch,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Sparkles,
  MapPin,
  Truck,
} from "lucide-react";

interface TrackedOrder {
  id: string;
  createdAt: string;
  customerName: string;
  city: string;
  country: string;
  fulfillmentStatus: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  totalPaidUsd: number;
  items: {
    name: string;
    variantName: string;
    quantity: number;
    bundleTier: number;
    image: string;
  }[];
  trackingTimeline: {
    status: string;
    location: string;
    timestamp: string;
    completed: boolean;
  }[];
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);

  const lookupOrder = async (qToLookup: string) => {
    if (!qToLookup.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/orders/track?q=${encodeURIComponent(qToLookup.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order not found.");
        setOrder(null);
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Unable to reach tracking server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQ.trim()) {
      lookupOrder(initialQ);
    }
  }, [initialQ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    lookupOrder(query);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#002B7F] flex items-center justify-center font-bold text-white text-xs">
            AU
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">
            AURA Health &amp; Skincare
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Search Box */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#002B7F] flex items-center justify-center">
              <PackageSearch className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-950">
                Track Skincare Delivery
              </h1>
              <p className="text-xs text-slate-500">
                Enter your AURA Order ID (e.g. AUR-8921) or DHL / Royal Mail tracking code.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. AUR-8921 or DHL-EUR-99482104"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-mono uppercase text-slate-900 focus:outline-hidden focus:border-[#002B7F]"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-[#002B7F] hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              {loading ? "Searching..." : "Track Package"}
            </button>
          </form>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {/* Quick Sample Queries */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span>Demo sample orders:</span>
            <button
              type="button"
              onClick={() => {
                setQuery("AUR-8921");
                lookupOrder("AUR-8921");
              }}
              className="font-mono text-[#002B7F] hover:underline"
            >
              AUR-8921
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setQuery("AUR-8894");
                lookupOrder("AUR-8894");
              }}
              className="font-mono text-[#002B7F] hover:underline"
            >
              AUR-8894
            </button>
          </div>
        </div>

        {/* Order Result Card */}
        {order && (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Order Status
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h2 className="text-xl font-bold font-mono text-slate-950">
                    #{order.id}
                  </h2>
                  <span className="bg-blue-50 text-[#002B7F] text-xs font-bold px-2.5 py-0.5 rounded-full border border-blue-200">
                    {order.fulfillmentStatus}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs">
                <span className="text-slate-400 block">Courier &amp; Tracking</span>
                <span className="font-semibold text-slate-800">
                  {order.carrier}
                </span>
                <span className="font-mono text-slate-500 block text-[11px]">
                  {order.trackingNumber}
                </span>
              </div>
            </div>

            {/* Destination */}
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Destination: <strong>{order.city}, {order.country}</strong></span>
              </div>
              <span className="font-semibold text-emerald-700">
                {order.estimatedDelivery}
              </span>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Courier Checkpoint Timeline
              </h3>
              <div className="space-y-4">
                {order.trackingTimeline.map((step, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          step.completed
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      {idx < order.trackingTimeline.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 my-1 ${
                            step.completed ? "bg-emerald-300" : "bg-slate-200"
                          }`}
                        />
                      )}
                    </div>
                    <div className="pb-2">
                      <div className="text-xs font-bold text-slate-900">
                        {step.status}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {step.location} • {step.timestamp}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FBFBFC] flex items-center justify-center text-xs text-slate-400">
          Loading tracking interface...
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
