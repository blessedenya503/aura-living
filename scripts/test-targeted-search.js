const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

async function searchOBF(query) {
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=10`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "AuraSkincareMatcher/1.0" } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.products) return [];
    return data.products
      .map(p => ({
        name: p.product_name || p.generic_name || "",
        brand: p.brands || "",
        image: p.image_front_url || p.image_url || "",
      }))
      .filter(p => p.image && p.image.startsWith("https://images.openbeautyfacts.org"));
  } catch (err) {
    return [];
  }
}

async function testMatch() {
  const testIds = [
    "prod-eucerin-51", // Eucerin Advanced Repair
    "prod-eucerin-53", // Aquaphor
    "prod-eucerin-56", // Anti-Pigment Dual Serum
    "prod-avne-76",    // Avene Cicalfate+
    "prod-avne-77",    // Avene Thermal Spring Water
    "prod-bioderma-101", // Bioderma Sensibio H2O
    "prod-bioderma-102", // Atoderm Intensive Baume
    "prod-neutrogena-281", // Hydro Boost Water Gel
    "prod-theordinary-161", // Buffet
    "prod-theordinary-162", // Caffeine Solution
    "prod-theordinary-167", // AHA 30% Peeling Solution
    "prod-cosrx-121", // Low pH Good Morning Gel Cleanser
    "prod-beautyofjoseon-131", // Ginseng Essence Water
    "prod-anua-145", // Pore Control Cleansing Oil
    "prod-roundlab-296", // Dokdo Toner
    "prod-haruharuwonder-311", // Black Rice Toner
    "prod-haruharuwonder-317", // Medicube Zero Pore Pad
  ];

  for (const id of testIds) {
    const prod = db.products.find(p => p.id === id);
    if (!prod) continue;
    
    // clean search query
    const cleanTerms = prod.name
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .slice(0, 4)
      .join(" ");

    const results = await searchOBF(cleanTerms);
    console.log(`[${prod.id}] Query: "${cleanTerms}" => Found ${results.length} matches`);
    if (results.length > 0) {
      console.log(`   Match: ${results[0].name} (${results[0].brand}) -> ${results[0].image.slice(0, 60)}...`);
    }
  }
}

testMatch();
