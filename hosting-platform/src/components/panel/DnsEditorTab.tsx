"use client";

import { useState } from "react";
import { DnsRecord } from "@/data/hostingData";
import { Globe, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";

interface DnsEditorTabProps {
  records: DnsRecord[];
  activeDomain: string;
  onAddRecord: (record: Omit<DnsRecord, "id">) => void;
  onDeleteRecord: (id: string) => void;
}

export function DnsEditorTab({
  records,
  activeDomain,
  onAddRecord,
  onDeleteRecord,
}: DnsEditorTabProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [type, setType] = useState<"A" | "AAAA" | "CNAME" | "MX" | "TXT">("A");
  const [name, setName] = useState("@");
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState(3600);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onAddRecord({
      type,
      name: name.trim() || "@",
      content: content.trim(),
      ttl: Number(ttl) || 3600,
    });
    setContent("");
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#a29bfe]" />
            <span>DNS Zone Records Editor</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Configure global Anycast routing, subdomains, MX mail records, and verification TXT tags for <strong>{activeDomain}</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-1.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#6c5ce7]/30 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Record</span>
        </button>
      </div>

      {/* Add Record Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-5 rounded-2xl bg-[#141528] border border-[#6c5ce7]/40 shadow-xl animate-in fade-in">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Add New DNS Zone Record
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              >
                <option value="A">A (IPv4)</option>
                <option value="AAAA">AAAA (IPv6)</option>
                <option value="CNAME">CNAME (Alias)</option>
                <option value="MX">MX (Mail Exchange)</option>
                <option value="TXT">TXT (SPF / Verification)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Name / Host</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="@ or subdomain"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Content / Target</label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="IP address or host"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">TTL (Seconds)</label>
              <select
                value={ttl}
                onChange={(e) => setTtl(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              >
                <option value={1800}>1800 (30 min)</option>
                <option value={3600}>3600 (1 hour)</option>
                <option value={14400}>14400 (4 hours)</option>
                <option value={86400}>86400 (1 day)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#6c5ce7] text-white text-xs font-bold shadow-md shadow-[#6c5ce7]/30"
            >
              Save Record
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-2 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Records Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#131424] shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#101120] border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Content / Points To</th>
              <th className="py-3 px-4">TTL</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-zinc-200">
            {records.map((rec) => (
              <tr key={rec.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4 font-bold text-[#a29bfe]">
                  <span className="px-2 py-0.5 rounded bg-[#6c5ce7]/10 border border-[#6c5ce7]/20">
                    {rec.type}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-bold text-white">{rec.name}</td>
                <td className="py-3.5 px-4 text-zinc-300 truncate max-w-xs">{rec.content}</td>
                <td className="py-3.5 px-4 text-zinc-500">{rec.ttl}s</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onDeleteRecord(rec.id)}
                    className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
