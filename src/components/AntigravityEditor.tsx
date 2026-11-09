"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileCode,
  Folder,
  FolderOpen,
  Save,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Search,
  ExternalLink,
  Code2,
  Send,
  Loader2,
  Eye,
  Maximize2,
  Minimize2,
  Zap,
} from "lucide-react";

interface FileNode {
  name: string;
  path: string;
  type: "file" | "directory";
  size?: number;
  updatedAt?: string;
  children?: FileNode[];
}

interface ChatMessage {
  sender: "user" | "antigravity";
  text: string;
  timestamp: string;
  updatedContent?: string;
}

export default function AntigravityEditor() {
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    src: true,
    "src/app": true,
    "src/components": true,
    "src/lib": true,
  });
  const [activeFilePath, setActiveFilePath] = useState<string>("src/app/page.tsx");
  const [fileContent, setFileContent] = useState<string>("");
  const [originalContent, setOriginalContent] = useState<string>("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  // Mobile responsive active panel ("files" | "editor" | "ai" | "preview")
  const [mobilePanel, setMobilePanel] = useState<"files" | "editor" | "ai" | "preview">("editor");

  // Search in files
  const [fileFilter, setFileFilter] = useState("");

  // Editor display settings
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewTab, setPreviewTab] = useState<"storefront" | "track">("storefront");

  // Antigravity AI Assistant state
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChatHistory, setAiChatHistory] = useState<ChatMessage[]>([
    {
      sender: "antigravity",
      text: "👋 Antigravity Engine ready. Select any file to inspect or edit, use the quick AI Commands, or ask me to refactor code or update store settings.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Terminal & execution logs
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[Antigravity Runtime] Kernel v2.0 initialized.",
    "[Antigravity Runtime] Connected to AURA SKIN Workspace + Neon Cloud Sync.",
  ]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Load Directory Tree
  const fetchTree = async () => {
    try {
      const res = await fetch("/api/admin/antigravity-editor?action=tree", { credentials: "include" });
      const data = await res.json();
      if (data.success && data.tree) {
        setFileTree(data.tree);
      }
    } catch {
      setStatusMsg({ text: "Failed to load project directory tree", type: "error" });
    }
  };

  // Load a file's content
  const loadFile = async (filePath: string) => {
    setIsLoadingFile(true);
    setStatusMsg(null);
    setMobilePanel("editor");
    try {
      const res = await fetch(`/api/admin/antigravity-editor?action=read&path=${encodeURIComponent(filePath)}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setActiveFilePath(filePath);
        setFileContent(data.content);
        setOriginalContent(data.content);
        setTerminalLogs((prev) => [
          ...prev.slice(-30),
          `[Antigravity Buffer] Opened ${filePath} (${(data.content.length / 1024).toFixed(1)} KB)`,
        ]);
      } else {
        setStatusMsg({ text: data.error || "Could not read file", type: "error" });
      }
    } catch {
      setStatusMsg({ text: "Network error reading file", type: "error" });
    } finally {
      setIsLoadingFile(false);
    }
  };

  // Save current file
  const handleSaveFile = async () => {
    if (!activeFilePath) return;
    setIsSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/admin/antigravity-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "save",
          path: activeFilePath,
          content: fileContent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOriginalContent(fileContent);
        setStatusMsg({ text: `✓ Saved ${activeFilePath}`, type: "success" });
        setTerminalLogs((prev) => [
          ...prev.slice(-30),
          `[Hot Reload] File saved: ${activeFilePath} @ ${new Date().toLocaleTimeString()}`,
        ]);
        setTimeout(() => setStatusMsg(null), 3500);
      } else {
        setStatusMsg({ text: data.error || "Save failed", type: "error" });
      }
    } catch {
      setStatusMsg({ text: "Failed to communicate with save handler", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Quick Antigravity AI Code Assist
  const handleSendAiPrompt = async (customPrompt?: string) => {
    const promptToSend = customPrompt || aiPrompt;
    if (!promptToSend.trim() || isAiLoading) return;

    setMobilePanel("ai");

    const userMessage: ChatMessage = {
      sender: "user",
      text: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setAiChatHistory((prev) => [...prev, userMessage]);
    if (!customPrompt) setAiPrompt("");
    setIsAiLoading(true);

    try {
      const res = await fetch("/api/admin/antigravity-editor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          action: "ai_assist",
          path: activeFilePath,
          content: fileContent,
          prompt: promptToSend,
        }),
      });

      if (res.status === 401) {
        setAiChatHistory((prev) => [
          ...prev,
          {
            sender: "antigravity",
            text: "⚠️ Session expired or not signed in. Please refresh your Owner Portal tab or log in at /owner-portal/login.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
        return;
      }

      const data = await res.json();
      if (data.success && data.answer) {
        if (typeof data.updatedContent === "string") {
          setFileContent(data.updatedContent);
        }
        setAiChatHistory((prev) => [
          ...prev,
          {
            sender: "antigravity",
            text: data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            updatedContent: data.updatedContent,
          },
        ]);
        setTerminalLogs((prev) => [
          ...prev.slice(-30),
          `[Antigravity AI] Completed task: "${promptToSend.slice(0, 40)}..."`,
        ]);
      } else {
        setAiChatHistory((prev) => [
          ...prev,
          {
            sender: "antigravity",
            text: `⚠️ ${data.error || "Failed to generate AI response"}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }
    } catch {
      setAiChatHistory((prev) => [
        ...prev,
        {
          sender: "antigravity",
          text: "⚠️ Connection error to Antigravity AI engine.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsAiLoading(false);
      setTimeout(() => {
        if (chatScrollRef.current) {
          chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  // Keyboard shortcut Ctrl+S or Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSaveFile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeFilePath, fileContent]);

  useEffect(() => {
    fetchTree();
    loadFile("src/app/page.tsx");
  }, []);

  const toggleFolder = (path: string) => {
    setOpenFolders((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  // Render tree recursively
  const renderTree = (nodes: FileNode[]) => {
    return nodes
      .filter((n) => !fileFilter || n.name.toLowerCase().includes(fileFilter.toLowerCase()) || n.type === "directory")
      .map((node) => {
        if (node.type === "directory") {
          const isOpen = Boolean(openFolders[node.path]);
          return (
            <div key={node.path} className="text-xs">
              <button
                onClick={() => toggleFolder(node.path)}
                className="w-full flex items-center gap-1.5 px-2 py-1.5 text-slate-300 hover:text-white hover:bg-slate-800/60 rounded cursor-pointer transition-colors text-left"
              >
                {isOpen ? (
                  <FolderOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <Folder className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
                )}
                <span className="font-medium truncate">{node.name}</span>
              </button>
              {isOpen && node.children && (
                <div className="pl-3.5 border-l border-slate-800/80 ml-2 mt-0.5 space-y-0.5">
                  {renderTree(node.children)}
                </div>
              )}
            </div>
          );
        }

        const isActive = activeFilePath === node.path;
        const isModified = isActive && fileContent !== originalContent;

        return (
          <button
            key={node.path}
            onClick={() => loadFile(node.path)}
            className={`w-full flex items-center justify-between gap-1.5 px-2 py-1.5 rounded cursor-pointer transition-colors text-left text-xs ${
              isActive
                ? "bg-indigo-600/30 text-indigo-200 font-semibold border-l-2 border-indigo-400"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <FileCode className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
              <span className="truncate">{node.name}</span>
            </div>
            {isModified && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />}
          </button>
        );
      });
  };

  const lineCount = fileContent.split("\n").length;
  const isDirty = fileContent !== originalContent;

  return (
    <div
      className={`bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 ${
        isFullscreen ? "fixed inset-2 sm:inset-4 z-50 h-[calc(100dvh-1rem)] sm:h-[calc(100vh-2rem)]" : "h-[760px] sm:h-[850px] w-full"
      }`}
    >
      {/* Top Header / Antigravity Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">Antigravity Studio</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                v2.0
              </span>
              <span className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Sync
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate max-w-[180px] sm:max-w-md">
              {activeFilePath || "No file selected"}{" "}
              {isDirty && <span className="text-amber-400 font-bold">• modified</span>}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {statusMsg && (
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                statusMsg.type === "success"
                  ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
              }`}
            >
              {statusMsg.type === "success" ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <button
            onClick={() => handleSaveFile()}
            disabled={isSaving}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
              isDirty
                ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-emerald-500/30"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save</span>
          </button>

          <button
            onClick={() => setShowLivePreview(!showLivePreview)}
            className={`hidden lg:flex px-3 py-1.5 rounded-lg text-xs font-semibold items-center gap-1.5 transition-all cursor-pointer ${
              showLivePreview
                ? "bg-purple-600 text-white shadow-purple-500/30 shadow-md"
                : "bg-slate-800 text-slate-300 hover:text-white"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-purple-300" />
            <span>{showLivePreview ? "Hide Preview" : "Split Preview"}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile View Switcher Bar (Visible on screens < lg so panels never crush each other) */}
      <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-2 py-1.5 grid grid-cols-4 gap-1 shrink-0">
        <button
          type="button"
          onClick={() => setMobilePanel("files")}
          className={`py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
            mobilePanel === "files"
              ? "bg-indigo-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Folder className="w-3.5 h-3.5" />
          <span>Files</span>
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel("editor")}
          className={`py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
            mobilePanel === "editor"
              ? "bg-indigo-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Editor</span>
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel("ai")}
          className={`py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
            mobilePanel === "ai"
              ? "bg-purple-600 text-white"
              : "bg-slate-900 text-purple-300 hover:text-white"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Agent</span>
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel("preview")}
          className={`py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
            mobilePanel === "preview"
              ? "bg-emerald-600 text-white"
              : "bg-slate-900 text-slate-400 hover:text-white"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Preview</span>
        </button>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Project Explorer */}
        <div
          className={`${
            mobilePanel === "files" ? "flex w-full" : "hidden"
          } lg:flex lg:w-60 bg-slate-900/90 border-r border-slate-800 flex-col shrink-0`}
        >
          <div className="p-2.5 border-b border-slate-800 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <input
              type="text"
              placeholder="Search files..."
              value={fileFilter}
              onChange={(e) => setFileFilter(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none"
            />
          </div>

          <div className="p-2 border-b border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Explorer</span>
            <button
              onClick={fetchTree}
              className="hover:text-slate-200 cursor-pointer text-[10px] lowercase text-slate-500 font-mono"
            >
              refresh
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 no-scrollbar">{renderTree(fileTree)}</div>

          {/* Quick preset links */}
          <div className="p-2 border-t border-slate-800 bg-slate-950/60 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Quick Jump</div>
            <div className="flex flex-wrap gap-1">
              {[
                { label: "Homepage", path: "src/app/page.tsx" },
                { label: "Product Card", path: "src/components/ProductCard.tsx" },
                { label: "Bundles", path: "src/components/CuratedBundlesSection.tsx" },
                { label: "Store DB", path: "src/data/store-db.json" },
              ].map((q) => (
                <button
                  key={q.path}
                  onClick={() => loadFile(q.path)}
                  className="px-2 py-0.5 rounded bg-slate-800/70 hover:bg-slate-700 text-slate-300 text-[10px] font-mono cursor-pointer transition-colors"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Code Editor */}
        <div
          className={`${
            mobilePanel === "editor" ? "flex w-full" : "hidden"
          } lg:flex flex-1 flex-col bg-slate-950 relative overflow-hidden`}
        >
          {isLoadingFile ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <span className="text-xs font-mono">Loading buffer into editor...</span>
            </div>
          ) : (
            <div className="flex-1 flex overflow-hidden relative">
              {/* Line numbers gutter */}
              <div className="w-10 sm:w-12 bg-slate-900/60 border-r border-slate-800/60 py-3 select-none text-right pr-2 text-slate-600 font-mono text-xs overflow-hidden shrink-0">
                {Array.from({ length: Math.min(lineCount, 600) }).map((_, i) => (
                  <div key={i} className="leading-6">
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Code TextArea */}
              <textarea
                ref={textareaRef}
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
                spellCheck={false}
                className="flex-1 bg-transparent text-slate-100 font-mono text-xs p-3 leading-6 outline-none resize-none selection:bg-indigo-600/40 selection:text-white overflow-auto no-scrollbar"
                placeholder="// Antigravity Editor ready. Select or edit any file in the workspace..."
              />
            </div>
          )}

          {/* Quick AI Refactor Chips Bar */}
          <div className="bg-slate-900/90 border-t border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar gap-2 shrink-0">
            <div className="flex items-center gap-1.5 shrink-0 text-slate-400 font-mono text-[11px]">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Commands:</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={() =>
                  handleSendAiPrompt(
                    "Review this code for potential syntax bugs, performance bottlenecks, or unhandled null checks."
                  )
                }
                className="px-2 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 text-[11px] font-medium cursor-pointer transition-colors"
              >
                Inspect &amp; Fix Bugs
              </button>
              <button
                onClick={() =>
                  handleSendAiPrompt(
                    "Optimize this component for mobile viewport and ensure clean Tailwind typography without text clutter."
                  )
                }
                className="px-2 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-[11px] font-medium cursor-pointer transition-colors"
              >
                Mobile Polish
              </button>
              <button
                onClick={() =>
                  handleSendAiPrompt(
                    "Format this file cleanly, remove unused imports and improve variable readability."
                  )
                }
                className="px-2 py-0.5 rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-[11px] font-medium cursor-pointer transition-colors"
              >
                Refactor &amp; Clean
              </button>
            </div>
          </div>

          {/* Integrated Mini Console / Terminal Output */}
          <div className="h-24 sm:h-28 bg-black/90 border-t border-slate-800 p-2 font-mono text-[10px] text-slate-400 overflow-y-auto no-scrollbar shrink-0">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span className="font-bold text-slate-400">Antigravity Terminal Logs</span>
            </div>
            {terminalLogs.map((log, i) => (
              <div key={i} className="text-slate-300 leading-relaxed font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Split Preview OR Antigravity Copilot Chat */}
        {showLivePreview || mobilePanel === "preview" ? (
          <div
            className={`${
              mobilePanel === "preview" ? "flex w-full" : "hidden lg:flex"
            } lg:w-[460px] bg-slate-900 border-l border-slate-800 flex-col shrink-0`}
          >
            <div className="p-2 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewTab("storefront")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    previewTab === "storefront"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Live Storefront
                </button>
                <button
                  onClick={() => setPreviewTab("track")}
                  className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                    previewTab === "track"
                      ? "bg-indigo-600 text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Order Tracker
                </button>
              </div>

              <a
                href={previewTab === "storefront" ? "/" : "/track-order"}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                <span>Pop Out</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex-1 bg-white relative">
              <iframe
                src={previewTab === "storefront" ? "/" : "/track-order"}
                className="w-full h-full border-none"
                title="Live Preview"
              />
            </div>
          </div>
        ) : null}

        {/* Antigravity AI Copilot Panel */}
        <div
          className={`${
            mobilePanel === "ai" ? "flex w-full" : "hidden"
          } ${showLivePreview ? "lg:hidden" : "lg:flex"} lg:w-96 bg-slate-900/95 border-l border-slate-800 flex-col shrink-0`}
        >
          {/* Copilot Header */}
          <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-white">Antigravity AI Agent</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              Online
            </span>
          </div>

          {/* Copilot Conversation Feed */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs no-scrollbar"
          >
            {aiChatHistory.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div className="flex items-center gap-1 text-[10px] text-slate-500 mb-1">
                  <span>{msg.sender === "user" ? "Owner" : "Antigravity Copilot"}</span>
                  <span>• {msg.timestamp}</span>
                </div>
                <div
                  className={`p-2.5 rounded-xl max-w-[92%] whitespace-pre-wrap leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                      : "bg-slate-800/90 text-slate-200 border border-slate-700/60 rounded-tl-none font-mono text-[11px]"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isAiLoading && (
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono p-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Antigravity analyzing code context...</span>
              </div>
            )}
          </div>

          {/* Prompt Input Area */}
          <div className="p-2.5 border-t border-slate-800 bg-slate-950">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 focus-within:border-indigo-500">
              <textarea
                rows={2}
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendAiPrompt();
                  }
                }}
                placeholder="Ask Antigravity to inspect, refactor, or update store settings..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none resize-none font-sans"
              />
              <button
                onClick={() => handleSendAiPrompt()}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 font-mono text-center">
              Press Enter to send • Direct file &amp; store context included
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
