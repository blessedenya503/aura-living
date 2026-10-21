const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

async function fetchBrandProductsFromOBF(brandQuery) {
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(brandQuery)}&search_simple=1&action=process&json=1&page_size=100`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "AuraBrandPackshotSync/1.0" } });
    if (!res.ok) return [];
    const data = await res.json();
    if (data.products && Array.isArray(data.products)) {
      return data.products
        .filter((p) => (p.image_front_url || p.image_url) && (p.image_front_url || p.image_url).startsWith("https://images.openbeautyfacts.org"))
        .map((p) => ({
          name: p.product_name || "",
          img: p.image_front_url || p.image_url,
          code: p.code || ""
        }));
    }
  } catch (err) {
    console.error(`Error querying ${brandQuery}:`, err.message);
  }
  return [];
}

async function run() {
  const brandsToQuery = [
    "Eucerin",
    "Avene",
    "Bioderma",
    "Neutrogena",
    "The Ordinary",
    "Drunk Elephant",
    "Tatcha",
    "Round Lab",
    "Haruharu",
    "Medicube"
  ];

  for (const b of brandsToQuery) {
    const found = await fetchBrandProductsFromOBF(b);
    console.log(`Brand [${b}]: Found ${found.length} authentic packshots in OpenBeautyFacts.`);
    if (found.length > 0) {
      console.log(`   Sample: ${found[0].name} -> ${found[0].img}`);
    }
  }
}

run();
