"use client";

import { useState } from "react";
import { FileItem } from "@/data/hostingData";
import {
  Folder,
  FileCode,
  FileText,
  Upload,
  Plus,
  Save,
  Trash2,
  ArrowLeft,
  Check,
  ChevronRight,
  Code2,
} from "lucide-react";

interface FileManagerTabProps {
  files: FileItem[];
  onSaveFileContent: (fileName: string, content: string) => Promise<void> | void;
  onCreateFile: (name: string, content: string) => Promise<void> | void;
  onDeleteFile: (fileName: string) => Promise<void> | void;
  onOpenFileContent?: (fileName: string) => Promise<string>;
}

export function FileManagerTab({
  files,
  onSaveFileContent,
  onCreateFile,
  onDeleteFile,
  onOpenFileContent,
}: FileManagerTabProps) {
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");

  const handleOpenFile = async (file: FileItem) => {
    if (file.type === "file") {
      setSelectedFile(file);
      setIsSaved(false);
      if (onOpenFileContent) {
        const realText = await onOpenFileContent(file.name);
        setEditorContent(realText);
      } else {
        setEditorContent(file.content || "");
      }
    }
  };

  const handleSave = async () => {
    if (selectedFile) {
      await onSaveFileContent(selectedFile.name, editorContent);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onCreateFile(newFileName.trim(), `/* Created on NovaPanel */\n`);
    setNewFileName("");
    setIsCreatingNew(false);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/[0.08] gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#a29bfe]" />
            <span>Web File Manager & Editor</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Browse webroot directory, edit scripts, configure .htaccess, and upload assets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCreatingNew(!isCreatingNew)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New File</span>
          </button>
          <button
            onClick={() => alert("Upload simulation: Drag and drop files to /public_html")}
            className="px-3 py-1.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-[#6c5ce7]/30"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Archive</span>
          </button>
        </div>
      </div>

      {/* New file modal bar */}
      {isCreatingNew && (
        <form onSubmit={handleCreateSubmit} className="p-3 rounded-xl bg-[#141528] border border-[#6c5ce7]/40 flex items-center gap-3">
          <input
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="e.g. script.js or config.json"
            className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#6c5ce7]"
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#6c5ce7] text-white text-xs font-bold"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => setIsCreatingNew(false)}
            className="px-2 py-1.5 text-xs text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Editor View vs Explorer View */}
      {selectedFile ? (
        <div className="bg-[#101120] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
          {/* Editor Header */}
          <div className="px-4 py-3 bg-[#15162b] border-b border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedFile(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Back to File List"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-[#00cec9]" />
                <span className="font-mono text-xs font-bold text-white">
                  {selectedFile.path}
                </span>
                <span className="text-[10px] text-zinc-500">({selectedFile.size})</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isSaved && (
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                  <Check className="w-3.5 h-3.5" />
                  Saved!
                </span>
              )}
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

          {/* Editor TextArea */}
          <div className="relative">
            <textarea
              value={editorContent}
              onChange={(e) => setEditorContent(e.target.value)}
              rows={18}
              className="w-full bg-[#0a0b14] text-zinc-200 font-mono text-xs sm:text-sm p-4 focus:outline-none resize-none leading-relaxed border-none selection:bg-[#6c5ce7]"
              spellCheck={false}
            />
          </div>
        </div>
      ) : (
        /* File Explorer Table */
        <div className="bg-[#131424] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          {/* Breadcrumb Path */}
          <div className="px-4 py-3 bg-[#101120] border-b border-white/[0.08] flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="text-[#a29bfe] font-bold">root</span>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-white">public_html</span>
          </div>

          <div className="divide-y divide-white/[0.06]">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => handleOpenFile(file)}
                className="px-4 py-3 flex items-center justify-between hover:bg-white/[0.02] cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  {file.type === "folder" ? (
                    <Folder className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                  ) : file.name.endsWith(".php") || file.name.endsWith(".html") || file.name.endsWith(".js") ? (
                    <FileCode className="w-4 h-4 text-[#00cec9]" />
                  ) : (
                    <FileText className="w-4 h-4 text-zinc-400" />
                  )}
                  <span className="text-xs font-medium text-white group-hover:text-[#a29bfe] transition-colors font-mono">
                    {file.name}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-xs text-zinc-400">
                  <span className="text-[11px] font-mono">{file.size}</span>
                  <span className="hidden sm:inline text-[11px] text-zinc-500">{file.modified}</span>
                  {file.type === "file" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFile(file.id);
                      }}
                      className="p-1 text-zinc-500 hover:text-rose-400 transition-colors"
                      title="Delete File"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
