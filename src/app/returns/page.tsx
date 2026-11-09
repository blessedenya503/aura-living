"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  MessageCircle,
  CreditCard,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";

export default function ReturnsAndRefundsPage() {
  const { storeSettings } = useCart();
  const supportEmail = storeSettings?.supportEmail || "orders@auraskinng.com";

  return (
    <div className="min-h-screen bg-[#FBFBFC] text-slate-900 flex flex-col selection:bg-blue-100 selection:text-[#002B7F]">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#002B7F] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="border-b border-slate-100 pb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#002B7F] text-[11px] font-bold uppercase tracking-wider mb-3">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Customer Care Policy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              RETURNS &amp; REFUNDS
            </h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              We want you to be happy with your order. Here&apos;s how returns work.
            </p>
          </div>

          {/* 1. RETURNS */}
          <section className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#002B7F]" />
              <span>RETURNS</span>
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed pl-1">
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>Unopened and unused items can be returned within 7 days of delivery.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>Items must be in their original sealed packaging.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>
                  For hygiene and safety reasons, opened or used skincare products cannot be returned.
                </span>
              </li>
            </ul>
          </section>

          {/* 2. DAMAGED OR WRONG ITEMS */}
          <section className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>DAMAGED OR WRONG ITEMS</span>
            </h2>
            <p className="text-sm text-slate-700">
              If your order arrives damaged, leaking, or different from what you ordered:
            </p>
            <ol className="space-y-2 text-sm text-slate-700 leading-relaxed list-decimal list-inside">
              <li>
                Message us on WhatsApp at{" "}
                <a
                  href="https://wa.me/2347038703778"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#002B7F] hover:underline"
                >
                  +234 703 870 3778
                </a>{" "}
                within 48 hours of delivery.
              </li>
              <li>Send clear photos or a short video of the item and the packaging.</li>
              <li>We will replace the item or refund you after we confirm the problem.</li>
            </ol>
          </section>

          {/* 3. HOW TO START A RETURN */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#002B7F]" />
              <span>HOW TO START A RETURN</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Contact us on WhatsApp or at{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="font-semibold text-[#002B7F] hover:underline"
              >
                {supportEmail}
              </a>{" "}
              with your order number and the reason for the return. We will reply within{" "}
              <strong>1–2 business days</strong> with the next steps.
            </p>
          </section>

          {/* 4. REFUNDS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#002B7F]" />
              <span>REFUNDS</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Approved refunds are sent to your original payment method within{" "}
              <strong>3–5 business days</strong>. Delivery fees are non-refundable unless the error
              was ours.
            </p>
          </section>

          {/* Footer Contact Bar */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm font-semibold text-slate-800">
              Questions? WhatsApp us on{" "}
              <span className="font-mono text-[#002B7F]">+234 703 870 3778</span>.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://wa.me/2347038703778?text=Hello%20AURA%2C%20I%20need%20help%20with%20a%20return%20or%20order"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Support</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <CartDrawer />
      <CheckoutModal />
      <GlobalSearchModal />
    </div>
  );
}
