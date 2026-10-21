// 1) Products with a close real OpenBeautyFacts packshot (same product line) are renamed to the real product + use its photo.
// 2) Everything else gets a written packagingDescription and an AI-generated packshot saved locally (public/products/ai/<id>.jpg).
// Resumable: re-run safely. Usage: node scripts/generate-packshots.js [--limit N]
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const outDir = path.join(__dirname, "..", "public", "products", "ai");
fs.mkdirSync(outDir, { recursive: true });
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const pool = require("./obf-pool.json");
const limitArg = process.argv.indexOf("--limit");
const LIMIT = limitArg > -1 ? +process.argv[limitArg + 1] : Infinity;

let lastRequest = 0;
const save = () => fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
const norm = (s) => (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9% ]/g, " ").replace(/\s+/g, " ").trim();
const STOP = new Set(["the","and","for","with","of","a","in","to","pure","daily","intensive","advanced","ultra","gentle","skin","face","facial","extra","free","spf","rich"]);
const tokens = (s) => norm(s).split(" ").filter((t) => t && !STOP.has(t) && t.length > 1);
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

// ---- Packaging type detection ----
const FORMS = [
  [/shampoo/i, "tall plastic shampoo bottle with flip cap"],
  [/sun stick|serum stick|stick/i, "slim twist-up balm stick tube"],
  [/lip (balm|mask|repair|stick|ointment)|lip butter|kissu|lipstick/i, "small squeezable lip balm tube"],
  [/sun ?screen|sun (cream|lotion|fluid|gel|spray)|spf|photoderm|anthelios|uv/i, "slim squeeze sunscreen tube with flip cap"],
  [/spray|mist/i, "tall fine-mist spray bottle"],
  [/pad/i, "wide round flat pad tub with screw lid"],
  [/wipe/i, "soft flat wipes pouch"],
  [/cleansing oil|shower oil|bath and shower oil|body oil|facial oil|seed oil|rose hip|marula|oil/i, "amber glass bottle with pump dispenser"],
  [/serum|ampoule|concentrate|essence|booster|drops|solution|elixir|suspension|emulsion/i, "frosted glass dropper bottle"],
  [/toner|water\b|micellar|lotion wipe/i, "tall rounded plastic bottle with flip cap"],
  [/cleanser|wash|gel moussant|foam|cleansing (gel|balm|lotion)|soap/i, "squeezable cleanser tube with flip cap"],
  [/mask|pack|peel|clay|scrub|exfoliat/i, "wide short tub jar with screw lid"],
  [/balm|ointment|butter|healing/i, "round metal cosmetic tin jar, lid closed and screwed on"],
  [/eye/i, "small slim airless pump tube with metal applicator tip"],
  [/lotion|body|hand cream|shower/i, "large pump-top lotion bottle"],
  [/cream|creme|moisturi[sz]er|gel-cream|gel cream/i, "round heavy-glass cream jar with screw lid"],
];
const formFor = (name) => (FORMS.find(([re]) => re.test(name)) || [null, "minimal cosmetic bottle with pump"])[1];

// ---- Brand packaging identity (colors / look), text-free ----
const BRAND_LOOK = {
  "Eucerin": "navy blue and white packaging with a clean pharmacy look",
  "Avène": "white packaging with a light blue and turquoise wave-style band, pharmacy look",
  "Bioderma": "white packaging with a pink and white label zone, pharmacy look",
  "Neutrogena": "bright aqua-blue and white packaging with an orange accent",
  "Drunk Elephant": "playful pastel packaging in soft pink, white and sage with colorful accents",
  "Tatcha": "elegant indigo-blue and gold luxury packaging with a ceramic-like finish",
  "Haruharu Wonder": "clean off-white packaging with deep black rice-grain brown accents",
  "Medicube": "white and red clinical Korean packaging with sleek red accents",
  "COSRX": "minimalist white and soft green Korean packaging",
  "Beauty of Joseon": "traditional Korean hanbok-inspired cream and warm gold packaging",
  "Anua": "clean white and soft green heartleaf-inspired Korean packaging",
  "Skin1004": "natural green and white centella-inspired Korean packaging",
  "Round Lab": "simple white and muted sea-blue Korean packaging",
  "The Ordinary": "minimalist clinical white label on clear bottle with plain black cap",
  "Paula's Choice": "white bottle with navy-blue accents",
};
const OEM = /Ausmetics|Yilong|Shinva|Bell Cosmetics|Bio-Active Lab/i;
const OEM_STYLES = [
  "frosted white", "matte white with silver", "pale blue frosted", "soft pink frosted", "matte sage green", "clear glass with white", "light gold and white", "matte beige",
];

function describePackaging(p) {
  const form = formFor(p.name);
  const look = OEM.test(p.brand)
    ? `private-label ${OEM_STYLES[hash(p.id) % OEM_STYLES.length]} packaging with a plain blank label (white-label OEM/ODM)`
    : BRAND_LOOK[p.brand] || "clean modern cosmetic packaging";
  const size = p.size ? `, approx. ${p.size}` : "";
  return `${form}${size}; ${look}. Label area is clean and unprinted in the render.`;
}

async function renamePhase() {
  let renamed = 0;
  const used = new Set(db.products.map((p) => p.image));
  for (const p of db.products) {
    if (!p.image.includes("pexels")) continue;
    const cands = (pool[p.brand] || []).filter((c) => !used.has(c.img) && /^[\x20-\x7E]+$/.test(c.name) && c.name.length > 6);
    const brandTok = new Set(tokens(p.brand));
    const pt = tokens(p.name).filter((t) => !brandTok.has(t));
    let best = null, bs = 0;
    for (const c of cands) {
      const ct = new Set(tokens(c.name));
      if (!pt.length) continue;
      const keyHit = pt.slice(0, 3).filter((t) => ct.has(t)).length / Math.min(3, pt.length);
      const all = pt.filter((t) => ct.has(t)).length / pt.length;
      // form must agree (cleanser vs cream etc.)
      if (formFor(p.name) !== formFor(c.name)) continue;
      const s = keyHit * 0.6 + all * 0.4;
      if (s > bs) { bs = s; best = c; }
    }
    if (best && bs >= 0.7) {
      used.add(best.img);
      const real = best.name.replace(/\s+/g, " ").trim();
      p.name = norm(real).includes(norm(p.brand)) ? real : `${p.brand} ${real}`;
      p.image = best.img;
      p.gallery = [best.img];
      p.imageSource = "openbeautyfacts";
      p.packagingDescription = `Real retail packaging of "${p.name}" (photo from OpenBeautyFacts).`;
      renamed++;
    }
  }
  save();
  console.log("Renamed to real products:", renamed);
}

async function geminiImage(prompt, key) {
  // 1) Imagen 3 (paid tier)  2) Gemini image model (works on free-tier keys)
  const imagen = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: "1:1" } }),
    signal: AbortSignal.timeout(120000),
  });
  if (imagen.ok) {
    const d = await imagen.json();
    const b64 = d.predictions && d.predictions[0] && d.predictions[0].bytesBase64Encoded;
    if (b64) return Buffer.from(b64, "base64");
  }
  const gem = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { responseModalities: ["IMAGE"] } }),
    signal: AbortSignal.timeout(120000),
  });
  if (!gem.ok) throw new Error("Gemini HTTP " + gem.status + " " + (await gem.text()).slice(0, 160));
  const g = await gem.json();
  const part = ((g.candidates || [])[0]?.content?.parts || []).find((x) => x.inlineData);
  if (!part) throw new Error("Gemini returned no image");
  return Buffer.from(part.inlineData.data, "base64");
}

function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  try {
    const env = fs.readFileSync(path.join(__dirname, "..", ".env.local"), "utf-8");
    const m = env.match(/^\s*(?:GEMINI_API_KEY|GOOGLE_API_KEY)\s*=\s*"?([^"\r\n]+)"?/m);
    return m ? m[1].trim() : "";
  } catch { return ""; }
}
const GEMINI_KEY = loadKey();

async function generate(p) {
  const file = path.join(outDir, `${p.id}.jpg`);
  if (!fs.existsSync(file)) {
    const prompt = `Professional e-commerce product photo of a closed, full, sealed skincare product, standing upright: ${p.packagingDescription} Single product centered, soft studio lighting, seamless white background, photorealistic, no text, no logo, no watermark`;
    for (let attempt = 0; attempt < 4; attempt++) {
      try {
        const buf = await geminiImage(prompt, GEMINI_KEY);
        await sharp(buf).resize(800, 800, { fit: "cover" }).jpeg({ quality: 88 }).toFile(file);
        break;
      } catch (e) {
        console.log(`  retry ${p.id}: ${e.message}`);
        await new Promise((r) => setTimeout(r, 4000 * (attempt + 1)));
      }
    }
  }
  if (fs.existsSync(file)) {
    p.image = `/products/ai/${p.id}.jpg`;
    p.gallery = [p.image];
    p.imageSource = "ai-generated";
    return true;
  }
  return false;
}

(async () => {
  if (!GEMINI_KEY) { console.error("No GEMINI_API_KEY found (env or .env.local). Aborting."); process.exit(1); }
  await renamePhase();
  const todo = db.products.filter((p) => p.image.includes("pexels") || (p.imageSource === "ai-generated" && !fs.existsSync(path.join(outDir, `${p.id}.jpg`))));
  for (const p of db.products) if ((p.image.includes("pexels") || p.imageSource === "ai-generated") && (!p.packagingDescription || /wide low metal-lidded/.test(p.packagingDescription))) p.packagingDescription = describePackaging(p);
  save();
  console.log("To generate:", todo.length);
  let done = 0, fail = 0, idx = 0;
  const batch = todo.slice(0, LIMIT);
  async function worker() {
    while (idx < batch.length) {
      const p = batch[idx++];
      const ok = await generate(p);
      ok ? done++ : fail++;
      save();
      if ((done + fail) % 5 === 0) console.log(`progress ${done + fail}/${batch.length} (fail ${fail})`);
    }
  }
  await worker();
  save();
  console.log(`Generated ${done}, failed ${fail}`);
})();
