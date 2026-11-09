"use client";

import { useState } from "react";
import {
  Rocket,
  CheckCircle2,
  Terminal,
  Loader2,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface AppTemplate {
  id: string;
  name: string;
  category: string;
  version: string;
  iconBg: string;
  desc: string;
}

const APP_TEMPLATES: AppTemplate[] = [
  {
    id: "wordpress",
    name: "WordPress",
    category: "CMS & E-Commerce",
    version: "v6.7.1",
    iconBg: "bg-blue-600",
    desc: "The world's most popular CMS with automated LiteSpeed cache optimization.",
  },
  {
    id: "nextjs",
    name: "Next.js 15",
    category: "Modern React",
    version: "v15.1.0",
    iconBg: "bg-zinc-800",
    desc: "Production-grade React framework with hybrid static & server rendering.",
  },
  {
    id: "nodejs",
    name: "Node.js Express",
    category: "Backend API",
    version: "Node 20 LTS",
    iconBg: "bg-emerald-600",
    desc: "Ultra-fast REST API microservice with PM2 process manager configured.",
  },
  {
    id: "laravel",
    name: "Laravel",
    category: "PHP Framework",
    version: "v11.2",
    iconBg: "bg-rose-600",
    desc: "Full-featured web application framework with Composer & Artisan integration.",
  },
  {
    id: "python",
    name: "Python Flask",
    category: "Microservice",
    version: "Python 3.12",
    iconBg: "bg-amber-600",
    desc: "Lightweight WSGI Python application with virtualenv and Gunicorn proxy.",
  },
  {
    id: "static",
    name: "Static HTML5 & Tailwind",
    category: "Static Site",
    version: "HTML5",
    iconBg: "bg-indigo-600",
    desc: "Clean static webroot ready for HTML, CSS, JavaScript, and asset hosting.",
  },
];

interface AutoInstallerTabProps {
  activeDomain: string;
  activeSlug: string;
  onDeploySuccess: (appName: string) => void;
}

export function AutoInstallerTab({ activeDomain, activeSlug, onDeploySuccess }: AutoInstallerTabProps) {
  const [selectedApp, setSelectedApp] = useState<AppTemplate>(APP_TEMPLATES[0]);
  const [siteTitle, setSiteTitle] = useState("My Awesome Site");
  const [adminUser, setAdminUser] = useState("admin");
  const [adminPass, setAdminPass] = useState("SuperSecret2026!");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [deployFinished, setDeployFinished] = useState(false);

  const startDeployment = () => {
    setIsDeploying(true);
    setDeployFinished(false);
    setDeployStep(1);
    setDeployLogs([`[00:01] Initializing deployment for ${selectedApp.name} (${selectedApp.version})...`]);

    setTimeout(() => {
      setDeployStep(2);
      setDeployLogs((prev) => [
        ...prev,
        `[00:02] Provisioning isolated Linux cgroup & memory sandbox (1.5 GB limit)...`,
      ]);
    }, 900);

    setTimeout(() => {
      setDeployStep(3);
      setDeployLogs((prev) => [
        ...prev,
        `[00:03] Creating database schema & generating secure MySQL credentials...`,
      ]);
    }, 1800);

    setTimeout(() => {
      setDeployStep(4);
      setDeployLogs((prev) => [
        ...prev,
        `[00:04] Fetching release tarball, extracting files to /public_html...`,
        `[00:05] Generating automated Let's Encrypt SSL certificate for ${activeDomain}...`,
      ]);
    }, 2800);

    setTimeout(() => {
      setDeployStep(5);
      setDeployLogs((prev) => [
        ...prev,
        `[00:06] Reloading LiteSpeed vHost gracefully...`,
        `[00:07] SUCCESS: ${selectedApp.name} is now live and listening on HTTPS!`,
      ]);
      setIsDeploying(false);
      setDeployFinished(true);
      onDeploySuccess(selectedApp.name);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Rocket className="w-5 h-5 text-[#6c5ce7]" />
          <span>1-Click Auto App Installer</span>
        </h2>
        <p className="text-xs text-zinc-400">
          Deploy WordPress, Next.js, Node.js, or Laravel onto <strong>{activeDomain}</strong> in seconds.
        </p>
      </div>

      {/* App selection cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {APP_TEMPLATES.map((app) => {
          const isSelected = selectedApp.id === app.id;
          return (
            <button
              key={app.id}
              onClick={() => {
                if (!isDeploying) {
                  setSelectedApp(app);
                  setDeployFinished(false);
                }
              }}
              className={`p-4 rounded-2xl text-left border transition-all ${
                isSelected
                  ? "bg-[#181932] border-[#6c5ce7] shadow-lg shadow-[#6c5ce7]/20"
                  : "bg-[#131424] border-white/[0.06] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${app.iconBg}`} />
                  {app.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-400 px-1.5 py-0.5 rounded bg-white/5">
                  {app.version}
                </span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2">{app.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Deployment Form & Live Terminal */}
      <div className="p-6 rounded-3xl bg-[#131424] border border-white/10 shadow-2xl">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#a29bfe]" />
          <span>Configuration for {selectedApp.name}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Website Title
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              disabled={isDeploying}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Admin Username
            </label>
            <input
              type="text"
              value={adminUser}
              onChange={(e) => setAdminUser(e.target.value)}
              disabled={isDeploying}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
              Admin Password
            </label>
            <input
              type="text"
              value={adminPass}
              onChange={(e) => setAdminPass(e.target.value)}
              disabled={isDeploying}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#6c5ce7]"
            />
          </div>
        </div>

        {/* Deploy Trigger Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={startDeployment}
            disabled={isDeploying}
            className="px-6 py-3 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-[#6c5ce7]/30 flex items-center gap-2"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deploying {selectedApp.name}...</span>
              </>
            ) : (
              <>
                <Rocket className="w-4 h-4" />
                <span>Install {selectedApp.name} Now</span>
              </>
            )}
          </button>
          <span className="text-xs text-zinc-500">
            Destination: <strong className="text-zinc-300">/home/u849204/public_html</strong>
          </span>
        </div>

        {/* Live Terminal Output */}
        {(isDeploying || deployLogs.length > 0) && (
          <div className="mt-6 rounded-2xl bg-[#090a12] border border-white/10 p-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.08] text-zinc-400 text-[11px]">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>NovaHost Orchestrator v2.4 (cgroup-container)</span>
              </div>
              <span>Status: {deployFinished ? "COMPLETED" : "RUNNING"}</span>
            </div>

            <div className="space-y-1.5 text-zinc-300">
              {deployLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`${
                    log.includes("SUCCESS")
                      ? "text-emerald-400 font-bold"
                      : "text-zinc-300"
                  }`}
                >
                  {log}
                </div>
              ))}
              {isDeploying && (
                <div className="flex items-center gap-2 text-[#a29bfe] animate-pulse">
                  <span>&gt; Processing stage {deployStep}/5...</span>
                </div>
              )}
            </div>

            {deployFinished && (
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Your site is live!
                </span>
                <a
                  href={`/live/${activeSlug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <span>Open Live Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
