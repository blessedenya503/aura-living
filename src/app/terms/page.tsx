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
  FileText,
  Tag,
  ShoppingBag,
  CreditCard,
  Truck,
  RotateCcw,
  AlertTriangle,
  Award,
  Scale,
  RefreshCw,
  Gavel,
  Phone,
  Mail,
} from "lucide-react";

export default function TermsOfServicePage() {
  const { storeSettings } = useCart();
  const supportEmail =
    storeSettings?.supportEmail &&
    storeSettings.supportEmail !== "concierge@auraliving.store" &&
    storeSettings.supportEmail !== "orders@auraskinng.com"
      ? storeSettings.supportEmail
      : "auraskinngofficial@gmail.com";

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
          <div className="border-b border-slate-100 pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#002B7F] text-[11px] font-bold uppercase tracking-wider mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Store Terms</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              TERMS OF SERVICE
            </h1>
            <p className="text-xs font-mono text-slate-500">Last updated: November 9, 2026</p>
            <p className="text-sm text-slate-700 pt-2 leading-relaxed">
              By using the AURA SKIN website and placing an order, you agree to these terms.
            </p>
          </div>

          {/* 1. PRODUCTS AND PRICES */}
          <section className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#002B7F]" />
              <span>PRODUCTS AND PRICES</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 leading-relaxed pl-1">
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>
                  We try to show product details, images and prices accurately, but mistakes can
                  happen. If we find an error in a price or description, we may cancel or correct
                  your order and refund you in full.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>
                  Prices are shown in the currency selected on the site and may change without
                  notice.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>Product images are for reference. Packaging may vary by batch.</span>
              </li>
            </ul>
          </section>

          {/* 2. ORDERS */}
          <section className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#002B7F]" />
              <span>ORDERS</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 leading-relaxed pl-1">
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>
                  Your order is confirmed only after payment succeeds and we send confirmation.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>
                  We can cancel or refuse an order if an item is out of stock, if we suspect fraud,
                  or if there is a pricing or availability error. If we cancel, we will refund you.
                </span>
              </li>
            </ul>
          </section>

          {/* 3. PAYMENTS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#002B7F]" />
              <span>PAYMENTS</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Payments are processed securely by third-party providers. You confirm that you are
              allowed to use the payment method you choose.
            </p>
          </section>

          {/* 4. DELIVERY */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#002B7F]" />
              <span>DELIVERY</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Delivery times are estimates, not guarantees. See our{" "}
              <Link href="/shipping" className="font-semibold text-[#002B7F] hover:underline">
                Shipping page
              </Link>{" "}
              for details.
            </p>
          </section>

          {/* 5. RETURNS AND REFUNDS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#002B7F]" />
              <span>RETURNS AND REFUNDS</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              See our{" "}
              <Link href="/returns" className="font-semibold text-[#002B7F] hover:underline">
                Returns page
              </Link>
              . Opened or used skincare products cannot be returned.
            </p>
          </section>

          {/* 6. SKINCARE USE */}
          <section className="space-y-2.5 p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>SKINCARE USE</span>
            </h2>
            <p className="text-sm text-slate-800 leading-relaxed">
              Skin reacts differently from person to person. Read the ingredients and instructions
              on each product, and do a patch test before first use. Stop using a product if it
              irritates your skin. Information on our site is general and is not medical advice. If
              you have a skin condition, allergies, or are pregnant or nursing, speak to a doctor or
              dermatologist before using new products.
            </p>
          </section>

          {/* 7. BRANDS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#002B7F]" />
              <span>BRANDS</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              All brand names and trademarks belong to their respective owners. We are an
              independent retailer and are not affiliated with or endorsed by these brands unless we
              say otherwise.
            </p>
          </section>

          {/* 8. LIMITATION OF LIABILITY */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#002B7F]" />
              <span>LIMITATION OF LIABILITY</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              To the fullest extent allowed by law, we are not liable for indirect or consequential
              losses arising from your use of the site or products. Our total liability is limited
              to the amount you paid for the affected order.
            </p>
          </section>

          {/* 9. CHANGES */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#002B7F]" />
              <span>CHANGES</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              We may update these terms from time to time. Continuing to use the site means you
              accept the updated terms.
            </p>
          </section>

          {/* 10. GOVERNING LAW */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-[#002B7F]" />
              <span>GOVERNING LAW</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              These terms are governed by the laws of the Federal Republic of Nigeria.
            </p>
          </section>

          {/* Footer Contact Bar */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-sm font-semibold text-slate-800">
              Contact:{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="text-[#002B7F] hover:underline"
              >
                {supportEmail}
              </a>{" "}
              | WhatsApp{" "}
              <span className="font-mono text-[#002B7F]">+234 703 870 3778</span>
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href="https://wa.me/2347038703778?text=Hello%20AURA%20SKIN%2C%20I%20have%20a%20question%20about%20your%20Terms%20of%20Service"
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
                <span>Email Us</span>
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
