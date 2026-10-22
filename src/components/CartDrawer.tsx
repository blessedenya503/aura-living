"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { PaymentLogosStrip } from "@/components/PaymentLogos";

export default function CartDrawer() {
  const {
    products,
    storeSettings,
    items,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    subtotalUsd,
    bundleSavingsUsd,
    discountCode,
    discountAmountUsd,
    applyPromoCode,
    removePromoCode,
    shippingProtection,
    setShippingProtection,
    shippingCostUsd,
    shippingProtectionCostUsd,
    finalTotalUsd,
    formatPrice,
    setIsCheckoutOpen,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  const freeThreshold = storeSettings.freeShippingThresholdUsd || 35;
  const progressPct = Math.min(
    100,
    Math.round((subtotalUsd / freeThreshold) * 100)
  );
  const amountRemainingUsd = Math.max(0, freeThreshold - subtotalUsd);

  const cartProductIds = new Set(items.map((i) => i.product.id));
  const upsellProduct =
    products.find((p) => !cartProductIds.has(p.id) && p.brand === "NIVEA") ||
    products.find((p) => !cartProductIds.has(p.id));

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoMessage({ ok: res.success, text: res.message });
    if (res.success) setPromoInput("");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-hidden bg-slate-950/65 backdrop-blur-sm"
        >
          <div
            className="absolute inset-0"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="w-screen max-w-full sm:max-w-md h-[100dvh] bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Top Header */}
              <div>
                <div className="px-4 sm:px-5 py-3.5 sm:py-4 bg-[#002B7F] text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-5 h-5 text-amber-300" />
                    <h2 className="font-bold text-sm sm:text-base tracking-tight">
                      Your Skincare Bag ({items.reduce((s, i) => s + i.quantity, 0)})
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1.5 rounded-full bg-blue-800/80 hover:bg-blue-700 text-blue-100 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Free Shipping Progress Bar */}
                <div className="px-4 sm:px-5 py-2.5 bg-blue-50/70 border-b border-blue-100">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      {amountRemainingUsd === 0 ? (
                        <span className="text-emerald-700 font-bold">
                          Free Express Shipping Unlocked!
                        </span>
                      ) : (
                        <span>
                          Add{" "}
                          <strong className="text-[#002B7F]">
                            {formatPrice(amountRemainingUsd)}
                          </strong>{" "}
                          for Free Shipping
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-blue-900">
                      {progressPct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ type: "spring", stiffness: 200, damping: 25 }}
                      className="h-full bg-[#002B7F] rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {items.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-bold text-slate-800">
                      Your bag is empty
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Explore our NIVEA &amp; clinical creams to begin.
                    </p>
                  </div>
                ) : (
                  items.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedVariant.name}`}
                      className="flex gap-3 p-3 rounded-2xl border border-slate-200/80 bg-slate-50/50"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-slate-200 p-1 flex items-center justify-center">
                        <img
                          src={
                            item.product.image ||
                            "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop"
                          }
                          alt={item.product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[10px] font-bold text-[#002B7F] uppercase tracking-wider block">
                              {item.product.brand}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-[11px] text-slate-500">
                              {item.selectedVariant.name}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              removeFromCart(item.product.id, item.selectedVariant.name)
                            }
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedVariant.name,
                                  item.quantity - 1
                                )
                              }
                              className="px-2 py-1 text-slate-600 hover:text-slate-950"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-900 font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedVariant.name,
                                  item.quantity + 1
                                )
                              }
                              className="px-2 py-1 text-slate-600 hover:text-slate-950"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-xs font-bold font-mono text-slate-900">
                            {formatPrice(item.unitPriceUsd * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Quick Add Companion */}
                {upsellProduct && items.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-white border border-amber-200">
                        <Image
                          src={upsellProduct.image}
                          alt={upsellProduct.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="truncate">
                        <span className="text-[10px] font-bold text-amber-800 uppercase block">
                          Recommended Companion
                        </span>
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {upsellProduct.name}
                        </div>
                        <div className="text-[11px] font-mono text-slate-600">
                          {formatPrice(upsellProduct.price)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        addToCart(upsellProduct, upsellProduct.variants[0], 1, false)
                      }
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl shrink-0 transition-colors cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Totals & Checkout Button */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 space-y-3">
                  {/* Promo Input */}
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code (e.g. GLOW15)"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#002B7F]"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-[#002B7F] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  {promoMessage && (
                    <div
                      className={`text-[11px] font-semibold ${
                        promoMessage.ok ? "text-emerald-700" : "text-rose-600"
                      }`}
                    >
                      {promoMessage.text}
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-mono text-slate-900 font-semibold">
                        {formatPrice(subtotalUsd)}
                      </span>
                    </div>
                    {bundleSavingsUsd > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Bundle Savings</span>
                        <span className="font-mono">-{formatPrice(bundleSavingsUsd)}</span>
                      </div>
                    )}
                    {discountAmountUsd > 0 && (
                      <div className="flex justify-between text-emerald-600 font-semibold">
                        <span>Discount ({discountCode})</span>
                        <span className="font-mono">-{formatPrice(discountAmountUsd)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Express Courier Shipping</span>
                      <span className="font-mono text-slate-900 font-semibold">
                        {shippingCostUsd === 0 ? "FREE" : formatPrice(shippingCostUsd)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-bold text-slate-950">
                      <span>Total Due</span>
                      <span className="font-mono text-base text-[#002B7F]">
                        {formatPrice(finalTotalUsd)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      setIsCheckoutOpen(true);
                    }}
                    className="w-full bg-[#002B7F] hover:bg-blue-800 text-white font-bold py-3.5 rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.01] cursor-pointer"
                  >
                    <span>Proceed to Express Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col items-center gap-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-medium">
                      Accepted Payment Options:
                    </span>
                    <PaymentLogosStrip className="flex items-center justify-center gap-2" />
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
