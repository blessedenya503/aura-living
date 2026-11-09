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
  Truck,
  Clock,
  MapPin,
  Globe,
  Gift,
  AlertCircle,
  Phone,
  Mail,
  Ship,
  CreditCard,
} from "lucide-react";

export default function ShippingAndDeliveryPage() {
  const { storeSettings, formatPrice } = useCart();
  const supportEmail =
    storeSettings?.supportEmail &&
    storeSettings.supportEmail !== "concierge@auraliving.store" &&
    storeSettings.supportEmail !== "orders@auraskinng.com"
      ? storeSettings.supportEmail
      : "auraskinngofficial@gmail.com";
  const freeThresholdUsd = storeSettings?.freeShippingThresholdUsd || 35;

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
              <Truck className="w-3.5 h-3.5" />
              <span>Logistics &amp; Dispatch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              SHIPPING &amp; DELIVERY
            </h1>
          </div>

          {/* 1. PROCESSING */}
          <section className="space-y-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#002B7F]" />
              <span>PROCESSING</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Orders are processed within <strong>1–2 business days</strong> after payment is
              confirmed.
            </p>
          </section>

          {/* 2. DELIVERY TIMES */}
          <section className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#002B7F]" />
              <span>DELIVERY TIMES</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 leading-relaxed pl-1">
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>
                  <strong>Lagos &amp; Abuja:</strong> 1–2 business days
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>
                  <strong>Other states in Nigeria:</strong> 2–4 business days
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>
                  <strong>International:</strong> 5–10 business days
                </span>
              </li>
            </ul>
            <p className="text-xs text-slate-500 pt-1">
              These are estimates. Delays can happen because of weather, customs, courier issues, or
              public holidays.
            </p>
          </section>

          {/* 3. TRACKING */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Ship className="w-4 h-4 text-[#002B7F]" />
              <span>TRACKING</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Every order comes with tracking. You&apos;ll receive your tracking details by WhatsApp
              or email once your order ships. You can also check your order on our{" "}
              <Link href="/track-order" className="font-bold text-[#002B7F] hover:underline">
                Track Order
              </Link>{" "}
              page.
            </p>
          </section>

          {/* 4. SHIPPING COSTS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#002B7F]" />
              <span>SHIPPING COSTS</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Shipping fees are shown at checkout before you pay. Orders over{" "}
              <strong>{formatPrice(freeThresholdUsd)}</strong> qualify for free shipping.
            </p>
          </section>

          {/* 5. INTERNATIONAL ORDERS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#002B7F]" />
              <span>INTERNATIONAL ORDERS</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Customers abroad are responsible for any import duties, customs fees, or taxes charged
              by their country. Some items, such as products with batteries, may not be available
              for international shipping.
            </p>
          </section>

          {/* 6. FREE GIFT */}
          <section className="space-y-2.5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-950 flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-600" />
              <span>FREE GIFT</span>
            </h2>
            <p className="text-sm text-amber-950/90 leading-relaxed">
              The free portable fan with the El Niño Skincare Bundle is available for orders within
              Nigeria only, while stock lasts.
            </p>
          </section>

          {/* 7. WRONG ADDRESS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>WRONG ADDRESS</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Please check your address carefully. We cannot be responsible for orders delivered to
              an incorrect address provided at checkout.
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
                href="https://wa.me/2347038703778?text=Hello%20AURA%2C%20I%20have%20a%20question%20about%20shipping%20and%20delivery"
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
