"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sliders,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Download,
  Upload,
  Sparkles,
  Check,
  CheckCircle2,
  Undo2,
  Eye,
  Layers,
  Image as ImageIcon,
  Save,
  ArrowRight,
  X,
  Wand2,
  RefreshCw,
  Bot,
} from "lucide-react";
import { Product } from "@/data/products";

interface SkincareImageStudioProps {
  products: Product[];
  initialImageUrl?: string;
  initialSlideTarget?: { caseId: string; slot: "before" | "after" };
  onApplyImageToProduct?: (productId: string, newImageDataUrl: string) => Promise<void>;
  onUseForNewProduct?: (newImageDataUrl: string) => void;
  onApplyImageToSlide?: (caseId: string, slot: "before" | "after", newImageDataUrl: string) => Promise<void>;
}

const BADGES = [
  "None",
  "AURA Verified Formula",
  "100% Genuine NIVEA",
  "Dermatologist Approved",
  "Clinical Grade Active",
  "48H Deep Moisture",
  "Before Clinical Baseline",
  "After Clinical Recovery",
];

const PRESET_BACKGROUNDS = [
  { name: "Transparent", value: "transparent" },
  { name: "Studio Pure White", value: "#FFFFFF" },
  { name: "Soft Silk Cream", value: "#FDFBF7" },
  { name: "Azure Mist", value: "#EFF6FF" },
  { name: "Gentle Rose", value: "#FFF1F2" },
  { name: "Luxury Midnight", value: "#090D16" },
];

export default function SkincareImageStudio({
  products,
  initialImageUrl,
  initialSlideTarget,
  onApplyImageToProduct,
  onUseForNewProduct,
  onApplyImageToSlide,
}: SkincareImageStudioProps) {
  const [currentImageSrc, setCurrentImageSrc] = useState<string>(
    initialImageUrl ||
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop"
  );
  const [customUrlInput, setCustomUrlInput] = useState("");

  // Clinical Slideshow Cases State
  const [clinicalCases, setClinicalCases] = useState<any[]>([]);
  const [applyTargetType, setApplyTargetType] = useState<"product" | "slideshow">(
    initialSlideTarget ? "slideshow" : "product"
  );
  const [targetSlideCaseId, setTargetSlideCaseId] = useState<string>(
    initialSlideTarget?.caseId || ""
  );
  const [targetSlideSlot, setTargetSlideSlot] = useState<"before" | "after">(
    initialSlideTarget?.slot || "before"
  );

  useEffect(() => {
    fetch("/api/clinical-cases", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (d?.cases && Array.isArray(d.cases)) {
          setClinicalCases(d.cases);
          if (!targetSlideCaseId && d.cases[0]) {
            setTargetSlideCaseId(d.cases[0].id);
          }
        }
      })
      .catch(() => {});
  }, [targetSlideCaseId]);

  useEffect(() => {
    if (initialImageUrl) {
      setCurrentImageSrc(initialImageUrl);
    }
  }, [initialImageUrl]);

  useEffect(() => {
    if (initialSlideTarget) {
      setApplyTargetType("slideshow");
      if (initialSlideTarget.caseId) setTargetSlideCaseId(initialSlideTarget.caseId);
      if (initialSlideTarget.slot) setTargetSlideSlot(initialSlideTarget.slot);
    }
  }, [initialSlideTarget]);

  // Adjustment Sliders
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(105);
  const [warmth, setWarmth] = useState(0); // Sepia tint
  const [blur, setBlur] = useState(0);

  // Geometry
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "4:3" | "16:9" | "free">("1:1");

  // Badge Overlay
  const [selectedBadge, setSelectedBadge] = useState("AURA Verified Formula");
  const [badgePosition, setBadgePosition] = useState<"top-left" | "top-right" | "bottom-right">("top-left");

  // Background Studio Stage
  const [bgColor, setBgColor] = useState("#FFFFFF");

  // Target product to apply to
  const [targetProductId, setTargetProductId] = useState<string>(
    products[0]?.id || ""
  );
  const [isApplying, setIsApplying] = useState(false);
  const [appliedMessage, setAppliedMessage] = useState("");

  // Gemini AI Image Generator State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState(
    "Frosted cobalt blue jar of clinical hydrating night cream, water droplets, white marble podium, soft studio rim lighting, 8k commercial packshot"
  );
  const [aiStyle, setAiStyle] = useState<string>("luxury-studio");
  const [aiAspectRatio, setAiAspectRatio] = useState<string>("1:1");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [generatedAiImage, setGeneratedAiImage] = useState<string | null>(null);
  const [aiError, setAiError] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleGenerateAiImage = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAi(true);
    setAiError("");
    try {
      const res = await fetch("/api/admin/ai-image-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          style: aiStyle,
          aspectRatio: aiAspectRatio,
        }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        setGeneratedAiImage(data.imageUrl);
      } else {
        setAiError(data.error || "Failed to generate image");
      }
    } catch (err: any) {
      setAiError(err.message || "Network error generating image");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleLoadAiImageToCanvas = () => {
    if (!generatedAiImage) return;
    setCurrentImageSrc(generatedAiImage);
    setIsAiModalOpen(false);
    setAppliedMessage("✓ Loaded Gemini AI generated packshot into canvas editor!");
    setTimeout(() => setAppliedMessage(""), 4000);
  };

  // Render Image onto Canvas with all transformations & filters
  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !currentImageSrc) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    // Only apply crossOrigin anonymous if it is not a data URL or blob
    if (!currentImageSrc.startsWith("data:") && !currentImageSrc.startsWith("blob:")) {
      img.crossOrigin = "anonymous";
    }
    img.src = currentImageSrc;

    img.onerror = () => {
      // If external image fails due to strict CORS / host blocking, retry loading without crossOrigin attribute
      if (img.crossOrigin) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          // Render fallback directly
          try {
            renderImageToContext(canvas, ctx, fallbackImg);
          } catch (e) {
            console.warn("Direct render fallback:", e);
          }
        };
        fallbackImg.onerror = () => {
          setAppliedMessage("⚠️ Could not load image from that URL. Check that the link is directly accessible or upload the image file directly.");
          setTimeout(() => setAppliedMessage(""), 5000);
        };
        fallbackImg.src = currentImageSrc;
      } else {
        setAppliedMessage("⚠️ Could not load image from that URL. Check that the link is directly accessible or upload the image file directly.");
        setTimeout(() => setAppliedMessage(""), 5000);
      }
    };

    img.onload = () => {
      renderImageToContext(canvas, ctx, img);
    };
  };

  const renderImageToContext = (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement
  ) => {
    // Determine target canvas dimensions
    let targetW = 900;
    let targetH = 900;

    if (aspectRatio === "4:3") {
      targetW = 900;
      targetH = 675;
    } else if (aspectRatio === "16:9") {
      targetW = 960;
      targetH = 540;
    } else if (aspectRatio === "free") {
      targetW = img.width || 800;
      targetH = img.height || 800;
    }

    canvas.width = targetW;
    canvas.height = targetH;

    // Fill background
    if (bgColor !== "transparent") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, targetW, targetH);
    } else {
      ctx.clearRect(0, 0, targetW, targetH);
    }

    ctx.save();

    // Apply Filter Matrix
    const filterStr = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) sepia(${warmth}%) blur(${blur}px)`;
    ctx.filter = filterStr;

    // Transform positioning
    ctx.translate(targetW / 2, targetH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    // Fit or fill image into canvas
    const imgAspect = img.width / img.height;
    const canvasAspect = targetW / targetH;
    let drawW, drawH;

    if (imgAspect > canvasAspect) {
      drawH = targetH;
      drawW = targetH * imgAspect;
    } else {
      drawW = targetW;
      drawH = targetW / imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Draw Badge Overlay if selected
    if (selectedBadge !== "None") {
      ctx.save();
      ctx.font = "bold 22px system-ui, -apple-system, sans-serif";
      const textMetrics = ctx.measureText(selectedBadge);
      const paddingX = 18;
      const boxH = 40;
      const boxW = textMetrics.width + paddingX * 2 + 28;

      let badgeX = 30;
      let badgeY = 30;

      if (badgePosition === "top-right") {
        badgeX = targetW - boxW - 30;
        badgeY = 30;
      } else if (badgePosition === "bottom-right") {
        badgeX = targetW - boxW - 30;
        badgeY = targetH - boxH - 30;
      }

      // Draw pill rounded background
      ctx.fillStyle = "rgba(0, 43, 127, 0.92)";
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, boxW, boxH, 20);
      ctx.fill();

      // White border
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw dot
      ctx.fillStyle = "#FBBF24";
      ctx.beginPath();
      ctx.arc(badgeX + 18, badgeY + boxH / 2, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw text
      ctx.fillStyle = "#FFFFFF";
      ctx.fillText(selectedBadge, badgeX + 32, badgeY + 27);
      ctx.restore();
    }
  };

  useEffect(() => {
    renderCanvas();
  }, [
    currentImageSrc,
    brightness,
    contrast,
    saturation,
    warmth,
    blur,
    rotation,
    flipH,
    flipV,
    aspectRatio,
    selectedBadge,
    badgePosition,
    bgColor,
  ]);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setCurrentImageSrc(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Reset adjustments
  const handleReset = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(105);
    setWarmth(0);
    setBlur(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setAspectRatio("1:1");
    setBgColor("#FFFFFF");
  };

  // Export Data URL
  const getCanvasDataUrl = (): string => {
    const canvas = canvasRef.current;
    if (!canvas) return currentImageSrc;
    return canvas.toDataURL("image/jpeg", 0.92);
  };

  // Download high-res PNG/JPEG
  const handleDownload = () => {
    const dataUrl = getCanvasDataUrl();
    const link = document.createElement("a");
    link.download = `aura-skincare-studio-${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  // Apply to existing product
  const handleApplyToStorefront = async () => {
    if (!targetProductId) return;
    setIsApplying(true);
    const dataUrl = getCanvasDataUrl();
    try {
      if (onApplyImageToProduct) {
        await onApplyImageToProduct(targetProductId, dataUrl);
      } else {
        // Direct API call
        const res = await fetch("/api/admin/dashboard", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "update_product",
            product: { id: targetProductId, image: dataUrl, gallery: [dataUrl] },
          }),
        });
        if (res.ok) {
          const matched = products.find((p) => p.id === targetProductId);
          setAppliedMessage(`Successfully updated image for ${matched?.name || "product"}!`);
          setTimeout(() => setAppliedMessage(""), 3500);
        }
      }
    } catch {
      alert("Failed to apply image");
    } finally {
      setIsApplying(false);
    }
  };

  // Apply directly to clinical slideshow case Before / After
  const handleApplyToSlide = async () => {
    if (!targetSlideCaseId) return;
    setIsApplying(true);
    const dataUrl = getCanvasDataUrl();
    try {
      if (onApplyImageToSlide) {
        await onApplyImageToSlide(targetSlideCaseId, targetSlideSlot, dataUrl);
        const matched = clinicalCases.find((c) => c.id === targetSlideCaseId);
        setAppliedMessage(
          `✓ Updated ${matched?.title || "Slide"} (${targetSlideSlot.toUpperCase()} Photo) in Clinical Slideshow!`
        );
        setTimeout(() => setAppliedMessage(""), 4500);
      } else {
        const res = await fetch("/api/clinical-cases");
        const data = await res.json();
        const currentCases = data.cases || clinicalCases;
        const updated = currentCases.map((c: any) => {
          if (c.id === targetSlideCaseId) {
            return {
              ...c,
              [targetSlideSlot === "before" ? "beforeImg" : "afterImg"]: dataUrl,
            };
          }
          return c;
        });

        const saveRes = await fetch("/api/clinical-cases", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cases: updated }),
        });

        if (saveRes.ok) {
          const matched = clinicalCases.find((c) => c.id === targetSlideCaseId);
          setClinicalCases(updated);
          setAppliedMessage(
            `✓ Successfully saved to Clinical Slideshow: ${matched?.title || "Slide"} (${targetSlideSlot.toUpperCase()} Photo)!`
          );
          setTimeout(() => setAppliedMessage(""), 4500);
        } else {
          const errData = await saveRes.json();
          alert(errData.error || "Failed to update slideshow");
        }
      }
    } catch (err: any) {
      alert("Failed to apply image to clinical slide: " + err.message);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" />
            Interactive Skincare Studio
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Product Image Studio &amp; Badge Stamping
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Upload local images, adjust lighting, crop aspect ratios, stamp luxury badges, and apply directly to your storefront.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Main Direct Save Button */}
          <button
            type="button"
            onClick={applyTargetType === "product" ? handleApplyToStorefront : handleApplyToSlide}
            disabled={isApplying}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50"
            title="Save and apply current canvas image to your selected storefront product or slide"
          >
            <Save className="w-4 h-4" />
            <span>
              {isApplying
                ? "Saving Changes..."
                : applyTargetType === "product"
                ? "Save Changes to Product"
                : "Save Changes to Slide"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsAiModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-950/40 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Gemini AI Generator</span>
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-[#0032A0] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JPG</span>
          </button>
        </div>
      </div>

      {appliedMessage && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{appliedMessage}</span>
        </div>
      )}

      {/* Main Studio Workbench Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Canvas Live Preview */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative w-full max-w-lg aspect-square bg-slate-950 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center p-3">
            <canvas
              ref={canvasRef}
              className="max-h-full max-w-full object-contain rounded-2xl shadow-md transition-all"
            />
          </div>

          {/* Quick Preset Ratios & Rotations */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
            <span className="text-slate-500 text-[11px] font-semibold">Aspect:</span>
            {(["1:1", "4:3", "16:9", "free"] as const).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-3 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                  aspectRatio === ratio
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {ratio.toUpperCase()}
              </button>
            ))}

            <span className="text-slate-600">|</span>

            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Rotate 90° Clockwise"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFlipH((f) => !f)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Flip Horizontal"
            >
              <FlipHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFlipV((f) => !f)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              title="Flip Vertical"
            >
              <FlipVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Controls, Filters & Apply to Storefront */}
        <div className="lg:col-span-5 space-y-6">
          {/* Source Image Loader */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              1. Choose Image Source
            </span>

            {/* Gemini AI Generator Action */}
            <button
              type="button"
              onClick={() => setIsAiModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-950/40 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Packshot with Gemini AI</span>
            </button>

            <div className="flex gap-2">
              <label className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Local File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <select
                onChange={(e) => {
                  const p = products.find((prod) => prod.id === e.target.value);
                  if (p?.image) {
                    setCurrentImageSrc(p.image);
                    setTargetProductId(p.id);
                    setApplyTargetType("product");
                  }
                }}
                className="flex-1 py-2 px-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 focus:outline-hidden"
              >
                <option value="">Load from Storefront...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brand} - {p.name.slice(0, 24)}...
                  </option>
                ))}
              </select>
            </div>

            {/* Load from Clinical Slideshow */}
            {clinicalCases.length > 0 && (
              <div className="pt-1">
                <select
                  onChange={(e) => {
                    if (!e.target.value) return;
                    const [cId, slot] = e.target.value.split(":::");
                    const found = clinicalCases.find((c) => c.id === cId);
                    if (found) {
                      const img = slot === "before" ? found.beforeImg : found.afterImg;
                      if (img) {
                        setCurrentImageSrc(img);
                        setTargetSlideCaseId(cId);
                        setTargetSlideSlot(slot as "before" | "after");
                        setApplyTargetType("slideshow");
                        setAppliedMessage(
                          `✓ Loaded ${found.title} (${slot.toUpperCase()}) into canvas editor`
                        );
                        setTimeout(() => setAppliedMessage(""), 3500);
                      }
                    }
                  }}
                  className="w-full py-2 px-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 text-xs font-medium focus:outline-hidden"
                >
                  <option value="">🔬 Load Photo from Clinical Slideshow...</option>
                  {clinicalCases.map((c, i) => (
                    <React.Fragment key={c.id || i}>
                      <option value={`${c.id}:::before`}>
                        Slide {i + 1} Before: {c.title?.slice(0, 32)} (Day 0 Baseline)
                      </option>
                      <option value={`${c.id}:::after`}>
                        Slide {i + 1} After: {c.title?.slice(0, 32)} ({c.duration || "Result"})
                      </option>
                    </React.Fragment>
                  ))}
                </select>
              </div>
            )}

            {/* Paste Image URL */}
            <div className="flex gap-1.5">
              <input
                type="url"
                placeholder="Or paste web image URL..."
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customUrlInput.trim()) {
                    setCurrentImageSrc(customUrlInput.trim());
                    setAppliedMessage("✓ Loaded image URL into studio!");
                    setTimeout(() => setAppliedMessage(""), 3500);
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  if (customUrlInput.trim()) {
                    setCurrentImageSrc(customUrlInput.trim());
                    setAppliedMessage("✓ Loaded image URL into studio!");
                    setTimeout(() => setAppliedMessage(""), 3500);
                  }
                }}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-xs transition-colors"
              >
                Load
              </button>
            </div>
          </div>

          {/* Lighting & Color Matrix Sliders */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              2. Lighting &amp; Color Tuning
            </span>

            {/* Brightness */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Brightness</span>
                <span className="font-mono">{brightness}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Contrast</span>
                <span className="font-mono">{contrast}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="150"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Saturation (Vibrancy)</span>
                <span className="font-mono">{saturation}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            {/* Warmth / Skin Glow */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Skin Warmth Glow</span>
                <span className="font-mono">{warmth}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={warmth}
                onChange={(e) => setWarmth(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Badge Overlay Stamping */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              3. Stamp Verified Skincare Badge
            </span>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Badge Text</label>
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                >
                  {BADGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Position</label>
                <select
                  value={badgePosition}
                  onChange={(e) =>
                    setBadgePosition(e.target.value as typeof badgePosition)
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>
            </div>

            {/* Studio Background */}
            <div className="pt-2">
              <label className="block text-[11px] text-slate-400 mb-1.5">
                Stage Background Color
              </label>
              <div className="flex items-center gap-2">
                {PRESET_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.name}
                    type="button"
                    onClick={() => setBgColor(bg.value)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      bgColor === bg.value ? "scale-115 ring-2 ring-blue-500" : ""
                    }`}
                    style={{ backgroundColor: bg.value === "transparent" ? "#334155" : bg.value }}
                    title={bg.name}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 4. Apply Directly to Storefront or Slideshow */}
          <div className="bg-gradient-to-r from-[#002B7F]/40 to-slate-950 border border-blue-900/60 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                4. Apply Destination
              </span>
              <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
                <button
                  type="button"
                  onClick={() => setApplyTargetType("product")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    applyTargetType === "product"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Product Catalog
                </button>
                <button
                  type="button"
                  onClick={() => setApplyTargetType("slideshow")}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    applyTargetType === "slideshow"
                      ? "bg-cyan-600 text-white shadow-xs"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Clinical Slideshow
                </button>
              </div>
            </div>

            {applyTargetType === "product" ? (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-300">
                  Select which catalog product should receive this edited photograph:
                </p>
                <div className="flex gap-2">
                  <select
                    value={targetProductId}
                    onChange={(e) => setTargetProductId(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.brand} — {p.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleApplyToStorefront}
                    disabled={isApplying}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isApplying ? "Saving..." : "Save to Product"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="text-[11px] text-cyan-200">
                  Select which slide and photo slot (Before or After) should receive this image:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Select Slide</label>
                    <select
                      value={targetSlideCaseId}
                      onChange={(e) => setTargetSlideCaseId(e.target.value)}
                      className="w-full bg-slate-950 border border-cyan-800/80 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      {clinicalCases.map((c, i) => (
                        <option key={c.id || i} value={c.id}>
                          Slide {i + 1}: {c.title?.slice(0, 28)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Photo Slot</label>
                    <select
                      value={targetSlideSlot}
                      onChange={(e) => setTargetSlideSlot(e.target.value as "before" | "after")}
                      className="w-full bg-slate-950 border border-cyan-800/80 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="before">Before Photo (Day 0 Baseline)</option>
                      <option value="after">After Photo (Clinical Recovery)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={handleApplyToSlide}
                    disabled={isApplying}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isApplying ? "Saving Slide..." : "Save to Clinical Slideshow"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GEMINI AI IMAGE GENERATOR MODAL */}
      {isAiModalOpen && (
        <div
          onClick={() => setIsAiModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto ring-1 ring-white/10"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-950/90 via-slate-950 to-blue-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-lg text-white">
                  <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                      Gemini AI Skincare Studio
                    </h3>
                    <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                      IMAGEN 3.0 ARCHITECTURE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Generate photorealistic commercial skincare packaging packshots from text briefs.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              {/* Style Presets */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  1. Choose Photography Aesthetic
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                  {[
                    { id: "luxury-studio", label: "Luxury Studio", icon: "🏛️" },
                    { id: "dewy-water", label: "Dewy Droplets", icon: "💧" },
                    { id: "botanical", label: "Botanical Cica", icon: "🌿" },
                    { id: "clinical-lab", label: "Clinical Lab", icon: "🔬" },
                    { id: "tiktok-viral", label: "TikTok Viral", icon: "⚡" },
                    { id: "clinical-before", label: "Clinical Before", icon: "🔍" },
                    { id: "clinical-after", label: "Clinical After", icon: "✨" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setAiStyle(s.id)}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        aiStyle === s.id
                          ? "bg-purple-600/20 border-purple-400 text-white shadow-md ring-1 ring-purple-400"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                      }`}
                    >
                      <div className="text-base mb-0.5">{s.icon}</div>
                      <div className="text-[11px] font-semibold truncate">{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Inspiration Prompt Chips */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  2. Prompt Inspiration (Click to Auto-fill)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Frosted cobalt blue tin of classic slugging cream on white marble podium with soft studio lighting",
                    "Golden snail mucin dropper bottle surrounded by crystal-clear splash water beads and hydration dew",
                    "Centella asiatica soothing recovery gel in minimalist white tube with fresh green botanical leaves",
                    "Clinical 10% niacinamide serum in amber glass bottle on stainless steel medical lab bench",
                    "Ultra-luxurious 24K gold peptide eye cream in multifaceted acrylic jar with mirror reflection",
                  ].map((insp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiPrompt(insp)}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 border border-slate-700 transition-colors cursor-pointer text-left truncate max-w-full"
                    >
                      ✨ {insp.slice(0, 50)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Prompt Box */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  <span>3. Product Packaging Brief</span>
                  <span className="text-[11px] font-mono text-purple-400 lowercase font-normal">
                    {aiPrompt.length} chars
                  </span>
                </div>
                <textarea
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={3}
                  placeholder="Describe your desired skincare bottle, cream tub, serum dropper, ingredients, studio background, and lighting..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-purple-500"
                />
              </div>

              {/* Aspect Ratio & Generate Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Aspect:</span>
                  {(["1:1", "4:3", "16:9"] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAiAspectRatio(ratio)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                        aiAspectRatio === ratio
                          ? "bg-purple-600 text-white shadow-xs"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleGenerateAiImage}
                  disabled={isGeneratingAi || !aiPrompt.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isGeneratingAi ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                      <span>Synthesizing Packshot...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 text-amber-300" />
                      <span>Generate with Gemini AI</span>
                    </>
                  )}
                </button>
              </div>

              {aiError && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-xl">
                  {aiError}
                </div>
              )}

              {/* AI Generated Result Preview */}
              {generatedAiImage && (
                <div className="p-4 bg-slate-950/80 border border-purple-500/40 rounded-2xl space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Generated Gemini Packshot Result:</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      High-Res 1024x1024
                    </span>
                  </div>

                  <div className="relative aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl">
                    <img
                      src={generatedAiImage}
                      alt="Gemini AI generated skincare packshot"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Action Choices */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleLoadAiImageToCanvas}
                      className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Load into Studio Canvas</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        if (!targetProductId) return;
                        setIsApplying(true);
                        try {
                          await fetch("/api/admin/dashboard", {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              type: "update_product",
                              product: { id: targetProductId, image: generatedAiImage },
                            }),
                          });
                          setIsAiModalOpen(false);
                          setAppliedMessage("✓ Gemini AI packshot applied directly to storefront catalog!");
                          setTimeout(() => setAppliedMessage(""), 4000);
                        } finally {
                          setIsApplying(false);
                        }
                      }}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Apply to Product</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        if (!targetSlideCaseId || !generatedAiImage) return;
                        setIsApplying(true);
                        try {
                          if (onApplyImageToSlide) {
                            await onApplyImageToSlide(targetSlideCaseId, targetSlideSlot, generatedAiImage);
                          } else {
                            const res = await fetch("/api/clinical-cases");
                            const data = await res.json();
                            const currentCases = data.cases || clinicalCases;
                            const updated = currentCases.map((c: any) => {
                              if (c.id === targetSlideCaseId) {
                                return {
                                  ...c,
                                  [targetSlideSlot === "before" ? "beforeImg" : "afterImg"]: generatedAiImage,
                                };
                              }
                              return c;
                            });
                            await fetch("/api/clinical-cases", {
                              method: "PUT",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ cases: updated }),
                            });
                            setClinicalCases(updated);
                          }
                          setIsAiModalOpen(false);
                          setAppliedMessage(
                            `✓ Saved AI image to Clinical Slideshow (${targetSlideSlot.toUpperCase()} Photo)!`
                          );
                          setTimeout(() => setAppliedMessage(""), 4000);
                        } finally {
                          setIsApplying(false);
                        }
                      }}
                      className="w-full py-2.5 px-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Apply to Slide ({targetSlideSlot.toUpperCase()})</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
