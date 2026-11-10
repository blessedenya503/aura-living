"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Lock,
  CheckCircle2,
  CreditCard,
  ArrowRight,
  PackageSearch,
  Sparkles,
  ShieldCheck,
  KeyRound,
  Gift,
  Check,
  Clock,
  Truck,
  Repeat,
  HeartHandshake,
  Tag,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  PaystackLogo,
  PayPalLogo,
  VisaLogo,
  MastercardLogo,
  ApplePayLogo,
  GooglePayLogo,
  PaymentLogosStrip,
} from "@/components/PaymentLogos";
import TipsPanel from "@/components/ui/tips-panel";
import { getProductClinicalTips } from "@/lib/clinical-tips";
import Image from "next/image";
import type { OrderItem } from "@/lib/store-db";

export default function CheckoutModal() {
  const {
    items,
    isCheckoutOpen,
    setIsCheckoutOpen,
    currency,
    shippingCountry,
    setShippingCountry,
    formatPrice,
    subtotalUsd,
    discountAmountUsd,
    shippingCostUsd,
    shippingProtection,
    shippingProtectionCostUsd,
    finalTotalUsd,
    clearCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<
    | "Paystack (Cards / Bank Transfer)"
    | "PayPal"
    | "Debit / Credit Card"
    | "Apple Pay"
    | "Google Pay"
  >("Paystack (Cards / Bank Transfer)");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Retention & Amazon / CeraVe conversion upgrades
  const [selectedFreeSample, setSelectedFreeSample] = useState<string>("cerave-hydrating-cleanser");
  const [isSubscribeAndSave, setIsSubscribeAndSave] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [promoStatus, setPromoStatus] = useState<{ success: boolean; message: string } | null>(null);

  const { discountCode, applyPromoCode, removePromoCode } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<{
    id: string;
    totalPaidUsd: number;
    estimatedDelivery: string;
    items?: OrderItem[];
  } | null>(null);

  if (!isCheckoutOpen) return null;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const orderPayload = {
        customerName: customerName || "Skincare Client",
        customerEmail: customerEmail || "guest@auraliving.store",
        shippingAddress: shippingAddress,
        city,
        country,
        postalCode: postalCode,
        currency,
        shippingProtection,
        discountUsd: discountAmountUsd,
        items: items.map((item) => ({
          productId: item.product.id,
          variantName: item.selectedVariant.name,
          bundleTier: item.bundleTier,
          quantity: item.quantity,
          unitPriceUsd: item.unitPriceUsd,
        })),
      };

      // All real payment methods (Paystack Direct, Visa/Mastercard, Apple Pay, Google Pay)
      // route through Paystack's encrypted live checkout gateway
      const initRes = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...orderPayload,
          paymentMethod,
          amountUsd: finalTotalUsd,
        }),
      });

      const initData = await initRes.json();

      if (!initRes.ok || !initData.success) {
        setErrorMessage(initData.error || "Unable to initialize checkout.");
        return;
      }

      if (initData.isPayPal && initData.authorizationUrl) {
        window.location.href = initData.authorizationUrl;
        return;
      }

      // Check if Paystack Inline JS popup modal is available in window
      const win = window as any;
      const publicKey =
        process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
        "pk_live_d2e4bb883f45096a034c3ed24d0ef6565d1a5484";
      const isMobile = typeof navigator !== "undefined" && /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);

      // On desktop, prefer inline iframe modal.
      // On mobile browsers, direct redirect to authorizationUrl is vastly more reliable and avoids iframe viewport bugs
      if (!isMobile && win.PaystackPop && typeof win.PaystackPop.setup === "function") {
        try {
          const handler = win.PaystackPop.setup({
            key: publicKey,
            email: customerEmail || "guest@auraliving.store",
            amount: initData.amountNgn ? Math.round(initData.amountNgn * 100) : Math.round(finalTotalUsd * 1480 * 100),
            currency: "NGN",
            ref: initData.reference,
            metadata: {
              orderId: initData.orderId,
              customerName: customerName || "AURA Client",
            },
            callback: function (response: any) {
              window.location.href = `/checkout/success?reference=${response.reference}&orderId=${initData.orderId}`;
            },
            onClose: function () {
              setIsSubmitting(false);
            },
          });
          handler.openIframe();
          return;
        } catch (popupErr) {
          console.warn("Paystack popup fallback to redirect:", popupErr);
        }
      }

      // Mobile or fallback: clean direct redirect to Paystack payment window
      if (initData.authorizationUrl) {
        window.location.href = initData.authorizationUrl;
        return;
      }

      // Demo / instant verification mode fallback
      const verifyRes = await fetch("/api/paystack/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: initData.reference,
          orderPayload: {
            ...orderPayload,
            orderId: initData.orderId,
          },
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyData.order) {
        setConfirmedOrder({
          id: verifyData.order.id,
          totalPaidUsd: verifyData.order.totalPaidUsd,
          estimatedDelivery:
            verifyData.order.estimatedDelivery || "2–4 Business Days (Express)",
          items: verifyData.order.items,
        });
        clearCart();
        return;
      }

      setErrorMessage("Payment authorization could not be completed.");
      return;
    } catch (err) {
      console.error("Checkout failed:", err);
      setErrorMessage("Network error while connecting to payment gateway. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(null);
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden sm:my-auto max-h-[94dvh] sm:max-h-[92vh] flex flex-col"
      >
        {/* Top Header */}
        <div className="px-5 py-4 bg-[#002B7F] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="font-bold text-xs sm:text-sm tracking-tight">
              AURA 256-Bit Encrypted Express Checkout
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full bg-blue-800/80 hover:bg-blue-700 text-blue-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-8">
          {confirmedOrder ? (
            <div className="text-center max-w-md mx-auto py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                  Payment Captured via {paymentMethod}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Thank You! Order #{confirmedOrder.id}
                </h3>
                <p className="text-xs text-slate-600">
                  Receipt sent to <strong>{customerEmail || "your email"}</strong>.
                  Estimated delivery: {confirmedOrder.estimatedDelivery}.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {confirmedOrder.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Option:</span>
                  <span className="font-bold text-slate-900">
                    {paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Paid:</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    {formatPrice(confirmedOrder.totalPaidUsd)}
                  </span>
                </div>
              </div>

              {/* VIP Member Next-Order Reward & Repeat Loyalty Card */}
              <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-300 rounded-2xl text-left space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
                      AURA VIP Club Privilege Unlocked!
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                    REWARD CODE
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  As our VIP client, your next order is automatically granted <strong>20% OFF</strong>. Use code <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border border-amber-300 text-amber-900">AURA20</span> or quote your Order ID <strong>#{confirmedOrder.id}</strong> on WhatsApp for priority replenishment dispatch.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href={`/track-order?q=${confirmedOrder.id}`}
                  onClick={handleClose}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#002B7F] hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <PackageSearch className="w-4 h-4" />
                  <span>Track Order #{confirmedOrder.id}</span>
                </Link>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
                >
                  Continue Shopping
                </button>
              </div>

              {/* Vital Product Clinical Advisory Panel (What It Does & What It Cannot Do) */}
              {confirmedOrder.items && Array.isArray(confirmedOrder.items) && confirmedOrder.items.length > 0 && (
                <div className="border-t border-slate-200 pt-6 text-left space-y-5">
                  <div className="text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#002B7F] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 inline-block mb-1">
                      Post-Order Medical Directive
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      Vital Clinical Information
                    </h4>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Medical indications, usage protocols, and physiological contraindications for your ordered formulas.
                    </p>
                  </div>

                  {confirmedOrder.items.map((item: OrderItem) => (
                    <div key={item.productId} className="space-y-2.5">
                      <div className="flex items-center gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                        {item.image && (
                          <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 overflow-hidden relative shrink-0">
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
                            {item.brand} • {item.variantName}
                          </p>
                        </div>
                      </div>

                      <TipsPanel
                        title={`Clinical Guidance: ${item.name.slice(0, 28)}...`}
                        tips={getProductClinicalTips(item)}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-5">
              {/* Payment Methods — Clean 3-Option Selector */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Payment Method
                  </p>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-600" />
                    256-Bit SSL Encrypted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Option 1: Paystack (Bank Transfer / NGN Cards / USSD) */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Paystack (Cards / Bank Transfer)")}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === "Paystack (Cards / Bank Transfer)"
                        ? "border-[#0BA4DB] bg-cyan-50/40 ring-2 ring-[#0BA4DB]/25"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <PaystackLogo className="h-5 w-auto" />
                      {paymentMethod === "Paystack (Cards / Bank Transfer)" && (
                        <span className="w-2 h-2 rounded-full bg-[#0BA4DB]" />
                      )}
                    </div>
                    <div className="mt-2.5">
                      <span className="text-xs font-bold text-slate-900 block">
                        Paystack Direct
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Bank Transfer, USSD &amp; Local Cards
                      </span>
                    </div>
                  </button>

                  {/* Option 2: PayPal (USD) */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("PayPal")}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === "PayPal"
                        ? "border-[#003087] bg-amber-50/40 ring-2 ring-[#003087]/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <PayPalLogo className="h-5 w-auto" />
                      {paymentMethod === "PayPal" && (
                        <span className="w-2 h-2 rounded-full bg-[#003087]" />
                      )}
                    </div>
                    <div className="mt-2.5">
                      <span className="text-xs font-bold text-slate-900 block">
                        PayPal
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        PayPal Balance &amp; International USD
                      </span>
                    </div>
                  </button>

                  {/* Option 3: Debit / Credit Card & Express Wallets */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Debit / Credit Card")}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      paymentMethod === "Debit / Credit Card" ||
                      paymentMethod === "Apple Pay" ||
                      paymentMethod === "Google Pay"
                        ? "border-[#002B7F] bg-blue-50/40 ring-2 ring-[#002B7F]/25"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5">
                        <VisaLogo className="h-4 w-auto" />
                        <MastercardLogo className="h-4 w-auto" />
                        <ApplePayLogo className="h-4 w-auto" />
                      </div>
                      {(paymentMethod === "Debit / Credit Card" ||
                        paymentMethod === "Apple Pay" ||
                        paymentMethod === "Google Pay") && (
                        <span className="w-2 h-2 rounded-full bg-[#002B7F]" />
                      )}
                    </div>
                    <div className="mt-2.5">
                      <span className="text-xs font-bold text-slate-900 block">
                        Debit / Credit Card
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Visa, Mastercard, Apple &amp; Google Pay
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Promo Code Input Box */}
              <div className="p-3 bg-white border border-slate-200 rounded-2xl flex items-center gap-2">
                <Tag className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
                <input
                  type="text"
                  placeholder="Promo / Gift Card code (e.g. GLOW15, AURA20)"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden uppercase font-mono"
                />
                {discountCode ? (
                  <button
                    type="button"
                    onClick={() => {
                      removePromoCode();
                      setPromoStatus(null);
                    }}
                    className="text-xs font-semibold text-rose-600 hover:underline px-2"
                  >
                    Remove ({discountCode})
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!promoInput.trim()) return;
                      const res = applyPromoCode(promoInput);
                      setPromoStatus(res);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                )}
              </div>
              {promoStatus && (
                <p className={`text-[11px] px-1 font-semibold ${promoStatus.success ? "text-emerald-600" : "text-rose-600"}`}>
                  {promoStatus.message}
                </p>
              )}

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Adekunle Olawale"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#002B7F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="adekunle@domain.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#002B7F]"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Plot 14 Admiralty Way, Lekki Phase 1"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#002B7F]"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#002B7F]"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ZIP / Postal"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#002B7F]"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Country
                    </label>
                    <select
                      required
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setShippingCountry(e.target.value);
                      }}
                      className="w-full px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#002B7F]"
                    >
                      <option value="" disabled>Select country</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="New Zealand">New Zealand</option>
                      <option value="Ireland">Ireland</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Italy">Italy</option>
                      <option value="Spain">Spain</option>
                      <option value="Netherlands">Netherlands</option>
                      <option value="Belgium">Belgium</option>
                      <option value="Sweden">Sweden</option>
                      <option value="Switzerland">Switzerland</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Saudi Arabia">Saudi Arabia</option>
                      <option value="Qatar">Qatar</option>
                      <option value="India">India</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Japan">Japan</option>
                      <option value="South Korea">South Korea</option>
                      <option value="China">China</option>
                      <option value="Hong Kong">Hong Kong</option>
                      <option value="Mexico">Mexico</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Uganda">Uganda</option>
                      <option value="Tanzania">Tanzania</option>
                      <option value="Egypt">Egypt</option>
                      <option value="Morocco">Morocco</option>
                    </select>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Order Summary & Submit */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 block">Total Due</span>
                  <span className="text-2xl font-bold font-mono text-slate-950">
                    {formatPrice(finalTotalUsd)}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Tracked door-to-door delivery included
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#002B7F] hover:bg-blue-800 text-white font-bold px-7 py-3.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Authorizing {paymentMethod}...</span>
                  ) : (
                    <>
                      <span>Pay {formatPrice(finalTotalUsd)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
