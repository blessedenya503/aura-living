// Applies only verified-correct authentic packshot matches from scripts/match-report.json.
const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const report = require("./match-report.json");

// Matches judged wrong (different variant / format / strength) after manual review
const REJECT = [
  "XeraCalm A.D Lipid-Replenishing Balm",
  "Hydro Boost Hydrating Cleansing Gel",
  "Eucerin Sun Sensitive Protect Sun Spray",
  "Complete Repair Intensive Lotion",
  "UreaRepair PLUS 10% Urea Intensive Foot",
  "Hyaluron Activ B3 Cell Renewal",
  "Very High Protection Fluid",
  "Sensibio H2O Micellar Water",
  "Photoderm Max Cr",
  "Hydro Boost Eye Gel-Cream",
  "Hyalu-Cica Sleeping Pack",
  "Tea-Trica Relief Ampoule",
  "Silky-Fit Sun",
  "Probio-Cica Intensive Ampoule",
  "Black Rice Moisture Deep Cleansing Oil",
];

let applied = 0;
for (const m of report.matched) {
  if (REJECT.some((r) => m.name.includes(r))) continue;
  const p = db.products.find((x) => x.id === m.id);
  if (!p) continue;
  p.image = m.img;
  if (Array.isArray(p.gallery)) p.gallery[0] = m.img; else p.gallery = [m.img];
  applied++;
}
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("Applied", applied);
const pex = db.products.filter((p) => p.image.includes("pexels"));
console.log("Still stock photos:", pex.length);
const dup = db.products.length - new Set(db.products.map((p) => p.image)).size;
console.log("Duplicate images:", dup);
