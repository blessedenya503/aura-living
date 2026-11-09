import { Check, X, Zap, Cpu, Lock, RefreshCw, Layers } from "lucide-react";

export function ComparisonSection() {
  const comparisons = [
    {
      feature: "Web Server Architecture",
      novahost: "OpenLiteSpeed + LSCache (5x faster)",
      cpanel: "Traditional Apache (Legacy)",
      icon: Zap,
    },
    {
      feature: "Storage Technology",
      novahost: "NVMe Gen4 Enterprise SSDs",
      cpanel: "Standard SATA SSD or Hybrid HDD",
      icon: Cpu,
    },
    {
      feature: "Control Panel Experience",
      novahost: "NovaPanel (Custom, modern, 0.4s load)",
      cpanel: "cPanel (Cluttered 1990s UI, slow)",
      icon: Layers,
    },
    {
      feature: "SSL Security Certificates",
      novahost: "Automated Lifetime Let's Encrypt",
      cpanel: "Often $89.99/yr extra or manual config",
      icon: Lock,
    },
    {
      feature: "WordPress Staging & Git Sync",
      novahost: "1-Click automated staging & git webhooks",
      cpanel: "Requires manual FTP/MySQL export",
      icon: RefreshCw,
    },
  ];

  return (
    <section id="comparison" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-widest text-[#00cec9] font-mono font-bold">
          Performance Benchmarks
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
          Why NovaHost Leaves Legacy Hosts Behind
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base mt-2">
          Engineered from the ground up for raw speed, high concurrency, and unmatched user simplicity.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#131422] shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="py-5 px-6 text-sm font-bold text-zinc-400 uppercase tracking-wider">
                Feature / Spec
              </th>
              <th className="py-5 px-6 text-sm font-bold text-white bg-[#6c5ce7]/10 border-x border-[#6c5ce7]/20">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#6c5ce7]" />
                  <span className="text-[#a29bfe] font-black">NovaHost (Next-Gen)</span>
                </div>
              </th>
              <th className="py-5 px-6 text-sm font-bold text-zinc-400">
                Traditional cPanel Hosts
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-sm">
            {comparisons.map((row, index) => {
              const Icon = row.icon;
              return (
                <tr key={index} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-semibold text-zinc-200 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[#a29bfe] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span>{row.feature}</span>
                  </td>
                  <td className="py-4 px-6 bg-[#6c5ce7]/5 border-x border-[#6c5ce7]/20 font-medium text-emerald-400">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{row.novahost}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-zinc-400 font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                        <X className="w-3.5 h-3.5" />
                      </div>
                      <span>{row.cpanel}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
