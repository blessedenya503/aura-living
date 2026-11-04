"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot, Sparkles, Phone, ShieldCheck, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  time: string;
  recommendedProducts?: { id: string; name: string; price: number }[];
}

export default function AuraAiChatModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { products, formatPrice, setSelectedProduct } = useCart();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: "Hello! Welcome to AURA Skincare Concierge. I am your 24/7 AI Skincare Advisor. How can I help you today? You can ask about product recommendations for acne, hyperpigmentation, dry skin, order tracking, or authentic ingredients.",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = input.trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await res.json();
      let responseText = "";
      let matchedProds: { id: string; name: string; price: number }[] = [];

      if (data?.ai) {
        responseText = `${data.ai.headline ? `✨ ${data.ai.headline}\n\n` : ""}${data.ai.dermatologistAdvice || "For your routine, we recommend gentle barrier repair and daily SPF."}`;

        if (Array.isArray(data.ai.recommendedProductIds)) {
          matchedProds = products
            .filter((p) => data.ai.recommendedProductIds.includes(p.id))
            .map((p) => ({ id: p.id, name: p.name, price: p.price }));
        }
      } else {
        responseText = "Thank you for reaching out! For skin barrier concerns, we recommend using COSRX Advanced Snail 96 Mucin with CeraVe Daily Moisturizing Lotion and Beauty of Joseon SPF 50+. Would you like direct delivery details?";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: responseText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          recommendedProducts: matchedProds.length > 0 ? matchedProds : undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I'm always here to assist. For authentic orders or urgent delivery inquiries, you can also reach our WhatsApp support line directly at +234 814 624 3788.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[85vh] sm:h-[620px]">
        {/* Header */}
        <div className="bg-linear-to-r from-[#002B7F] to-indigo-900 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-300" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-[#002B7F] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-white">AURA AI Skincare Concierge</h3>
                <span className="text-[10px] bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 px-1.5 py-0.2 rounded-md font-mono">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-blue-200 flex items-center gap-1">
                <span>Direct Line:</span>
                <a href="tel:+2348146243788" className="font-mono underline hover:text-white">
                  +234 814 624 3788
                </a>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* WhatsApp & Call Action Strip */}
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-1.5 text-blue-900 font-medium">
            <Phone className="w-3.5 h-3.5 text-blue-700" />
            <span>AI Phone &amp; WhatsApp:</span>
            <span className="font-mono font-bold">+234 814 624 3788</span>
          </div>
          <a
            href="https://wa.me/2348146243788?text=Hello%20AURA%2C%20I%20have%20a%20question%20about%20a%20skincare%20product"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all"
          >
            <span>WhatsApp AI</span>
          </a>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/70">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === "user"
                    ? "bg-[#002B7F] text-white rounded-br-xs"
                    : "bg-white text-slate-900 border border-slate-200/80 rounded-bl-xs whitespace-pre-wrap"
                }`}
              >
                {msg.text}

                {/* Recommended Product Cards */}
                {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Recommended for Your Skin:
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
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200/70 transition-colors cursor-pointer"
                        >
                          <span className="font-semibold text-xs text-slate-900 truncate max-w-[200px]">
                            {p.name}
                          </span>
                          <span className="font-mono font-bold text-xs text-[#002B7F] shrink-0 ml-2">
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
            <div className="flex items-center gap-2 text-slate-500 text-xs italic bg-white px-3 py-2 rounded-xl border border-slate-200/80 w-fit">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
              <span>AURA AI is analyzing your skin query...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-3 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {[
            "Clear stubborn dark spots",
            "Repair damaged skin barrier",
            "Best sunscreen without white cast",
            "Track my order",
          ].map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInput(prompt);
              }}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium whitespace-nowrap transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AURA AI anything about skincare or your order..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002B7F]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-[#002B7F] hover:bg-blue-800 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
