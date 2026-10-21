const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

console.log("=== STORE-DB.JSON STATUS ===");
console.log(`Total Products: ${db.products.length}`);

const names = db.products.map(p => p.name.trim().toLowerCase());
const nameCounts = {};
for (const n of names) {
  nameCounts[n] = (nameCounts[n] || 0) + 1;
}

const duplicates = Object.entries(nameCounts).filter(([_, count]) => count > 1);
console.log(`Duplicate Names Count: ${duplicates.length}`);
if (duplicates.length > 0) {
  console.log("Found duplicates:", duplicates);
} else {
  console.log("✓ ZERO DUPLICATES! Every product is 100% distinct.");
}

const verifiedCount = db.products.filter(p => p.verification && p.verification.referenceId).length;
console.log(`Products with Verified Sourcing Data: ${verifiedCount} / ${db.products.length}`);
