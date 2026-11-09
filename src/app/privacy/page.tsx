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
  ShieldCheck,
  Database,
  CreditCard,
  CheckCircle2,
  Share2,
  Cookie,
  UserCheck,
  Lock,
  RefreshCw,
  Phone,
  Mail,
} from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <div className="border-b border-slate-100 pb-6 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#002B7F] text-[11px] font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Data &amp; Privacy</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              PRIVACY POLICY
            </h1>
            <p className="text-xs font-mono text-slate-500">Last updated: November 9, 2026</p>
            <p className="text-sm text-slate-700 pt-2 leading-relaxed">
              AURA SKIN (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy
              explains what information we collect and how we use it.
            </p>
          </div>

          {/* 1. INFORMATION WE COLLECT */}
          <section className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#002B7F]" />
              <span>INFORMATION WE COLLECT</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 leading-relaxed pl-1">
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>Contact details: name, phone number, email address</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>Delivery details: shipping address</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>Order details: the products you buy and your order history</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>Account details if you create an account</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>
                  Technical data, such as device type and pages visited, to help us improve the site
                </span>
              </li>
            </ul>
          </section>

          {/* 2. PAYMENTS */}
          <section className="space-y-2.5 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#002B7F]" />
              <span>PAYMENTS</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Payments are processed by our payment partners (such as Paystack and PayPal). We do
              not store your full card details on our servers.
            </p>
          </section>

          {/* 3. HOW WE USE YOUR INFORMATION */}
          <section className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#002B7F]" />
              <span>HOW WE USE YOUR INFORMATION</span>
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 leading-relaxed pl-1">
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>To process and deliver your orders</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>To contact you about your order</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>To provide customer support</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>
                  To send offers or updates, only if you agree, and you can opt out at any time
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>To improve our website and services</span>
              </li>
            </ul>
          </section>

          {/* 4. SHARING YOUR INFORMATION */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#002B7F]" />
              <span>SHARING YOUR INFORMATION</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              We share your information only with the people needed to complete your order, such as
              payment providers and delivery couriers, or when the law requires it. We do not sell
              your personal information.
            </p>
          </section>

          {/* 5. COOKIES */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Cookie className="w-4 h-4 text-[#002B7F]" />
              <span>COOKIES</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Our site may use cookies to keep your bag, remember your preferences and understand
              how the site is used. You can turn cookies off in your browser settings, but some
              features may not work properly.
            </p>
          </section>

          {/* 6. YOUR RIGHTS */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#002B7F]" />
              <span>YOUR RIGHTS</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              You can ask us to see, correct or delete the personal information we hold about you.
              Contact us at{" "}
              <a
                href={`mailto:${supportEmail}`}
                className="font-semibold text-[#002B7F] hover:underline"
              >
                {supportEmail}
              </a>{" "}
              or on WhatsApp at{" "}
              <a
                href="https://wa.me/2347038703778"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#002B7F] hover:underline"
              >
                +234 703 870 3778
              </a>
              .
            </p>
          </section>

          {/* 7. DATA SECURITY */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#002B7F]" />
              <span>DATA SECURITY</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              We take reasonable steps to protect your information, but no online system is
              completely secure.
            </p>
          </section>

          {/* 8. CHANGES */}
          <section className="space-y-2.5">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#002B7F]" />
              <span>CHANGES</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              We may update this policy from time to time. The latest version will always be on this
              page.
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
                href="https://wa.me/2347038703778?text=Hello%20AURA%20SKIN%2C%20I%20have%20a%20privacy%20inquiry"
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
