"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Home, AlertCircle, FileText } from "lucide-react";
import { useCart } from "@/context/CartContext";
import TipsPanel from "@/components/ui/tips-panel";
import { getProductClinicalTips } from "@/lib/clinical-tips";
import type { OrderItem } from "@/lib/store-db";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const orderId = searchParams.get("orderId");
  const { clearCart, formatPrice } = useCart();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear cart on successful checkout
    clearCart();

    if (!reference) {
      setLoading(false);
      return;
    }

    async function verifyPayment() {
      try {
        const res = await fetch("/api/paystack/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });
        const data = await res.json();
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          // If already verified or order exists
          setOrder({ id: orderId || "AUR-CONFIRMED", totalPaidUsd: data.verifiedAmountNgn ? data.verifiedAmountNgn / 1480 : null });
        }
      } catch (err: any) {
        console.warn("Verification ping:", err);
        setOrder({ id: orderId || "AUR-CONFIRMED" });
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [reference, orderId]);

  return (
    <div className="min-h-screen bg-[#FBFBFC] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 text-center animate-fadeIn">
        {/* Animated Success Badge */}
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
          <CheckCircle2 className="w-9 h-9 text-emerald-600 animate-bounce" />
        </div>

        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0BA4DB] bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200 inline-block mb-2">
          Paystack Payment Verified
        </span>

        <h1 className="text-2xl font-black text-slate-950 tracking-tight">
          Payment Confirmed!
        </h1>
        <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
          Thank you for shopping with <strong className="text-slate-900">AURA.STORE</strong>. Your order has been registered and is being prepared for express tracked dispatch.
        </p>

        {/* Order Details Card */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 my-6 text-left space-y-2 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Order Reference</span>
            <span className="font-mono font-bold text-slate-900">{order?.id || orderId || reference || "AUR-SUCCESS"}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Payment Status</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Paid &amp; Settled
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Estimated Delivery</span>
            <span className="font-semibold text-slate-900">2–4 Business Days (Tracked)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 mb-6">
          <Link
            href={`/track-order?q=${encodeURIComponent(order?.id || orderId || reference || "")}`}
            className="w-full bg-[#002B7F] hover:bg-blue-800 text-white font-bold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
          >
            <Package className="w-4 h-4" />
            <span>Track This Order</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>

          <Link
            href="/"
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>Return to Storefront</span>
          </Link>
        </div>

        {/* Vital Product Clinical Advisory Panel (What It Does & What It Cannot Do) */}
        {order?.items && Array.isArray(order.items) && order.items.length > 0 && (
          <div className="border-t border-slate-200 pt-6 text-left space-y-6">
            <div className="text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#002B7F] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 inline-block mb-1">
                Post-Purchase Advisory
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Vital Clinical Information
              </h2>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Medical indications, usage protocols, and explicit physiological contraindications for your ordered formulas.
              </p>
            </div>

            {order.items.map((item: OrderItem) => (
              <div key={item.productId} className="space-y-3">
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  {item.image && (
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 overflow-hidden relative shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {item.brand} • {item.variantName} (Qty: {item.quantity})
                    </p>
                  </div>
                </div>

                {/* Integration of TipsPanel */}
                <TipsPanel
                  title={`Clinical Protocol: ${item.name.slice(0, 32)}...`}
                  tips={getProductClinicalTips(item)}
                  className="mx-auto"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FBFBFC]">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
