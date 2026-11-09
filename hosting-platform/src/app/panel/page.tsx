"use client";

import { useState, useEffect } from "react";
import {
  INITIAL_WEBSITES,
  INITIAL_FILES,
  INITIAL_DATABASES,
  INITIAL_DNS_RECORDS,
  Website,
  FileItem,
  DatabaseRecord,
  DnsRecord,
} from "@/data/hostingData";
import { PanelHeader } from "@/components/panel/PanelHeader";
import { PanelSidebar, PanelTab } from "@/components/panel/PanelSidebar";
import { OverviewTab } from "@/components/panel/OverviewTab";
import { WebsitesTab } from "@/components/panel/WebsitesTab";
import { FileManagerTab } from "@/components/panel/FileManagerTab";
import { DatabasesTab } from "@/components/panel/DatabasesTab";
import { AutoInstallerTab } from "@/components/panel/AutoInstallerTab";
import { DnsEditorTab } from "@/components/panel/DnsEditorTab";
import { SecurityTab } from "@/components/panel/SecurityTab";
import { ResourceUsageTab } from "@/components/panel/ResourceUsageTab";
import { EmailsTab } from "@/components/panel/EmailsTab";
import { BillingTab } from "@/components/panel/BillingTab";
import { X, Plus, Globe, Sparkles, Rocket } from "lucide-react";

export default function PanelPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [activeSite, setActiveSite] = useState<Website | null>(null);
  const [currentTab, setCurrentTab] = useState<PanelTab>("overview");

  // Files, DBs, DNS state
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [databases, setDatabases] = useState<DatabaseRecord[]>(INITIAL_DATABASES);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>(INITIAL_DNS_RECORDS);

  // Deploy Website Modal
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [newDomainInput, setNewDomainInput] = useState("");
  const [newAppType, setNewAppType] = useState<"WordPress" | "Next.js" | "Node.js" | "Static HTML" | "Laravel">("Static HTML");

  // Load real sites from disk on mount
  useEffect(() => {
    async function loadRealSites() {
      try {
        const res = await fetch("/api/sites");
        const data = await res.json();
        if (data.success && data.sites && data.sites.length > 0) {
          const mapped: Website[] = data.sites.map((s: any) => ({
            id: s.slug,
            slug: s.slug,
            domain: s.domain,
            title: s.title,
            type: s.type,
            phpVersion: s.phpVersion,
            status: s.status,
            sslActive: true,
            ip: "127.0.0.1",
            storageUsedMB: Number((s.storageBytes / (1024 * 1024)).toFixed(2)) || 1.2,
            bandwidthUsedGB: 0.5,
            createdAt: s.createdAt,
          }));
          setWebsites(mapped);
          setActiveSite(mapped[0]);
        }
      } catch (err) {
        console.error("Failed to load real sites from disk:", err);
      }
    }
    loadRealSites();
  }, []);

  // Load real files from disk whenever activeSite changes
  useEffect(() => {
    if (!activeSite?.slug) return;
    async function loadFiles() {
      try {
        const res = await fetch(`/api/sites/${activeSite.slug}/files`);
        const data = await res.json();
        if (data.success && data.files) {
          setFiles(data.files);
        }
      } catch (err) {
        console.error("Failed to load real files:", err);
      }
    }
    loadFiles();
  }, [activeSite?.slug]);

  // Handler: Toggle SSL
  const handleToggleSsl = () => {
    setActiveSite((prev) => ({
      ...prev,
      sslActive: !prev.sslActive,
    }));
    setWebsites((prev) =>
      prev.map((site) =>
        site.id === activeSite.id ? { ...site, sslActive: !site.sslActive } : site
      )
    );
  };

  // Handler: Read real file content
  const handleOpenFileContent = async (fileName: string): Promise<string> => {
    try {
      const res = await fetch(`/api/sites/${activeSite.slug}/files?file=${fileName}`);
      const data = await res.json();
      return data.content || "";
    } catch {
      return "";
    }
  };

  // Handler: Save File Content to real disk
  const handleSaveFileContent = async (fileName: string, content: string) => {
    try {
      await fetch(`/api/sites/${activeSite.slug}/files`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fileName, content }),
      });
      // Re-fetch files
      const res = await fetch(`/api/sites/${activeSite.slug}/files`);
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  // Handler: Create File on real disk
  const handleCreateFile = async (name: string, content: string) => {
    try {
      await fetch(`/api/sites/${activeSite.slug}/files`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content }),
      });
      const res = await fetch(`/api/sites/${activeSite.slug}/files`);
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch (err) {
      console.error("Create file error:", err);
    }
  };

  // Handler: Delete File from real disk
  const handleDeleteFile = async (fileName: string) => {
    try {
      await fetch(`/api/sites/${activeSite.slug}/files?file=${fileName}`, {
        method: "DELETE",
      });
      const res = await fetch(`/api/sites/${activeSite.slug}/files`);
      const data = await res.json();
      if (data.files) setFiles(data.files);
    } catch (err) {
      console.error("Delete file error:", err);
    }
  };

  // Handler: Create Database
  const handleCreateDatabase = (name: string, user: string, engine: "MySQL 8.0" | "PostgreSQL 16") => {
    const newDb: DatabaseRecord = {
      id: `db-${Date.now()}`,
      name,
      user,
      host: engine.includes("MySQL") ? "localhost:3306" : "localhost:5432",
      sizeMB: 0.1,
      tablesCount: 0,
      engine,
    };
    setDatabases((prev) => [newDb, ...prev]);
  };

  // Handler: Delete Database
  const handleDeleteDatabase = (id: string) => {
    setDatabases((prev) => prev.filter((db) => db.id !== id));
  };

  // Handler: Add DNS Record
  const handleAddDnsRecord = (record: Omit<DnsRecord, "id">) => {
    const newRecord: DnsRecord = {
      id: `dns-${Date.now()}`,
      ...record,
    };
    setDnsRecords((prev) => [...prev, newRecord]);
  };

  // Handler: Delete DNS Record
  const handleDeleteDnsRecord = (id: string) => {
    setDnsRecords((prev) => prev.filter((r) => r.id !== id));
  };

  // Handler: Change PHP Version
  const handleChangePhpVersion = (siteId: string, version: string) => {
    setWebsites((prev) =>
      prev.map((s) => (s.id === siteId ? { ...s, phpVersion: version } : s))
    );
    if (activeSite.id === siteId) {
      setActiveSite((prev) => ({ ...prev, phpVersion: version }));
    }
  };

  // Handler: Add New Website on real disk!
  const handleDeployNewSite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainInput.trim()) return;

    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDomainInput.trim(), type: newAppType }),
      });
      const data = await res.json();
      if (data.success && data.site) {
        const s = data.site;
        const newSiteObj: Website = {
          id: s.slug,
          slug: s.slug,
          domain: s.domain,
          title: s.title,
          type: s.type,
          phpVersion: s.phpVersion,
          status: "active",
          sslActive: true,
          ip: "127.0.0.1",
          storageUsedMB: 0.2,
          bandwidthUsedGB: 0.1,
          createdAt: s.createdAt,
        };
        setWebsites((prev) => [newSiteObj, ...prev]);
        setActiveSite(newSiteObj);
        setNewDomainInput("");
        setIsDeployModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to deploy real site:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0c14] text-[#f1f2f8] flex flex-col">
      {/* Top Header Bar */}
      <PanelHeader
        websites={websites}
        activeSite={activeSite}
        onSelectSite={(site) => setActiveSite(site)}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <PanelSidebar
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          activeDomain={activeSite ? activeSite.domain : "No Site Selected"}
          activeSlug={activeSite ? activeSite.slug : ""}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-6xl">
          {!activeSite && currentTab !== "billing" ? (
            <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
              <div className="w-16 h-16 rounded-3xl bg-[#6c5ce7]/20 border border-[#6c5ce7]/40 flex items-center justify-center text-[#a29bfe] mb-4 shadow-xl shadow-[#6c5ce7]/20">
                <Rocket className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">Clean Slate • Ready to Host</h2>
              <p className="text-zinc-400 text-sm max-w-md mb-6 leading-relaxed">
                Your hosting server is completely clean and empty. Click below to deploy your first real website onto your drive and the worldwide web!
              </p>
              <button
                onClick={() => setIsDeployModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] text-white font-bold text-sm shadow-xl shadow-[#6c5ce7]/30 flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Deploy Your First Website</span>
              </button>
            </div>
          ) : (
            <>
              {currentTab === "overview" && activeSite && (
                <OverviewTab
                  activeSite={activeSite}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                  onToggleSsl={handleToggleSsl}
                />
              )}

              {currentTab === "websites" && (
                <WebsitesTab
                  websites={websites}
                  activeSite={activeSite!}
                  onSelectSite={(site) => setActiveSite(site)}
                  onOpenDeployModal={() => setIsDeployModalOpen(true)}
                  onChangePhpVersion={handleChangePhpVersion}
                />
              )}

              {currentTab === "filemanager" && activeSite && (
                <FileManagerTab
                  files={files}
                  onSaveFileContent={handleSaveFileContent}
                  onCreateFile={handleCreateFile}
                  onDeleteFile={handleDeleteFile}
                  onOpenFileContent={handleOpenFileContent}
                />
              )}

              {currentTab === "databases" && (
                <DatabasesTab
                  databases={databases}
                  onCreateDatabase={handleCreateDatabase}
                  onDeleteDatabase={handleDeleteDatabase}
                />
              )}

              {currentTab === "installer" && activeSite && (
                <AutoInstallerTab
                  activeDomain={activeSite.domain}
                  activeSlug={activeSite.slug}
                  onDeploySuccess={(appName) => {
                    setActiveSite((prev) => (prev ? { ...prev, type: appName } : null));
                  }}
                />
              )}

              {currentTab === "dns" && activeSite && (
                <DnsEditorTab
                  records={dnsRecords}
                  activeDomain={activeSite.domain}
                  onAddRecord={handleAddDnsRecord}
                  onDeleteRecord={handleDeleteDnsRecord}
                />
              )}

              {currentTab === "security" && activeSite && (
                <SecurityTab
                  activeDomain={activeSite.domain}
                  sslActive={activeSite.sslActive}
                  onToggleSsl={handleToggleSsl}
                />
              )}

              {currentTab === "resources" && activeSite && (
                <ResourceUsageTab activeSite={activeSite} />
              )}

              {currentTab === "emails" && activeSite && (
                <EmailsTab activeDomain={activeSite.domain} />
              )}
            </>
          )}

          {currentTab === "billing" && <BillingTab />}
        </main>
      </div>

      {/* Deploy New Website Modal */}
      {isDeployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#131424] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setIsDeployModalOpen(false)}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-[#6c5ce7] flex items-center justify-center text-white">
                <Globe className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold text-white">Add New Domain / Website</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-5">
              Instantly create a real physical folder on your hard drive with live HTML & CSS serving!
            </p>

            <form onSubmit={handleDeployNewSite} className="space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Site Name / Slug
                </label>
                <input
                  type="text"
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  placeholder="e.g. my-crypto-shop"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#6c5ce7]"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Application Stack
                </label>
                <select
                  value={newAppType}
                  onChange={(e) => setNewAppType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
                >
                  <option value="Static HTML5">Static HTML5 + Responsive CSS</option>
                  <option value="WordPress">WordPress 6.7 + LiteSpeed Cache</option>
                  <option value="Next.js">Next.js 15 (Node 20 LTS)</option>
                  <option value="Node.js">Node.js Express API</option>
                  <option value="Laravel">Laravel 11 (PHP 8.2)</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!newDomainInput.trim()}
                  className="w-full py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-[#6c5ce7]/30 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Provision Real Physical Site</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
