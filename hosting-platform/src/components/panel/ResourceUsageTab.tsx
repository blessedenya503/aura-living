"use client";

import { Website } from "@/data/hostingData";
import { Cpu, HardDrive, Activity, Zap, CheckCircle2, Server } from "lucide-react";

interface ResourceUsageTabProps {
  activeSite: Website;
}

export function ResourceUsageTab({ activeSite }: ResourceUsageTabProps) {
  const metrics = [
    {
      title: "CPU Utilization",
      value: "18%",
      max: "200% (2 Cores)",
      pct: 18,
      color: "bg-[#6c5ce7]",
      desc: "Instantaneous compute consumption by PHP-FPM and web worker processes.",
      icon: Cpu,
    },
    {
      title: "Physical RAM Allocation",
      value: "742 MB",
      max: "2,048 MB (2 GB)",
      pct: 36,
      color: "bg-[#00cec9]",
      desc: "Resident memory currently used by active scripts, Redis object cache, and buffers.",
      icon: Activity,
    },
    {
      title: "NVMe Enterprise Storage",
      value: `${(activeSite.storageUsedMB / 1024).toFixed(2)} GB`,
      max: "100 GB",
      pct: (activeSite.storageUsedMB / (100 * 1024)) * 100,
      color: "bg-emerald-400",
      desc: "Disk space occupied by web files, assets, plugins, and MySQL tables.",
      icon: HardDrive,
    },
    {
      title: "Inode File Count",
      value: "34,210",
      max: "400,000 Inodes",
      pct: 8.5,
      color: "bg-indigo-400",
      desc: "Total count of individual files and folders on your filesystem.",
      icon: Server,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-3 border-b border-white/[0.08]">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#a29bfe]" />
          <span>Real-Time Resource Telemetry</span>
        </h2>
        <p className="text-xs text-zinc-400">
          Hardware metrics for your isolated container environment on <strong>{activeSite.domain}</strong>.
        </p>
      </div>

      {/* Main Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-[#131424] border border-white/10 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#a29bfe]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-white">{item.title}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">
                    {item.value}{" "}
                    <span className="text-zinc-500 font-normal">/ {item.max}</span>
                  </span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden mb-3">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(item.pct, 4)}%` }}
                  />
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Utilization:</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {item.pct.toFixed(1)}% (Healthy)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Process list */}
      <div className="p-5 rounded-2xl bg-[#131424] border border-white/10 shadow-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Active Daemon Processes (Linux cgroup)</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#101120] text-zinc-400 border-b border-white/[0.08]">
              <tr>
                <th className="py-2.5 px-3">PID</th>
                <th className="py-2.5 px-3">Process Name</th>
                <th className="py-2.5 px-3">CPU %</th>
                <th className="py-2.5 px-3">RAM</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] text-zinc-300">
              <tr>
                <td className="py-2.5 px-3 text-[#a29bfe]">10492</td>
                <td className="py-2.5 px-3 text-white font-bold">lsphp82 (master pool)</td>
                <td className="py-2.5 px-3">4.2%</td>
                <td className="py-2.5 px-3">142 MB</td>
                <td className="py-2.5 px-3 text-emerald-400">RUNNING</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-[#a29bfe]">10495</td>
                <td className="py-2.5 px-3 text-white font-bold">mysqld (worker-1)</td>
                <td className="py-2.5 px-3">6.8%</td>
                <td className="py-2.5 px-3">380 MB</td>
                <td className="py-2.5 px-3 text-emerald-400">RUNNING</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 text-[#a29bfe]">11024</td>
                <td className="py-2.5 px-3 text-white font-bold">redis-server (cache)</td>
                <td className="py-2.5 px-3">0.6%</td>
                <td className="py-2.5 px-3">54 MB</td>
                <td className="py-2.5 px-3 text-emerald-400">RUNNING</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
