"use client";

import {
  LayoutDashboard,
  Globe,
  FolderTree,
  Database,
  Rocket,
  ShieldCheck,
  Activity,
  Mail,
  CreditCard,
  ExternalLink,
} from "lucide-react";

export type PanelTab =
  | "overview"
  | "websites"
  | "filemanager"
  | "databases"
  | "installer"
  | "dns"
  | "security"
  | "resources"
  | "emails"
  | "billing";

interface PanelSidebarProps {
  currentTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  activeDomain: string;
  activeSlug: string;
}

export function PanelSidebar({
  currentTab,
  onTabChange,
  activeDomain,
  activeSlug,
}: PanelSidebarProps) {
  const navigationItems = [
    { id: "overview" as PanelTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "websites" as PanelTab, label: "Websites & Staging", icon: Globe },
    { id: "installer" as PanelTab, label: "Auto Installer", icon: Rocket, badge: "1-Click" },
    { id: "filemanager" as PanelTab, label: "File Manager", icon: FolderTree },
    { id: "databases" as PanelTab, label: "Databases (SQL)", icon: Database },
    { id: "dns" as PanelTab, label: "DNS Zone Editor", icon: Globe },
    { id: "security" as PanelTab, label: "SSL & Security", icon: ShieldCheck },
    { id: "resources" as PanelTab, label: "Resource Usage", icon: Activity },
    { id: "emails" as PanelTab, label: "Email Accounts", icon: Mail },
    { id: "billing" as PanelTab, label: "Billing & Plans", icon: CreditCard },
  ];

  return (
    <aside className="w-64 bg-[#0d0e1b] border-r border-white/[0.08] flex flex-col shrink-0 min-h-[calc(100vh-61px)]">
      {/* Active Context Banner */}
      <div className="p-4 border-b border-white/[0.06]">
        <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-1">
          Managing Site:
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white truncate max-w-[170px]">
            {activeDomain}
          </span>
          <a
            href={`/live/${activeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-emerald-400 transition-colors p-1"
            title="Preview Live Site"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#6c5ce7] text-white font-bold shadow-md shadow-[#6c5ce7]/25"
                  : "text-zinc-400 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-zinc-400"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#00cec9]/10 text-[#00cec9] border border-[#00cec9]/20"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System health footer */}
      <div className="p-4 border-t border-white/[0.06] bg-[#0b0c16]">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-zinc-400">Node Load (4 Cores):</span>
          <span className="font-mono text-emerald-400 font-bold">14%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full bg-emerald-400 rounded-full" style={{ width: "14%" }} />
        </div>
        <div className="text-[10px] text-zinc-500 mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>LiteSpeed Active</span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#6c5ce7]/10 text-[#a29bfe] font-bold border border-[#6c5ce7]/20">
            <span>by antigravity</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
