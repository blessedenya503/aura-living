import { NextResponse } from "next/server";
import { readStoreDb } from "@/lib/store-db";

export const dynamic = "force-dynamic";

interface ConversationTurn {
  sender: "user" | "ai";
  text: string;
}

export async function POST(req: Request) {
  try {
    const { query, history } = await req.json();

    if (!query || typeof query !== "string" || !query.trim()) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const db = readStoreDb();

    // Top representative products from verified skincare catalog
    const catalogSummary = db.products.slice(0, 30).map((p) => ({
      id: p.id,
      brand: p.brand,
      name: p.name,
      price: p.price,
      tagline: p.tagline,
      skinType: p.skinType,
      keyIngredients: p.keyIngredients?.slice(0, 3),
    }));

    // Format conversation history for multi-turn conversational diagnosing
    const formattedHistory = Array.isArray(history)
      ? history
          .slice(-6)
          .map((h: ConversationTurn) => `${h.sender === "user" ? "Customer" : "Dr. AURA"}: ${h.text}`)
          .join("\n")
      : "";

    if (geminiKey) {
      try {
        const prompt = `You are "Dr. AURA", a warm, empathetic, and attentive cosmetic skincare specialist at AURA Skincare Clinic.
You converse with customers like a genuine, caring expert doctor having a two-way consultation — NOT a robotic FAQ or a dry bullet-point generator.

Rules for your response:
1. Empathy first: Acknowledge what they are going through (e.g. if they have breakouts, redness, peeling, irritation, or feeling insecure).
2. Engaging conversational flow:
   - If their complaint is brief or vague (e.g. "my face is breaking out", "I have dark spots", "my skin is dry"), ask 1-2 thoughtful clarifying questions first (e.g., "Are you experiencing any stinging when you wash your face?", "How long have you had this?", "What is your current daily cleanser?") before or alongside your guidance.
   - If they have answered questions or provided detailed symptoms, give a clear, reassuring diagnosis and a tailored step-by-step prescription routine (Morning vs Night).
3. Recommend 1 or 2 matching products strictly from the store catalog list below that fit their exact complaint.
4. Keep tone warm, luxurious, human, and professional (avoid stiff robotic openings like "Certainly! Here is...").

Recent conversation transcript:
${formattedHistory}

Latest customer message:
"${query.trim()}"

Store product catalog for recommendations:
${JSON.stringify(catalogSummary)}

Output strictly valid JSON matching this schema:
{
  "doctorReply": "Your caring, conversational response to the customer, acknowledging their feelings, asking clarifying questions if needed, or explaining the prescription step-by-step.",
  "recommendedProductIds": ["prod_id1", "prod_id2"],
  "prescriptionFocus": "e.g. Calming Barrier Repair & Non-Stripping Cleansing"
}`;

        const candidateModels = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-flash-latest"];
        for (const modelName of candidateModels) {
          try {
            const geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${geminiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                }),
                signal: AbortSignal.timeout(8000),
              }
            );

            if (geminiRes.ok) {
              const data = await geminiRes.json();
              const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
              const cleaned = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
              const parsed = JSON.parse(cleaned);
              return NextResponse.json({ success: true, ai: parsed });
            }
          } catch (modelErr: any) {
            console.warn(`[AI Search] Model ${modelName} error:`, modelErr?.message);
          }
        }
      } catch (geminiErr: any) {
        console.warn("Gemini multi-turn call fallback:", geminiErr?.message);
      }
    }

    // Dynamic empathetic fallback with thoughtful follow-up questions
    const qLower = query.toLowerCase();
    let reply = "";
    let matchedIds: string[] = [];
    let focus = "Holistic Barrier Support";

    if (qLower.includes("breakout") || qLower.includes("acne") || qLower.includes("pimple")) {
      reply = "I completely understand how frustrating sudden breakouts can be. Before we rush into strong actives, tell me a little more: are they painful cystic bumps under the skin, or smaller red surface bumps? Also, does your skin currently feel tight or oily after washing?";
      matchedIds = catalogSummary.filter((p) => p.name.toLowerCase().includes("acne") || p.name.toLowerCase().includes("cleanser")).slice(0, 2).map((p) => p.id);
      focus = "Gentle Pore Clarifying & Non-Comedogenic Hydration";
    } else if (qLower.includes("dark spot") || qLower.includes("hyperpigmentation") || qLower.includes("mark")) {
      reply = "Post-inflammatory dark spots can take weeks if the barrier isn't protected. Are these spots from past acne or sun exposure? Also, are you currently using daily SPF, or is your skin on the more sensitive side?";
      matchedIds = catalogSummary.filter((p) => p.name.toLowerCase().includes("luminous") || p.name.toLowerCase().includes("niacinamide") || p.name.toLowerCase().includes("vitamin c")).slice(0, 2).map((p) => p.id);
      focus = "Cellular Melanin Regulation & Daily UV Shield";
    } else if (qLower.includes("dry") || qLower.includes("peel") || qLower.includes("burn") || qLower.includes("itch")) {
      reply = "It sounds like your moisture barrier is compromised and crying out for comfort. When you apply your current moisturizer or splash water on your face, does it sting or burn at all?";
      matchedIds = catalogSummary.filter((p) => p.name.toLowerCase().includes("snail") || p.name.toLowerCase().includes("cerave") || p.name.toLowerCase().includes("creme")).slice(0, 2).map((p) => p.id);
      focus = "Lipid Replenishment & Intensive Barrier Restoration";
    } else {
      reply = "Welcome to AURA. I want to make sure we treat your skin with precision. Could you describe how your skin is feeling throughout the day — does it get shiny around midday, feel tight, or are there specific spots or texture you're hoping to improve?";
      matchedIds = catalogSummary.slice(0, 2).map((p) => p.id);
    }

    return NextResponse.json({
      success: true,
      ai: {
        doctorReply: reply,
        recommendedProductIds: matchedIds.length > 0 ? matchedIds : catalogSummary.slice(0, 2).map((p) => p.id),
        prescriptionFocus: focus,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "AI consultation failed" },
      { status: 500 }
    );
  }
}
