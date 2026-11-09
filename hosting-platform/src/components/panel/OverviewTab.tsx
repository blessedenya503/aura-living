"use client";

import { Website } from "@/data/hostingData";
import {
  Globe,
  Lock,
  Cpu,
  HardDrive,
  FolderTree,
  Database,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Zap,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { PanelTab } from "./PanelSidebar";

interface OverviewTabProps {
  activeSite: Website;
  onNavigateTab: (tab: PanelTab) => void;
  onToggleSsl: () => void;
}

export function OverviewTab({ activeSite, onNavigateTab, onToggleSsl }: OverviewTabProps) {
  const [copiedIp, setCopiedIp] = useState(false);

  const copyIp = () => {
    navigator.clipboard.writeText(activeSite.ip);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Site hero card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171633] via-[#121326] to-[#0f1020] border border-[#6c5ce7]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 flex items-center justify-center text-[#a29bfe] shrink-0">
            <Globe className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-2xl font-black text-white tracking-tight">
                {activeSite.domain}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active & Live
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 flex items-center gap-3">
              <span>Stack: <strong className="text-white">{activeSite.type}</strong> ({activeSite.phpVersion})</span>
              <span>•</span>
              <span>Created: <strong className="text-zinc-300">{activeSite.createdAt}</strong></span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/live/${activeSite.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
          >
            <span>Visit Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => onNavigateTab("installer")}
            className="px-4 py-2.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] text-white text-xs font-bold transition-all shadow-lg shadow-[#6c5ce7]/30 flex items-center gap-1.5"
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>
        </div>
      </div>

      {/* Primary Server Specs Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* SSL Status */}
        <div className="p-4 rounded-2xl bg-[#131424] border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-0.5">
              SSL Certificate
            </span>
            <div className="flex items-center gap-1.5">
              <Lock className={`w-4 h-4 ${activeSite.sslActive ? "text-emerald-400" : "text-amber-400"}`} />
              <span className="text-sm font-bold text-white">
                {activeSite.sslActive ? "Active (Let's Encrypt)" : "Disabled"}
              </span>
            </div>
          </div>
          <button
            onClick={onToggleSsl}
            className="text-[11px] font-semibold text-[#a29bfe] hover:underline"
          >
            {activeSite.sslActive ? "Reissue" : "Activate"}
          </button>
        </div>

        {/* Server IP */}
        <div className="p-4 rounded-2xl bg-[#131424] border border-white/[0.08] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-0.5">
              Server IPv4
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-white">{activeSite.ip}</span>
            </div>
          </div>
          <button
            onClick={copyIp}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="Copy IP"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Disk Usage */}
        <div className="p-4 rounded-2xl bg-[#131424] border border-white/[0.08]">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              NVMe Disk
            </span>
            <span className="font-mono font-bold text-white">
              {(activeSite.storageUsedMB / 1024).toFixed(2)} GB / 100 GB
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full bg-[#6c5ce7] rounded-full"
              style={{ width: `${(activeSite.storageUsedMB / (100 * 1024)) * 100}%` }}
            />
          </div>
        </div>

        {/* Bandwidth */}
        <div className="p-4 rounded-2xl bg-[#131424] border border-white/[0.08]">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
              Bandwidth (30d)
            </span>
            <span className="font-mono font-bold text-emerald-400">
              {activeSite.bandwidthUsedGB} GB / Unlimited
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: "12%" }} />
          </div>
        </div>
      </div>

      {/* Quick Launch Control Hub */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-3">
          Quick Management Tools
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: "filemanager" as PanelTab, title: "File Manager", icon: FolderTree, desc: "Edit & upload files" },
            { id: "databases" as PanelTab, title: "Databases", icon: Database, desc: "MySQL & Postgres" },
            { id: "installer" as PanelTab, title: "Auto Installer", icon: Rocket, desc: "WordPress & Next.js" },
            { id: "dns" as PanelTab, title: "DNS Editor", icon: Globe, desc: "A, CNAME & MX records" },
            { id: "security" as PanelTab, title: "SSL & Security", icon: ShieldCheck, desc: "Certificates & WAF" },
            { id: "resources" as PanelTab, title: "Resource Telemetry", icon: Cpu, desc: "CPU, RAM & I/O" },
          ].map((tool) => {
            const Icon = tool.icon;
            return (
              <button
                key={tool.id}
                onClick={() => onNavigateTab(tool.id)}
                className="p-4 rounded-2xl bg-[#131424] border border-white/[0.06] hover:border-[#6c5ce7]/40 hover:bg-[#181932] transition-all text-left group glow-card"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-[#6c5ce7]/20 flex items-center justify-center text-[#a29bfe] mb-3 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-[#a29bfe] transition-colors">
                  {tool.title}
                </h4>
                <p className="text-[10px] text-zinc-500 mt-0.5 truncate">
                  {tool.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nameservers & DNS Details */}
      <div className="p-5 rounded-2xl bg-[#131424] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Assigned Anycast Nameservers</span>
          </h4>
          <p className="text-xs text-zinc-400 mt-0.5">
            Point your domain registrar DNS records to NovaHost global edge:
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-zinc-200">
            ns1.novahost.cloud
          </span>
          <span className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-zinc-200">
            ns2.novahost.cloud
          </span>
        </div>
      </div>
    </div>
  );
}
