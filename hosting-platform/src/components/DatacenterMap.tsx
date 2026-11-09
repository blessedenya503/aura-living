"use client";

import { useState } from "react";
import { Globe2, Radio, Server, CheckCircle2 } from "lucide-react";

interface Datacenter {
  id: string;
  name: string;
  region: string;
  pingMs: number;
  uptime: string;
  hardware: string;
}

const DATACENTERS: Datacenter[] = [
  {
    id: "us-east",
    name: "North America (East)",
    region: "Ashburn, VA, United States",
    pingMs: 14,
    uptime: "99.998%",
    hardware: "AMD EPYC 9654, 10Gbps Uplink",
  },
  {
    id: "eu-central",
    name: "Europe (Central)",
    region: "Frankfurt, Germany",
    pingMs: 18,
    uptime: "99.999%",
    hardware: "AMD EPYC 9554, NVMe Gen4",
  },
  {
    id: "uk-london",
    name: "Europe (West)",
    region: "London, United Kingdom",
    pingMs: 22,
    uptime: "99.997%",
    hardware: "AMD EPYC 9654, Tier-IV Facility",
  },
  {
    id: "ap-southeast",
    name: "Asia Pacific (South)",
    region: "Singapore",
    pingMs: 38,
    uptime: "99.999%",
    hardware: "Intel Xeon Platinum, Equinix SG1",
  },
  {
    id: "ap-northeast",
    name: "Asia Pacific (East)",
    region: "Tokyo, Japan",
    pingMs: 44,
    uptime: "99.996%",
    hardware: "AMD EPYC 9554, 10Gbps Uplink",
  },
  {
    id: "sa-brazil",
    name: "South America",
    region: "São Paulo, Brazil",
    pingMs: 56,
    uptime: "99.995%",
    hardware: "Intel Xeon Gold, Ascenty SP4",
  },
];

export function DatacenterMap() {
  const [selectedDc, setSelectedDc] = useState<Datacenter>(DATACENTERS[1]); // Frankfurt default

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/[0.08]">
      <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
        <div className="lg:max-w-md">
          <span className="text-xs uppercase tracking-widest text-[#a29bfe] font-mono font-bold flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            Global Edge Backbone
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight mt-2">
            Deploy Closest to Your Visitors Worldwide
          </h2>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            Our global tier-3 and tier-4 datacenters feature multi-gigabit redundant fiber links, LiteSpeed cache edge nodes, and hardware-level DDoS mitigation.
          </p>

          {/* Active Node Card */}
          <div className="mt-6 p-5 rounded-2xl bg-[#131422] border border-[#6c5ce7]/30 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#a29bfe]">
                  Selected Server Location
                </span>
                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{selectedDc.name}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </h4>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {selectedDc.pingMs} ms
                </span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-zinc-500 block">Region City:</span>
                <span className="font-medium text-zinc-200">{selectedDc.region}</span>
              </div>
              <div>
                <span className="text-zinc-500 block">Uptime SLA:</span>
                <span className="font-medium text-emerald-400">{selectedDc.uptime}</span>
              </div>
              <div className="col-span-2">
                <span className="text-zinc-500 block">Node Compute:</span>
                <span className="font-mono text-zinc-300 text-[11px]">{selectedDc.hardware}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Datacenter Selector Grid */}
        <div className="w-full lg:max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DATACENTERS.map((dc) => {
            const isSelected = selectedDc.id === dc.id;
            return (
              <button
                key={dc.id}
                onClick={() => setSelectedDc(dc)}
                className={`p-4 rounded-2xl text-left transition-all border ${
                  isSelected
                    ? "bg-[#181930] border-[#6c5ce7] shadow-lg shadow-[#6c5ce7]/20 scale-[1.01]"
                    : "bg-[#131422] border-white/[0.06] hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {dc.id}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {dc.pingMs}ms
                  </span>
                </div>
                <h5 className="font-bold text-white text-sm">{dc.name}</h5>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{dc.region}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
