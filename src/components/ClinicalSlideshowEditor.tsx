"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Save,
  RotateCcw,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ImageIcon,
} from "lucide-react";
import type { ClinicalStudyCase } from "@/lib/clinical-cases";

const blankCase = (): ClinicalStudyCase => ({
  id: `case-${Date.now()}`,
  title: "New clinical result",
  indication: "Skin concern",
  duration: "14 Days Clinical Trial",
  beforeImg: "",
  afterImg: "",
  beforeTitle: "Day 0: Baseline",
  beforeCondition: "",
  afterTitle: "Day 14: Result",
  afterResult: "",
  metrics: [
    { label: "", value: "", detail: "" },
    { label: "", value: "", detail: "" },
    { label: "", value: "", detail: "" },
  ],
  dermatologistQuote: "",
});

const inputCls =
  "w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500";
const labelCls = "block text-[10px] font-mono uppercase font-bold text-slate-400 mb-1";

function ImageField({
  label,
  value,
  onChange,
  accent,
  caseId,
  slot,
  onOpenInStudio,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  accent: string;
  caseId?: string;
  slot?: "before" | "after";
  onOpenInStudio?: (url: string, caseId: string, slot: "before" | "after") => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (file: File) => {
    setUploading(true);
    setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
      onChange(data.url);
    } catch (e: any) {
      setErr(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <span className={`${labelCls} ${accent}`}>{label}</span>
      <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-600 text-[11px]">
            <ImageIcon className="w-6 h-6" />
            No image yet
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-slate-950/70 flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          </div>
        )}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste image URL…"
        className={inputCls}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) upload(f);
          e.target.value = "";
        }}
      />
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 cursor-pointer disabled:opacity-50"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>Upload File</span>
        </button>

        {onOpenInStudio && caseId && slot && (
          <button
            type="button"
            onClick={() => onOpenInStudio(value, caseId, slot)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-xs font-semibold text-cyan-300 border border-cyan-800/80 cursor-pointer transition-colors"
            title="Open in Skincare Image Studio to adjust lighting, crop, or stamp badge"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Studio Edit</span>
          </button>
        )}
      </div>
      {err && <p className="text-[11px] text-rose-400">{err}</p>}
    </div>
  );
}

export default function ClinicalSlideshowEditor({
  onOpenInStudio,
}: {
  onOpenInStudio?: (url: string, caseId: string, slot: "before" | "after") => void;
}) {
  const [cases, setCases] = useState<ClinicalStudyCase[]>([]);
  const [open, setOpen] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/clinical-cases", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setCases(d.cases || []))
      .catch(() => setMsg({ ok: false, text: "Could not load slides." }))
      .finally(() => setLoading(false));
  }, []);

  const flash = (ok: boolean, text: string) => {
    setMsg({ ok, text });
    setTimeout(() => setMsg(null), 4500);
  };

  const patch = (i: number, p: Partial<ClinicalStudyCase>) =>
    setCases((cs) => cs.map((c, idx) => (idx === i ? { ...c, ...p } : c)));

  const patchMetric = (i: number, m: number, key: "label" | "value" | "detail", v: string) =>
    setCases((cs) =>
      cs.map((c, idx) =>
        idx === i
          ? { ...c, metrics: c.metrics.map((x, mi) => (mi === m ? { ...x, [key]: v } : x)) }
          : c
      )
    );

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= cases.length) return;
    setCases((cs) => {
      const copy = [...cs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
    setOpen(j);
  };

  const remove = (i: number) => {
    if (cases.length <= 1) return flash(false, "Keep at least one slide.");
    setCases((cs) => cs.filter((_, idx) => idx !== i));
    setOpen(0);
  };

  const add = () => {
    if (cases.length >= 12) return flash(false, "Maximum 12 slides.");
    setCases((cs) => [...cs, blankCase()]);
    setOpen(cases.length);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/clinical-cases", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cases }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Save failed");
      setCases(d.cases);
      flash(true, "Saved. The storefront slideshow is updated.");
    } catch (e: any) {
      flash(false, e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = async () => {
    if (!confirm("Restore the original 4 slides? Your edits will be lost.")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/clinical-cases", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reset: true }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Reset failed");
      setCases(d.cases);
      setOpen(0);
      flash(true, "Original slides restored.");
    } catch (e: any) {
      flash(false, e.message || "Reset failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-slate-400 text-xs p-6">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading slides…
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white">Before &amp; After Slideshow</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Edit the images and text of the clinical slideshow shown on the storefront.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetDefaults}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Restore originals
          </button>
          <button
            type="button"
            onClick={add}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add slide
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save changes
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold border ${
            msg.ok
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {msg.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {msg.text}
        </div>
      )}

      <div className="space-y-3">
        {cases.map((c, i) => (
          <div key={c.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setOpen(open === i ? -1 : i)}
              onKeyDown={(e) => e.key === "Enter" && setOpen(open === i ? -1 : i)}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-slate-800/50 cursor-pointer"
            >
              <div className="flex shrink-0 -space-x-2">
                {[c.beforeImg, c.afterImg].map((src, k) => (
                  <div key={k} className="w-10 h-10 rounded-lg overflow-hidden border-2 border-slate-900 bg-slate-950">
                    {src && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={src} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-mono text-slate-500">SLIDE {i + 1}</div>
                <div className="text-sm font-semibold text-white truncate">{c.title || "Untitled"}</div>
              </div>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer" aria-label="Move up">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === cases.length - 1} className="p-1.5 rounded-md bg-slate-800 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer" aria-label="Move down">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => remove(i)} className="p-1.5 rounded-md bg-rose-950/60 text-rose-300 hover:bg-rose-900 cursor-pointer" aria-label="Delete slide">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {open === i && (
              <div className="p-4 border-t border-slate-800 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageField
                    label="Before image"
                    accent="text-rose-400"
                    value={c.beforeImg}
                    caseId={c.id}
                    slot="before"
                    onOpenInStudio={onOpenInStudio}
                    onChange={(v) => patch(i, { beforeImg: v })}
                  />
                  <ImageField
                    label="After image"
                    accent="text-emerald-400"
                    value={c.afterImg}
                    caseId={c.id}
                    slot="after"
                    onOpenInStudio={onOpenInStudio}
                    onChange={(v) => patch(i, { afterImg: v })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3">
                    <label className={labelCls}>Slide title</label>
                    <input className={inputCls} value={c.title} onChange={(e) => patch(i, { title: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelCls}>Indication</label>
                    <input className={inputCls} value={c.indication} onChange={(e) => patch(i, { indication: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelCls}>Duration</label>
                    <input className={inputCls} value={c.duration} onChange={(e) => patch(i, { duration: e.target.value })} />
                  </div>
                  <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Before title</label>
                      <input className={inputCls} value={c.beforeTitle} onChange={(e) => patch(i, { beforeTitle: e.target.value })} />
                      <label className={`${labelCls} mt-2`}>Before description</label>
                      <textarea rows={3} className={inputCls} value={c.beforeCondition} onChange={(e) => patch(i, { beforeCondition: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>After title</label>
                      <input className={inputCls} value={c.afterTitle} onChange={(e) => patch(i, { afterTitle: e.target.value })} />
                      <label className={`${labelCls} mt-2`}>After description</label>
                      <textarea rows={3} className={inputCls} value={c.afterResult} onChange={(e) => patch(i, { afterResult: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Result metrics (3)</label>
                  <div className="space-y-2">
                    {c.metrics.map((m, mi) => (
                      <div key={mi} className="grid grid-cols-3 gap-2">
                        <input className={inputCls} placeholder="Label" value={m.label} onChange={(e) => patchMetric(i, mi, "label", e.target.value)} />
                        <input className={inputCls} placeholder="Value (e.g. +89%)" value={m.value} onChange={(e) => patchMetric(i, mi, "value", e.target.value)} />
                        <input className={inputCls} placeholder="Detail" value={m.detail} onChange={(e) => patchMetric(i, mi, "detail", e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Quote</label>
                  <textarea rows={2} className={inputCls} value={c.dermatologistQuote} onChange={(e) => patch(i, { dermatologistQuote: e.target.value })} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
