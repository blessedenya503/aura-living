"use client";

import { CreditCard, Download, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function BillingTab() {
  const invoices = [
    { id: "INV-2026-891", date: "Nov 08, 2026", amount: "$191.52", plan: "Premium Cloud Hosting (48 Months)", status: "Paid" },
    { id: "INV-2026-412", date: "Oct 12, 2026", amount: "$8.99", plan: "Domain Registration (novashop-prod.com)", status: "Paid" },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-white/[0.08]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-[#a29bfe]" />
          <span>Billing, Subscriptions & Invoices</span>
        </h2>
        <p className="text-xs text-zinc-400">
          Manage your cloud subscription tiers, payment methods, and automated tax receipts.
        </p>
      </div>

      {/* Active Subscription Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1b1938] via-[#141527] to-[#101120] border-2 border-[#6c5ce7] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#6c5ce7] to-[#00cec9] text-white">
              Active Tier
            </span>
            <span className="text-xs text-zinc-400">Next Auto-Renewal: <strong>Nov 08, 2030</strong></span>
          </div>
          <h3 className="text-2xl font-black text-white">
            Premium Cloud Hosting (48 Months)
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed">
            100 Websites, 100 GB NVMe Gen4 Storage, LiteSpeed Cache, Free Lifetime SSL, and 24/7 Priority Support.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/#plans"
            className="px-5 py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] text-white text-xs font-bold transition-all shadow-lg shadow-[#6c5ce7]/30 flex items-center gap-1.5"
          >
            <span>Upgrade Plan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-[#131424] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-3 bg-[#101120] border-b border-white/[0.08] text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Billing & Invoicing History
        </div>
        <div className="divide-y divide-white/[0.06]">
          {invoices.map((inv) => (
            <div key={inv.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">{inv.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {inv.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{inv.plan} • {inv.date}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-white">{inv.amount}</span>
                <button
                  onClick={() => alert(`Downloading PDF receipt for invoice ${inv.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-200 hover:text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
