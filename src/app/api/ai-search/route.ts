import { NextResponse } from "next/server";
import { readStoreDb } from "@/lib/store-db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const db = readStoreDb();

    // Fast top catalog match
    const catalogSummary = db.products.slice(0, 25).map((p) => ({
      id: p.id,
      brand: p.brand,
      name: p.name,
      price: p.price,
      keyIngredients: p.keyIngredients?.slice(0, 2),
    }));

    if (geminiKey) {
      try {
        const prompt = `You are "AURA DermAI", a luxury cosmetic dermatologist.
Customer asks: "${query.trim()}".
Store products: ${JSON.stringify(catalogSummary)}

Output valid JSON only:
{
  "headline": "Short 1-line clinical insight",
  "dermatologistAdvice": "Two-sentence expert clinical advice on what active ingredients and formulas to use.",
  "recommendedProductIds": ["prod_id1", "prod_id2"],
  "highlightedIngredients": ["Active1", "Active2"]
}`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
            signal: AbortSignal.timeout(6000),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleaned);
          return NextResponse.json({ success: true, ai: parsed });
        }
      } catch (geminiErr: any) {
        console.warn("Gemini fast-lite fallback:", geminiErr?.message);
      }
    }

    // Fallback if network times out
    return NextResponse.json({
      success: true,
      ai: {
        headline: "Targeted Clinical Match",
        dermatologistAdvice: `For "${query.trim()}", prioritize intensive bio-identical barrier lipids and continuous cellular hydration.`,
        recommendedProductIds: catalogSummary.slice(0, 2).map((p) => p.id),
        highlightedIngredients: ["Ceramides", "Hyaluronic Acid"],
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "AI consultation failed" },
      { status: 500 }
    );
  }
}
