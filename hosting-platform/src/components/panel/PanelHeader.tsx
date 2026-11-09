"use client";

import Link from "next/link";
import { Server, Globe, ChevronDown, Plus, ExternalLink, ShieldCheck, Home } from "lucide-react";
import { Website } from "@/data/hostingData";
import { BrandLogo } from "@/components/BrandLogo";

interface PanelHeaderProps {
  websites: Website[];
  activeSite?: Website | null;
  onSelectSite: (site: Website) => void;
  onOpenDeployModal: () => void;
}

export function PanelHeader({
  websites,
  activeSite,
  onSelectSite,
  onOpenDeployModal,
}: PanelHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[#0e0f1c]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 py-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Brand & Active Website Picker */}
        <div className="flex items-center gap-4">
          <BrandLogo />

          <div className="h-5 w-px bg-white/10 hidden sm:block" />

          {/* Website Switcher Dropdown */}
          <div className="relative group">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#131424] border border-white/10 text-xs text-white hover:border-[#6c5ce7]/50 cursor-pointer transition-all">
              <Globe className="w-3.5 h-3.5 text-[#00cec9]" />
              <span className="font-bold tracking-tight">
                {activeSite ? activeSite.domain : "No Site Selected"}
              </span>
              {activeSite && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
              <ChevronDown className="w-3 h-3 text-zinc-400" />
            </div>

            {/* Dropdown Options */}
            <div className="absolute left-0 mt-1 w-64 rounded-xl bg-[#141528] border border-white/10 shadow-2xl p-1.5 hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 px-2 py-1 block">
                Your Managed Sites ({websites.length})
              </span>
              {websites.length > 0 ? (
                websites.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => onSelectSite(site)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                      site.id === activeSite?.id
                        ? "bg-[#6c5ce7] text-white font-bold"
                        : "text-zinc-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span className="truncate">{site.domain}</span>
                    <span className="text-[10px] opacity-75">{site.type}</span>
                  </button>
                ))
              ) : (
                <div className="px-2 py-2 text-xs text-zinc-500 text-center">
                  No websites hosted yet
                </div>
              )}
              <div className="mt-1 pt-1 border-t border-white/10">
                <button
                  onClick={onOpenDeployModal}
                  className="w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[#a29bfe] hover:bg-white/5 font-semibold"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add New Domain / Site</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Server Status & Global Actions */}
        <div className="flex items-center gap-3">
          {/* Region Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Frankfurt (EU-Central)</span>
            <span className="text-zinc-600">•</span>
            <span className="font-mono text-zinc-300 text-[11px]">18ms</span>
          </div>

          <button
            onClick={onOpenDeployModal}
            className="px-3.5 py-1.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#6c5ce7]/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Deploy Site</span>
          </button>

          <Link
            href="/"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors border border-white/5"
            title="Return to Storefront"
          >
            <Home className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}
