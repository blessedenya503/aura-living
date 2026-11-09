"use client";

import { useState } from "react";
import { Mail, Plus, ExternalLink, Trash2, Key, Check } from "lucide-react";

interface EmailAccount {
  id: string;
  address: string;
  quotaUsedMB: number;
  quotaMaxMB: number;
}

export function EmailsTab({ activeDomain }: { activeDomain: string }) {
  const [emails, setEmails] = useState<EmailAccount[]>([
    { id: "e-1", address: `admin@${activeDomain}`, quotaUsedMB: 48, quotaMaxMB: 5000 },
    { id: "e-2", address: `support@${activeDomain}`, quotaUsedMB: 124, quotaMaxMB: 5000 },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [userPart, setUserPart] = useState("");
  const [password, setPassword] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPart.trim()) return;
    const newAddress = `${userPart.trim()}@${activeDomain}`;
    setEmails([...emails, { id: `e-${Date.now()}`, address: newAddress, quotaUsedMB: 0, quotaMaxMB: 5000 }]);
    setUserPart("");
    setPassword("");
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setEmails(emails.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#00cec9]" />
            <span>Custom Domain Email Accounts</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Create professional business mailboxes on <strong>@{activeDomain}</strong> with DKIM, SPF & webmail access.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-1.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#6c5ce7]/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Email Account</span>
          </button>
        </div>
      </div>

      {/* Create email form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-[#141528] border border-[#6c5ce7]/40 shadow-xl animate-in fade-in">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Create New Mailbox
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Mailbox Address</label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={userPart}
                  onChange={(e) => setUserPart(e.target.value)}
                  placeholder="e.g. contact"
                  className="flex-1 px-3 py-2 rounded-l-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                />
                <span className="px-3 py-2 rounded-r-xl bg-white/5 border border-l-0 border-white/10 text-xs font-mono text-zinc-400">
                  @{activeDomain}
                </span>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Mailbox Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Strong password"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#6c5ce7] text-white text-xs font-bold"
            >
              Provision Mailbox
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

      {/* Email accounts list */}
      <div className="bg-[#131424] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="divide-y divide-white/[0.06]">
          {emails.map((acc) => (
            <div key={acc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00cec9]/10 border border-[#00cec9]/20 flex items-center justify-center text-[#00cec9]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-mono">{acc.address}</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Storage: <strong className="text-zinc-200">{acc.quotaUsedMB} MB</strong> / {acc.quotaMaxMB} MB
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => alert(`Launching Webmail roundcube client for ${acc.address}`)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
                >
                  <span>Open Webmail</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(acc.id)}
                  className="p-1.5 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Delete Mailbox"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
