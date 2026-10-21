import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";

export const dynamic = "force-dynamic";

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      prompt,
      style = "luxury-studio",
      productType = "cream-jar",
      aspectRatio = "1:1",
    } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Commercial cosmetic & clinical photography style modifiers
    const styleModifiers: Record<string, string> = {
      "luxury-studio":
        "commercial cosmetic packshot, white marble podium, soft diffused studio key light, pristine reflection, minimalist aesthetic, 8k resolution, photorealistic",
      "dewy-water":
        "surrounded by splash water droplets, crystal clear liquid beads, ultra-hydrating dew, glass skin aesthetic, hyper-detailed moisture texture, cinematic lighting",
      botanical:
        "surrounded by fresh organic centella asiatica leaves, aloe vera, gentle natural sunlight, earthy serene luxury, clean beauty aesthetic",
      "clinical-lab":
        "medical grade dermatology laboratory, frosted glass bottle, clean clinical stainless steel bench, scientific precision, ultra-sharp focus",
      "tiktok-viral":
        "viral tiktok beauty trend lighting, subtle cyan and pink rim lights, luminous glass skin glow, modern aesthetic, high contrast commercial product photo",
      "clinical-before":
        "dermatological clinical macro photography, skin concern close-up, medical dermascope view, natural clinical lighting, neutral gray backdrop, 8k photorealistic",
      "clinical-after":
        "dermatological clinical macro photography, restored smooth skin barrier, hydrated radiant stratum corneum, clinical dermascope view, 8k photorealistic",
    };

    const chosenStyle = styleModifiers[style] || styleModifiers["luxury-studio"];

    // Dimension calculation based on aspect ratio
    let width = 1024;
    let height = 1024;
    if (aspectRatio === "4:3") {
      width = 1024;
      height = 768;
    } else if (aspectRatio === "16:9") {
      width = 1024;
      height = 576;
    }

    // Synthesize full prompt
    const enhancedPrompt = `${prompt}, ${chosenStyle}, high-end professional photography, shot on Hasselblad 100mm macro, f/4, 8k resolution`;

    // 1. Primary: Google Gemini Native Image Generation (Models: gemini-3.1-flash-image / gemini-2.5-flash-image)
    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (geminiKey) {
      const candidateModels = [
        "gemini-3.1-flash-image",
        "gemini-3.1-flash-lite-image",
        "gemini-2.5-flash-image",
        "gemini-3-pro-image",
      ];

      for (const modelName of candidateModels) {
        try {
          const geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: `Generate a photorealistic cosmetic packshot: ${enhancedPrompt}` }] }],
              }),
            }
          );

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const candidateParts = geminiData.candidates?.[0]?.content?.parts || [];
            const inlineData = candidateParts.find((p: any) => p.inlineData?.data)?.inlineData;

            if (inlineData?.data) {
              const buf = Buffer.from(inlineData.data, "base64");
              fs.mkdirSync(UPLOAD_DIR, { recursive: true });
              const fileName = `gemini-ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
              fs.writeFileSync(path.join(UPLOAD_DIR, fileName), buf);

              return NextResponse.json({
                success: true,
                imageUrl: `/api/media/${fileName}`,
                prompt: enhancedPrompt,
                model: `Google Gemini (${modelName})`,
              });
            }
          } else {
            const errJson = await geminiRes.json().catch(() => ({}));
            console.warn(`[Gemini Image Gen] ${modelName} returned status ${geminiRes.status}:`, errJson?.error?.message || "");
          }
        } catch (err: any) {
          console.warn(`[Gemini Image Gen] Error with ${modelName}:`, err?.message);
        }
      }
    }

    // 2. High-performance, zero-cors AI Image Generation Engine (Pollinations Flux / SDXL)
    // Server-side fetch and cache into data/uploads to avoid canvas tainting and CORS failures
    const encodedPrompt = encodeURIComponent(enhancedPrompt);
    const seed = Math.floor(Math.random() * 9999999);
    const remoteUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

    try {
      const imgRes = await fetch(remoteUrl, { signal: AbortSignal.timeout(25000) });
      if (imgRes.ok) {
        const arrayBuf = await imgRes.arrayBuffer();
        const rawBuf = Buffer.from(arrayBuf);
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });

        // Optimize through Sharp
        const optimizedBuf = await sharp(rawBuf)
          .jpeg({ quality: 88, mozjpeg: true })
          .toBuffer();

        const fileName = `studio-ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}.jpg`;
        fs.writeFileSync(path.join(UPLOAD_DIR, fileName), optimizedBuf);

        return NextResponse.json({
          success: true,
          imageUrl: `/api/media/${fileName}`,
          prompt: enhancedPrompt,
          model: "AURA AI Cosmetic Studio Engine",
          seed,
        });
      }
    } catch (fetchErr) {
      console.warn("Server caching of AI image failed, returning remote URL:", fetchErr);
    }

    // Fallback directly to remote URL if server cache times out
    return NextResponse.json({
      success: true,
      imageUrl: remoteUrl,
      prompt: enhancedPrompt,
      model: "AURA AI Cosmetic Studio Engine",
      seed,
    });
  } catch (err: any) {
    console.error("AI image generation error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate AI image" },
      { status: 500 }
    );
  }
}
