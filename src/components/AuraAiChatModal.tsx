"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  Sparkles,
  Phone,
  ShieldCheck,
  Check,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Heart,
  Stethoscope,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  time: string;
  prescriptionFocus?: string;
  recommendedProducts?: { id: string; name: string; price: number; brand?: string; image?: string }[];
}

export default function AuraAiChatModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { products, formatPrice, setSelectedProduct } = useCart();
  const [activeTab, setActiveTab] = useState<"whatsapp" | "chat">("whatsapp");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hello! I am Dr. AURA, your personal clinical skincare specialist. 🌿\n\nTell me what's happening with your skin right now. Are you experiencing breakouts, sensitivity, dark spots, or unusual dryness? I'm here to listen, understand what you're feeling, and guide you to the right gentle routine.",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Default to showing WhatsApp first when opened as requested
      setActiveTab("whatsapp");
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen]);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          history: newHistory.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      const data = await res.json();
      let doctorReply = "";
      let matchedProds: { id: string; name: string; price: number; brand?: string; image?: string }[] = [];
      let focus = "";

      if (data?.ai) {
        doctorReply = data.ai.doctorReply || "I hear you. Let us address this carefully with gentle barrier restoration.";
        focus = data.ai.prescriptionFocus || "";

        if (Array.isArray(data.ai.recommendedProductIds)) {
          matchedProds = products
            .filter((p) => data.ai.recommendedProductIds.includes(p.id))
            .map((p) => ({
              id: p.id,
              name: p.name,
              price: p.price,
              brand: p.brand,
              image: p.image,
            }));
        }
      } else {
        doctorReply = "Thank you for sharing that with me. Could you also tell me if your skin tends to feel dry or oily by the afternoon? That will help me confirm the right prescription.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: doctorReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          prescriptionFocus: focus || undefined,
          recommendedProducts: matchedProds.length > 0 ? matchedProds : undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I am having trouble with the network at the moment, but you can speak directly with me or our human specialist on WhatsApp at 07038703778.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[88vh] sm:h-[640px]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-950 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-emerald-300" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">Dr. AURA Skincare Clinic</h3>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-md font-mono">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80">
                Empathetic Diagnosis &amp; Custom Prescription
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: WhatsApp First, then Interactive Chat */}
        <div className="grid grid-cols-2 bg-slate-100 p-1 border-b border-slate-200 shrink-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("whatsapp")}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "whatsapp"
                ? "bg-white text-emerald-800 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp (07038703778)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("chat")}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-white text-blue-900 shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-blue-700" />
            <span>Interactive Doctor Chat</span>
          </button>
        </div>

        {/* TAB 1: WHATSAPP LINE (SHOWN FIRST) */}
        {activeTab === "whatsapp" && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col justify-between bg-slate-50/60">
            <div>
              {/* WhatsApp Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                    <svg className="w-7 h-7 fill-[#25D366]" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-sm">
                      Official AURA WhatsApp Line
                    </h4>
                    <p className="text-xs text-slate-500">
                      Direct WhatsApp for instant prescription, order support &amp; inquiries.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/60 rounded-xl mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                    Verified WhatsApp Number
                  </span>
                  <div className="font-mono text-lg font-extrabold text-emerald-950 flex items-center justify-between">
                    <span>07038703778</span>
                    <span className="text-xs font-sans font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Online Now
                    </span>
                  </div>
                </div>

                <a
                  href="https://wa.me/2347038703778?text=Hello%20AURA%2C%20I%20have%20a%20question%20about%20a%20skincare%20product"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <span>Chat on WhatsApp Directly</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Or Option: Launch In-App Chat */}
              <div className="mt-5 text-center">
                <span className="text-xs text-slate-400 block mb-3">
                  Prefer discussing here in your browser?
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("chat")}
                  className="w-full bg-slate-900 hover:bg-[#002B7F] text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-cyan-300" />
                  <span>Start Two-Way Interactive Consultation</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-4 text-center text-[11px] text-slate-400 border-t border-slate-200">
              🔒 Confidential consultation. 100% authentic dermatological advice.
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE CONSULTATION CHAT */}
        {activeTab === "chat" && (
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/70">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.sender === "user"
                        ? "bg-[#002B7F] text-white rounded-br-xs"
                        : "bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs whitespace-pre-wrap"
                    }`}
                  >
                    {/* Prescription Badge if applicable */}
                    {msg.prescriptionFocus && (
                      <div className="mb-2 pb-2 border-b border-emerald-100 flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold">
                        <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Prescription Focus: {msg.prescriptionFocus}</span>
                      </div>
                    )}

                    {msg.text}

                    {/* Prescribed Products */}
                    {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                      <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                          Dr. AURA Clinical Prescription:
                        </span>
                        {msg.recommendedProducts.map((p) => {
                          const fullProd = products.find((prod) => prod.id === p.id);
                          return (
                            <div
                              key={p.id}
                              onClick={() => {
                                if (fullProd) {
                                  setSelectedProduct(fullProd);
                                  onClose();
                                }
                              }}
                              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 transition-colors cursor-pointer group"
                            >
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                {p.image && (
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-9 h-9 object-contain rounded-md bg-white border border-slate-200 p-0.5 shrink-0"
                                  />
                                )}
                                <div className="truncate">
                                  {p.brand && (
                                    <span className="text-[9px] font-bold text-slate-400 block uppercase">
                                      {p.brand}
                                    </span>
                                  )}
                                  <span className="font-bold text-xs text-slate-900 group-hover:text-[#002B7F] truncate block">
                                    {p.name}
                                  </span>
                                </div>
                              </div>
                              <span className="font-mono font-bold text-xs text-emerald-700 shrink-0 ml-2">
                                {formatPrice(p.price)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <span className="text-[9.5px] text-slate-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-slate-600 text-xs italic bg-white px-3.5 py-2.5 rounded-2xl border border-slate-200/80 w-fit shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                  <span>Dr. AURA is reviewing your skin condition and routine...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Interactive Complaints (Scrollable touch row with smooth scrollbar) */}
            <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto overflow-y-hidden touch-pan-x shrink-0 scroll-smooth">
              {[
                "My face is breaking out and feels oily",
                "Stubborn dark spots that won't fade",
                "Skin burns or stings when washing",
                "Looking for a non-greasy sunscreen",
              ].map((complaint, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(complaint)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 active:bg-emerald-100 hover:text-emerald-900 border border-slate-200/60 text-slate-700 text-xs font-medium whitespace-nowrap transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  {complaint}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={(e) => handleSend(undefined, e)} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Explain what your skin is feeling..."
                className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
