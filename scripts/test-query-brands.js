const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

async function testQuery(term) {
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "AuraStore/1.0" } });
    const data = await res.json();
    if (data.products && data.products.length > 0) {
      for (const p of data.products) {
        const img = p.image_front_url || p.image_url;
        if (img && img.startsWith("https://images.openbeautyfacts.org")) {
          return { name: p.product_name, img };
        }
      }
    }
  } catch (err) {
    // ignore
  }
  return null;
}

async function run() {
  const sampleQueries = [
    "Eucerin Roughness Relief",
    "Eucerin Aquaphor",
    "Eucerin UreaRepair",
    "Avene Thermal Spring Water",
    "Avene Cleanance",
    "Avene Hydrance",
    "Bioderma Atoderm",
    "Bioderma Sebium",
    "Bioderma Cicabio",
    "COSRX Good Morning",
    "COSRX BHA Blackhead",
    "Beauty of Joseon Ginseng",
    "Beauty of Joseon Glow Serum",
    "Anua Heartleaf",
    "The Ordinary Caffeine",
    "The Ordinary Squalane",
    "The Ordinary Lactic Acid",
    "Drunk Elephant Lala Retro",
    "Drunk Elephant B-Hydra",
    "Tatcha Rice Polish",
    "Neutrogena Rapid Wrinkle",
    "Round Lab Birch Juice"
  ];

  for (const q of sampleQueries) {
    const res = await testQuery(q);
    if (res) {
      console.log(`✓ [${q}] -> ${res.name} | ${res.img}`);
    } else {
      console.log(`✗ [${q}] -> NOT FOUND`);
    }
  }
}

run();
