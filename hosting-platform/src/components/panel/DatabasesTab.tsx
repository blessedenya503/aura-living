"use client";

import { useState } from "react";
import { DatabaseRecord } from "@/data/hostingData";
import { Database, Plus, Terminal, Play, Check, Trash2, KeyRound, Server } from "lucide-react";

interface DatabasesTabProps {
  databases: DatabaseRecord[];
  onCreateDatabase: (name: string, user: string, engine: "MySQL 8.0" | "PostgreSQL 16") => void;
  onDeleteDatabase: (id: string) => void;
}

export function DatabasesTab({
  databases,
  onCreateDatabase,
  onDeleteDatabase,
}: DatabasesTabProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [dbName, setDbName] = useState("");
  const [dbUser, setDbUser] = useState("");
  const [engine, setEngine] = useState<"MySQL 8.0" | "PostgreSQL 16">("MySQL 8.0");

  // SQL Console state
  const [sqlQuery, setSqlQuery] = useState("SELECT id, username, email, created_at FROM wp_users LIMIT 5;");
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [isRunningQuery, setIsRunningQuery] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dbName.trim() || !dbUser.trim()) return;
    onCreateDatabase(dbName.trim(), dbUser.trim(), engine);
    setDbName("");
    setDbUser("");
    setIsCreating(false);
  };

  const runSampleQuery = () => {
    setIsRunningQuery(true);
    setTimeout(() => {
      setIsRunningQuery(false);
      setQueryResult([
        { id: 1, username: "admin", email: "admin@novashop-prod.com", created_at: "2026-10-12 14:22:01" },
        { id: 2, username: "sarah_editor", email: "sarah@novashop-prod.com", created_at: "2026-10-15 09:11:45" },
        { id: 3, username: "dev_ops", email: "ops@novahost.cloud", created_at: "2026-11-01 18:04:12" },
      ]);
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-[#00cec9]" />
            <span>Database Studio (MySQL & PostgreSQL)</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Create multi-tenant relational databases, configure users, and execute SQL queries.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-3.5 py-1.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#6c5ce7]/30 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Database</span>
        </button>
      </div>

      {/* Create Database Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-[#141528] border border-[#6c5ce7]/40 shadow-xl animate-in fade-in">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
            Create Managed Database
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Database Name</label>
              <input
                type="text"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
                placeholder="e.g. nova_app_db"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Database User</label>
              <input
                type="text"
                value={dbUser}
                onChange={(e) => setDbUser(e.target.value)}
                placeholder="e.g. u849204_user"
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-zinc-400 block mb-1">Engine</label>
              <select
                value={engine}
                onChange={(e) => setEngine(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
              >
                <option value="MySQL 8.0">MySQL 8.0</option>
                <option value="PostgreSQL 16">PostgreSQL 16</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#6c5ce7] text-white text-xs font-bold shadow-md shadow-[#6c5ce7]/30"
            >
              Provision Database
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-3 py-2 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Databases List */}
      <div className="bg-[#131424] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-[#101120] border-b border-white/[0.08] text-xs font-bold text-zinc-400 uppercase tracking-wider">
          Active Database Instances
        </div>
        <div className="divide-y divide-white/[0.06]">
          {databases.map((db) => (
            <div key={db.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#6c5ce7]/10 border border-[#6c5ce7]/20 flex items-center justify-center text-[#a29bfe]">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">{db.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {db.engine}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-3">
                    <span>User: <strong className="text-zinc-200 font-mono">{db.user}</strong></span>
                    <span>•</span>
                    <span>Host: <strong className="text-zinc-200 font-mono">{db.host}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <span className="font-bold text-white block">{db.sizeMB} MB</span>
                  <span className="text-[10px] text-zinc-500">{db.tablesCount} tables</span>
                </div>
                <button
                  onClick={() => onDeleteDatabase(db.id)}
                  className="p-2 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Drop Database"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SQL Query Console */}
      <div className="p-5 rounded-2xl bg-[#0e0f1a] border border-white/10 shadow-xl">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#a29bfe]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Interactive SQL Console (phpMyAdmin replacement)
            </h3>
          </div>
          <button
            onClick={runSampleQuery}
            disabled={isRunningQuery}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-emerald-600/30"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isRunningQuery ? "Executing..." : "Run Query"}</span>
          </button>
        </div>

        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          rows={3}
          className="w-full bg-[#07080e] text-emerald-400 font-mono text-xs p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#6c5ce7] resize-none mb-4"
        />

        {/* Results table */}
        {queryResult && (
          <div className="overflow-x-auto rounded-xl border border-white/10 bg-[#07080e]">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-white/5 border-b border-white/10 text-zinc-400">
                <tr>
                  <th className="p-2.5">id</th>
                  <th className="p-2.5">username</th>
                  <th className="p-2.5">email</th>
                  <th className="p-2.5">created_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-200">
                {queryResult.map((row) => (
                  <tr key={row.id} className="hover:bg-white/[0.02]">
                    <td className="p-2.5 font-bold text-[#a29bfe]">{row.id}</td>
                    <td className="p-2.5">{row.username}</td>
                    <td className="p-2.5 text-zinc-400">{row.email}</td>
                    <td className="p-2.5 text-zinc-500">{row.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
