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
  Sparkles,
  CheckCircle2,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";

export default function AboutPage() {
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
          <div className="border-b border-slate-100 pb-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#002B7F] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Our Story</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              ABOUT AURA SKIN
            </h1>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              AURA SKIN is a Nigerian skincare store offering popular brands like COSRX, CeraVe,
              Anua, Beauty of Joseon, The Ordinary and La Roche-Posay.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              We started AURA SKIN to make it easier for people in Nigeria and around the world to
              find skincare they&apos;ve heard about, with clear information, tracked delivery and
              real support when you need it.
            </p>
          </div>

          {/* WHAT WE DO */}
          <section className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#002B7F]" />
              <span>WHAT WE DO</span>
            </h2>
            <ul className="space-y-2.5 text-sm text-slate-700 leading-relaxed pl-1">
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>Offer a wide range of popular skincare products</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>Pack every order carefully and send it with tracking</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#002B7F] font-bold">•</span>
                <span>Answer your questions on WhatsApp</span>
              </li>
            </ul>
          </section>

          {/* NOT SURE WHAT TO BUY? */}
          <section className="space-y-2.5 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#002B7F]" />
              <span>NOT SURE WHAT TO BUY?</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              Message us with your skin type and concerns, and we&apos;ll point you to products that
              might suit you.
            </p>
          </section>

          {/* Contact Us */}
          <section className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-sm text-slate-700">
              <p className="font-bold text-slate-900">Contact us:</p>
              <p>
                WhatsApp:{" "}
                <a
                  href="https://wa.me/2347038703778?text=Hello%20AURA%20SKIN%2C%20I%20would%20like%20help%20choosing%20products%20for%20my%20skin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono font-bold text-[#002B7F] hover:underline"
                >
                  +234 703 870 3778
                </a>
              </p>
              <p>
                Email:{" "}
                <a
                  href={`mailto:${supportEmail}`}
                  className="font-semibold text-[#002B7F] hover:underline"
                >
                  {supportEmail}
                </a>
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href="https://wa.me/2347038703778?text=Hello%20AURA%20SKIN%2C%20I%20would%20like%20help%20choosing%20products%20for%20my%20skin"
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
          </section>
        </div>
      </main>

      <CartDrawer />
      <CheckoutModal />
      <GlobalSearchModal />
    </div>
  );
}
