const fs = require("fs");
const path = require("path");

const db = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "src", "data", "store-db.json"), "utf-8"));

console.log("Total products:", db.products.length);

const byBrand = {};
for (const p of db.products) {
  if (!byBrand[p.brand]) byBrand[p.brand] = [];
  byBrand[p.brand].push({ id: p.id, name: p.name, category: p.category, image: p.image });
}

for (const [brand, prods] of Object.entries(byBrand)) {
  console.log(`\n=== BRAND: ${brand} (${prods.length} items) ===`);
  prods.forEach((p, idx) => {
    const isPexels = p.image.includes("pexels");
    console.log(`  [${p.id}] ${p.name.slice(0, 45)}... | Pexels? ${isPexels}`);
  });
}
