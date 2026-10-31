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
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import {
  PaystackLogo,
  VisaLogo,
  MastercardLogo,
  ApplePayLogo,
  GooglePayLogo,
  PaymentLogosStrip,
} from "@/components/PaymentLogos";

export default function CheckoutModal() {
  const {
    items,
    isCheckoutOpen,
    setIsCheckoutOpen,
    currency,
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
    "Paystack (Cards / Bank Transfer)" | "Debit / Credit Card" | "Apple Pay" | "Google Pay"
  >("Paystack (Cards / Bank Transfer)");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [city, setCity] = useState("Lagos");
  const [postalCode, setPostalCode] = useState("101241");
  const [country, setCountry] = useState("Nigeria");

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardPin, setCardPin] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<{
    id: string;
    totalPaidUsd: number;
    estimatedDelivery: string;
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
        shippingAddress: shippingAddress || "Victoria Island",
        city: city || "Lagos",
        country,
        postalCode: postalCode || "101241",
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
        setErrorMessage(initData.error || "Unable to initialize Paystack checkout.");
        return;
      }

      // Check if Paystack Inline JS popup modal is available in window
      const win = window as any;
      const publicKey =
        process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
        "pk_live_d2e4bb883f45096a034c3ed24d0ef6565d1a5484";

      if (win.PaystackPop && typeof win.PaystackPop.setup === "function") {
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
              // Payment completed inside popup - redirect to order confirmation
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

      // Fallback: direct browser redirect to Paystack hosted checkout
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
            </div>
          ) : (
            <form onSubmit={handleCheckoutSubmit} className="space-y-5">
              {/* Payment Methods with Official Logos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Select Payment Option
                  </p>
                  <span className="text-[11px] text-slate-500">
                    256-Bit SSL Secure
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Option 1: Paystack (Cards & Bank Transfer) */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Paystack (Cards / Bank Transfer)")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer h-20 ${
                      paymentMethod === "Paystack (Cards / Bank Transfer)"
                        ? "border-[#0BA4DB] bg-cyan-50/50 ring-2 ring-[#0BA4DB]/30 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <PaystackLogo className="h-4.5 w-auto" />
                      {paymentMethod === "Paystack (Cards / Bank Transfer)" && (
                        <span className="w-2 h-2 rounded-full bg-[#0BA4DB]" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-900 mt-2 block truncate">
                      Paystack Direct
                    </span>
                  </button>

                  {/* Option 2: Visa / Mastercard */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Debit / Credit Card")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer h-20 ${
                      paymentMethod === "Debit / Credit Card"
                        ? "border-[#002B7F] bg-blue-50/50 ring-2 ring-[#002B7F]/30 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <VisaLogo className="h-4 w-auto" />
                      <MastercardLogo className="h-4 w-auto" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-900 mt-2 block">
                      Visa / Mastercard
                    </span>
                  </button>

                  {/* Option 3: Apple Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Apple Pay")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer h-20 ${
                      paymentMethod === "Apple Pay"
                        ? "border-slate-950 bg-slate-100 ring-2 ring-slate-900/30 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <ApplePayLogo className="h-4 w-auto" />
                    <span className="text-[11px] font-bold text-slate-900 mt-2 block">
                      Apple Pay
                    </span>
                  </button>

                  {/* Option 4: Google Pay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("Google Pay")}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer h-20 ${
                      paymentMethod === "Google Pay"
                        ? "border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/30 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <GooglePayLogo className="h-4 w-auto" />
                    <span className="text-[11px] font-bold text-slate-900 mt-2 block">
                      Google Pay
                    </span>
                  </button>
                </div>
              </div>

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
                      placeholder="Lagos"
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
                      placeholder="101241"
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
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-2 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#002B7F]"
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Gateway Description */}
              <div className="p-4 bg-cyan-50/60 border border-cyan-200/80 rounded-2xl space-y-2.5 animate-fadeIn">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <PaystackLogo className="h-4.5 w-auto" />
                    <span className="text-xs font-bold text-slate-900">
                      {paymentMethod === "Debit / Credit Card"
                        ? "Encrypted Card Checkout (Visa / Mastercard / Verve)"
                        : paymentMethod === "Apple Pay"
                        ? "Apple Pay Express via Paystack"
                        : paymentMethod === "Google Pay"
                        ? "Google Pay Express via Paystack"
                        : "Paystack Direct Settlement (Nigeria & Global)"}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#0BA4DB] bg-white px-2.5 py-0.5 rounded-full border border-cyan-200">
                    3D Secure • Instant Verification
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {paymentMethod === "Debit / Credit Card"
                    ? "Clicking Pay securely opens Paystack's PCI-DSS Level 1 encrypted card terminal where you enter your Visa, Mastercard, or Verve card details and complete your bank's 3D Secure OTP."
                    : paymentMethod === "Apple Pay"
                    ? "Clicking Pay opens Paystack's encrypted checkout where you can authorize instantly with Apple Pay (Face ID / Touch ID) on supported Apple devices, or pay via Card / Bank Transfer."
                    : "Direct payment via Nigerian Bank Transfer (OPay, Access, Zenith, GTB, Kuda, UBA), Visa, Mastercard, Verve & USSD. Your order is verified automatically upon payment."}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  {errorMessage}
                </div>
              )}

              {/* Order Summary & Submit */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-500 block">Total Due</span>
                  <span className="text-xl font-bold font-mono text-slate-950">
                    {formatPrice(finalTotalUsd)}
                  </span>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#002B7F] hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-70"
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

                  {/* Payment Logos Trust Strip */}
                  <PaymentLogosStrip className="flex items-center gap-1.5 self-center sm:self-end" />
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
