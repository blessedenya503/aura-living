"use client";

import { useState } from "react";
import { ShieldCheck, Lock, RefreshCw, CheckCircle2, ShieldAlert, Zap, Globe } from "lucide-react";

interface SecurityTabProps {
  activeDomain: string;
  sslActive: boolean;
  onToggleSsl: () => void;
}

export function SecurityTab({ activeDomain, sslActive, onToggleSsl }: SecurityTabProps) {
  const [forceHttps, setForceHttps] = useState(true);
  const [lscacheEnabled, setLscacheEnabled] = useState(true);
  const [ddosProtection, setDdosProtection] = useState(true);
  const [isReissuing, setIsReissuing] = useState(false);
  const [reissueMsg, setReissueMsg] = useState(false);

  const handleReissue = () => {
    setIsReissuing(true);
    setTimeout(() => {
      setIsReissuing(false);
      setReissueMsg(true);
      setTimeout(() => setReissueMsg(false), 2500);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-white/[0.08]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>SSL & Security Shield</span>
        </h2>
        <p className="text-xs text-zinc-400">
          Manage encryption certificates, automated HTTP to HTTPS redirection, and edge DDoS filters for <strong>{activeDomain}</strong>.
        </p>
      </div>

      {/* SSL Certificate Card */}
      <div className="p-6 rounded-3xl bg-[#131424] border border-white/10 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Let&apos;s Encrypt Wildcard SSL</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                  {sslActive ? "Active & Verified" : "Disabled"}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Valid for <strong className="text-zinc-200">{activeDomain}</strong> and <strong className="text-zinc-200">*.{activeDomain}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReissue}
              disabled={isReissuing}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReissuing ? "animate-spin text-[#6c5ce7]" : ""}`} />
              <span>{isReissuing ? "Validating DNS..." : "Reissue Certificate"}</span>
            </button>
            <button
              onClick={onToggleSsl}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                sslActive
                  ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {sslActive ? "Disable SSL" : "Enable SSL"}
            </button>
          </div>
        </div>

        {reissueMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>SSL certificate successfully regenerated and deployed to LiteSpeed edges!</span>
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-black/20 border border-white/5">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">Issuer:</span>
            <span className="font-semibold text-zinc-200">Let&apos;s Encrypt Authority X3</span>
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">Expires:</span>
            <span className="font-semibold text-zinc-200">Feb 08, 2027 (Auto-Renews)</span>
          </div>
          <div className="p-3 rounded-xl bg-black/20 border border-white/5">
            <span className="text-zinc-500 block text-[10px] uppercase font-bold">Encryption:</span>
            <span className="font-semibold text-zinc-200">ECDSA 384-bit / TLS 1.3</span>
          </div>
        </div>
      </div>

      {/* Security Feature Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Force HTTPS */}
        <div className="p-5 rounded-2xl bg-[#131424] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#00cec9]" />
                Force HTTPS
              </span>
              <input
                type="checkbox"
                checked={forceHttps}
                onChange={() => setForceHttps(!forceHttps)}
                className="w-4 h-4 accent-[#6c5ce7] cursor-pointer"
              />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automatically redirect all unencrypted HTTP requests to secure HTTPS via HTTP 301.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold mt-4 text-emerald-400">
            {forceHttps ? "Status: FORCED (301)" : "Status: ALLOW_HTTP"}
          </span>
        </div>

        {/* LiteSpeed Cache */}
        <div className="p-5 rounded-2xl bg-[#131424] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                LiteSpeed Cache (LSCache)
              </span>
              <input
                type="checkbox"
                checked={lscacheEnabled}
                onChange={() => setLscacheEnabled(!lscacheEnabled)}
                className="w-4 h-4 accent-[#6c5ce7] cursor-pointer"
              />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enables server-level page caching for ultra-low TTFB (&lt;80ms) and high concurrency.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold mt-4 text-emerald-400">
            {lscacheEnabled ? "Status: ENABLED (Hit 94%)" : "Status: BYPASS"}
          </span>
        </div>

        {/* DDoS Protection */}
        <div className="p-5 rounded-2xl bg-[#131424] border border-white/[0.08] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#a29bfe]" />
                Edge DDoS Mitigation
              </span>
              <input
                type="checkbox"
                checked={ddosProtection}
                onChange={() => setDdosProtection(!ddosProtection)}
                className="w-4 h-4 accent-[#6c5ce7] cursor-pointer"
              />
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Real-time Layer 3/4/7 packet filtering and bad bot challenge verification.
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold mt-4 text-emerald-400">
            {ddosProtection ? "Status: ARMED & FILTERING" : "Status: DISABLED"}
          </span>
        </div>
      </div>
    </div>
  );
}
