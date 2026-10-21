"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldAlert, ArrowRight, Sparkles } from "lucide-react";

export default function OwnerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Invalid owner credentials.");
      } else {
        router.push("/owner-portal");
        router.refresh();
      }
    } catch {
      setError("Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      {/* Background ambient glow */}
      <div className="absolute w-[500px] h-[300px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-tr from-[#002B7F] to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-900/40">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
              Confidential • Owner Access
            </span>
            <h1 className="text-xl font-bold text-white mt-1">
              AURA Private Dashboard
            </h1>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Private owner interface for monitoring live revenue, managing NIVEA &amp;
          skincare inventory, customer orders, and store settings.
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-semibold text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Owner Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Owner Master Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-blue-500 font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl bg-[#0032A0] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all cursor-pointer disabled:opacity-70"
          >
            <span>{loading ? "Verifying..." : "Unlock Owner Dashboard"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}
