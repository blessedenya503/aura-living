"use client";

import { Website } from "@/data/hostingData";
import { Globe, Plus, ExternalLink, Settings2, Trash2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useState } from "react";

interface WebsitesTabProps {
  websites: Website[];
  activeSite: Website;
  onSelectSite: (site: Website) => void;
  onOpenDeployModal: () => void;
  onChangePhpVersion: (siteId: string, version: string) => void;
}

export function WebsitesTab({
  websites,
  activeSite,
  onSelectSite,
  onOpenDeployModal,
  onChangePhpVersion,
}: WebsitesTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#6c5ce7]" />
            <span>Hosted Websites & Applications</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Switch PHP/Node runtime environments, configure staging subdomains, and manage virtual hosts.
          </p>
        </div>

        <button
          onClick={onOpenDeployModal}
          className="px-3.5 py-1.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#6c5ce7]/30 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Website</span>
        </button>
      </div>

      {/* Website Cards Grid */}
      <div className="space-y-3">
        {websites.map((site) => {
          const isCurrent = site.id === activeSite.id;
          return (
            <div
              key={site.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCurrent
                  ? "bg-[#181932] border-[#6c5ce7] shadow-xl shadow-[#6c5ce7]/20"
                  : "bg-[#131424] border-white/[0.08] hover:border-white/20"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#a29bfe] shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{site.domain}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">
                        {site.status}
                      </span>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#6c5ce7]/20 text-[#a29bfe] border border-[#6c5ce7]/30">
                          Active Target
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1 flex flex-wrap items-center gap-3">
                      <span>Type: <strong className="text-zinc-200">{site.type}</strong></span>
                      <span>•</span>
                      <span>Disk: <strong className="text-zinc-200 font-mono">{site.storageUsedMB} MB</strong></span>
                      <span>•</span>
                      <span>Bandwidth: <strong className="text-zinc-200 font-mono">{site.bandwidthUsedGB} GB</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* PHP / Runtime switcher */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-500">Runtime:</span>
                    <select
                      value={site.phpVersion}
                      onChange={(e) => onChangePhpVersion(site.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-zinc-200 focus:outline-none focus:border-[#6c5ce7]"
                    >
                      <option value="PHP 8.3">PHP 8.3</option>
                      <option value="PHP 8.2">PHP 8.2</option>
                      <option value="PHP 8.1">PHP 8.1</option>
                      <option value="Node 20 LTS">Node 20 LTS</option>
                      <option value="Node 22 LTS">Node 22 LTS</option>
                      <option value="Static HTML">Static HTML</option>
                    </select>
                  </div>

                  {!isCurrent ? (
                    <button
                      onClick={() => onSelectSite(site)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
                    >
                      Manage Site
                    </button>
                  ) : (
                    <a
                      href={`/live/${site.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      title="Visit Site"
                    >
                      <span>Visit Live</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
