"use client";

import { useState } from "react";
import { HOSTING_PLANS } from "@/data/hostingData";
import { Check, Zap, Sparkles, Server, Shield, ArrowRight, Gauge, Globe2 } from "lucide-react";
import Link from "next/link";

type Currency = "USD" | "EUR" | "GBP";

const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  USD: { symbol: "$", rate: 1.0 },
  EUR: { symbol: "€", rate: 0.92 },
  GBP: { symbol: "£", rate: 0.79 },
};

export function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly" | "fourYear">("fourYear");
  const [currency, setCurrency] = useState<Currency>("USD");

  const { symbol, rate } = CURRENCY_RATES[currency];

  return (
    <section id="plans" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#6c5ce7]/10 via-[#00cec9]/5 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#a29bfe] mb-3 backdrop-blur-md">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>AMD EPYC 9654 • 10Gbps NVMe Gen4 Storage</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Enterprise Cloud Architecture. <br />
          <span className="gradient-text">Startup-Friendly Pricing.</span>
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
          Scale effortlessly with LiteSpeed caching, instant container isolation, and 24/7 priority support.
        </p>

        {/* Term Period Selector & Currency Switcher Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <div className="inline-flex p-1.5 rounded-2xl glass-panel shadow-2xl">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                billingPeriod === "monthly"
                  ? "bg-[#252840] text-white shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                billingPeriod === "yearly"
                  ? "bg-[#252840] text-white shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>12 Months</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">
                SAVE 40%
              </span>
            </button>
            <button
              onClick={() => setBillingPeriod("fourYear")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                billingPeriod === "fourYear"
                  ? "bg-gradient-to-r from-[#6c5ce7] to-[#5844e3] text-white shadow-lg shadow-[#6c5ce7]/30"
                  : "text-zinc-300 hover:text-white"
              }`}
            >
              <span>48 Months</span>
              <span className="text-[10px] bg-white text-[#6c5ce7] font-black px-1.5 py-0.5 rounded">
                BEST VALUE (-75%)
              </span>
            </button>
          </div>

          {/* Currency Pill */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-400">
            {(["USD", "EUR", "GBP"] as Currency[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  currency === c
                    ? "bg-[#6c5ce7] text-white shadow-sm"
                    : "hover:text-white text-zinc-400"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch relative z-10">
        {HOSTING_PLANS.map((plan) => {
          const rawPrice =
            billingPeriod === "fourYear"
              ? plan.fourYearPrice
              : billingPeriod === "yearly"
              ? plan.yearlyPrice
              : plan.monthlyPrice;

          const currentPrice = rawPrice * rate;
          const currentMonthlyOriginal = plan.monthlyPrice * rate;
          const currentRenewal = plan.renewalPrice * rate;

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 glow-card ${
                plan.highlight
                  ? "bg-gradient-to-b from-[#1b193a] via-[#14152b] to-[#0f1022] border-2 border-[#6c5ce7] shadow-2xl shadow-[#6c5ce7]/30 scale-[1.03]"
                  : "glass-panel border-white/[0.08]"
              }`}
            >
              {/* Highlight Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-[#6c5ce7] via-[#a29bfe] to-[#00cec9] text-white shadow-xl flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  {plan.highlight && (
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ⚡ Turbo Cache
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 min-h-[32px] leading-relaxed">
                  {plan.tagline}
                </p>

                {/* Pricing Block */}
                <div className="mt-5 pb-5 border-b border-white/[0.08]">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black text-white">
                      {symbol}{currentPrice.toFixed(2)}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">/month</span>
                  </div>

                  <div className="text-[11px] text-zinc-400 mt-1.5 flex items-center gap-2">
                    {billingPeriod === "fourYear" && (
                      <span className="line-through text-zinc-500">
                        {symbol}{currentMonthlyOriginal.toFixed(2)}/mo
                      </span>
                    )}
                    <span className="text-emerald-400 font-semibold">
                      Renews at {symbol}{currentRenewal.toFixed(2)}/mo
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="my-5">
                  <Link
                    href={`/panel?plan=${plan.id}`}
                    className={`w-full py-3.5 rounded-xl text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                      plan.highlight
                        ? "bg-gradient-to-r from-[#6c5ce7] to-[#5844e3] hover:from-[#5844e3] hover:to-[#4734cb] text-white shadow-lg shadow-[#6c5ce7]/40 hover:scale-[1.02]"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    }`}
                  >
                    <span>Choose Plan</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Specs highlights */}
                <div className="space-y-2 py-3 border-y border-white/[0.05] text-xs">
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-500">Websites:</span>
                    <span className="font-semibold text-white">{plan.specs.websites}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-500">Storage:</span>
                    <span className="font-semibold text-white">{plan.specs.storage}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-500">Bandwidth:</span>
                    <span className="font-semibold text-white">{plan.specs.bandwidth}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span className="text-zinc-500">Backups:</span>
                    <span className="font-semibold text-white">{plan.specs.backup}</span>
                  </div>
                </div>

                {/* Feature Checklist */}
                <div className="mt-5 space-y-2.5">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-zinc-400 block mb-2">
                    Included Features:
                  </span>
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.05] text-[11px] text-zinc-500 text-center">
                30-day money-back guarantee • 99.99% SLA
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
