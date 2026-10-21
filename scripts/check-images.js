const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

console.log("Total products:", db.products.length);

const sources = {};
const brandSources = {};

for (const p of db.products) {
  let domain = "other";
  try {
    const u = new URL(p.image);
    domain = u.hostname;
  } catch (e) {
    domain = "invalid";
  }
  sources[domain] = (sources[domain] || 0) + 1;

  if (!brandSources[p.brand]) brandSources[p.brand] = {};
  brandSources[p.brand][domain] = (brandSources[p.brand][domain] || 0) + 1;
}

console.log("\nImage Domains breakdown:");
console.table(sources);

console.log("\nBrand breakdown by domain:");
for (const [b, stats] of Object.entries(brandSources)) {
  console.log(`- ${b}:`, JSON.stringify(stats));
}
