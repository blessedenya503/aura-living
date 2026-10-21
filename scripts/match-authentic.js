// Builds a pool of real OpenBeautyFacts packshots per brand, then matches each catalog product by name.
// Usage: node scripts/match-authentic.js          -> writes scripts/match-report.json (no DB changes)
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const poolPath = path.join(__dirname, "obf-pool.json");
const reportPath = path.join(__dirname, "match-report.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

const norm = (s) =>
  (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9% ]/g, " ").replace(/\s+/g, " ").trim();
const STOP = new Set(["the","and","for","with","of","a","in","to","pure","daily","intensive","advanced","ultra","gentle","cream","creme","skin","face","facial","extra","free","spf","rich"]);
const tokens = (s) => norm(s).split(" ").filter((t) => t && !STOP.has(t) && t.length > 1);

const BRAND_QUERIES = {
  "Eucerin": ["Eucerin"], "Avène": ["Avene"], "Bioderma": ["Bioderma"], "Neutrogena": ["Neutrogena"],
  "The Ordinary": ["The Ordinary"], "COSRX": ["COSRX"], "Beauty of Joseon": ["Beauty of Joseon"],
  "Anua": ["Anua"], "Skin1004": ["Skin1004"], "Round Lab": ["Round Lab"], "Haruharu Wonder": ["Haruharu"],
  "Medicube": ["Medicube"], "Drunk Elephant": ["Drunk Elephant"], "Tatcha": ["Tatcha"],
};

async function fetchPage(q, page) {
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=100&page=${page}`;
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "AuraSkincarePackshotCatalog/1.0" } });
      if (!res.ok) continue;
      const data = await res.json();
      return data.products || [];
    } catch {}
  }
  return [];
}

async function buildPool() {
  if (fs.existsSync(poolPath)) return JSON.parse(fs.readFileSync(poolPath, "utf-8"));
  const pool = {};
  for (const [brand, qs] of Object.entries(BRAND_QUERIES)) {
    const seen = new Map();
    for (const q of qs) {
      for (let page = 1; page <= 4; page++) {
        const prods = await fetchPage(q, page);
        if (!prods.length) break;
        for (const p of prods) {
          const img = p.image_front_url || p.image_url;
          const name = p.product_name || p.generic_name || "";
          const brands = p.brands || "";
          if (!img || !img.startsWith("https://images.openbeautyfacts.org") || !name) continue;
          if (!norm(brands + " " + name).includes(norm(qs[0]).split(" ")[0])) continue;
          seen.set(p.code, { code: p.code, name, brands, img });
        }
      }
    }
    pool[brand] = [...seen.values()];
    console.log(`Pool ${brand}: ${pool[brand].length}`);
  }
  fs.writeFileSync(poolPath, JSON.stringify(pool, null, 1));
  return pool;
}

function score(prod, cand) {
  const brandTok = new Set(tokens(prod.brand));
  const pt = tokens(prod.name).filter((t) => !brandTok.has(t));
  const ct = new Set(tokens(cand.name + " " + cand.brands));
  if (!pt.length) return 0;
  let hit = 0;
  for (const t of pt) if (ct.has(t)) hit++;
  // key distinctive tokens: first 3 after brand
  const key = pt.slice(0, 3);
  const keyHit = key.filter((t) => ct.has(t)).length;
  return (hit / pt.length) * 0.5 + (keyHit / key.length) * 0.5;
}

(async () => {
  const pool = await buildPool();
  const used = new Set(db.products.filter((p) => p.image.includes("openbeautyfacts")).map((p) => p.image));
  const report = { matched: [], unmatched: [] };
  for (const p of db.products) {
    if (!p.image.includes("pexels")) continue;
    const cands = (pool[p.brand] || []).filter((c) => !used.has(c.img));
    let best = null, bs = 0;
    for (const c of cands) {
      const s = score(p, c);
      if (s > bs) { bs = s; best = c; }
    }
    if (best && bs >= 0.6) {
      used.add(best.img);
      report.matched.push({ id: p.id, name: p.name, obfName: best.name, img: best.img, score: +bs.toFixed(2) });
    } else {
      report.unmatched.push({ id: p.id, brand: p.brand, name: p.name, bestGuess: best ? best.name : null, score: +bs.toFixed(2) });
    }
  }
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 1));
  console.log(`Matched ${report.matched.length}, unmatched ${report.unmatched.length}`);
})();
