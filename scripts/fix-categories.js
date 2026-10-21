const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const productsTsPath = path.join(__dirname, "..", "src", "data", "products.ts");

const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

const CATEGORY_MAP = {
  "Moisturizers": "Moisturizing Creams",
  "Serums": "Active Serums & Toners",
  "Cleansers": "Gentle Cleansers & Masks",
  "Sunscreen": "Sunscreen & Daily Defense",
  "Body Care": "Radiant Body Care",
  "Eye Cream": "Anti-Aging & Q10"
};

let updated = 0;
for (const p of db.products) {
  if (CATEGORY_MAP[p.category]) {
    p.category = CATEGORY_MAP[p.category];
    updated++;
  }
}

console.log(`Updated ${updated} product categories to valid union strings.`);

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");

// Sync to products.ts
let tsContent = fs.readFileSync(productsTsPath, "utf-8");
const splitToken = "export const INITIAL_PRODUCTS: Product[] = [";
const splitIdx = tsContent.indexOf(splitToken);

if (splitIdx !== -1) {
  const header = tsContent.substring(0, splitIdx + splitToken.length);
  const productsFormatted = JSON.stringify(db.products, null, 2);
  const innerJson = productsFormatted.substring(1, productsFormatted.length - 1).trim();
  const newContent = `${header}\n${innerJson}\n];\n`;
  fs.writeFileSync(productsTsPath, newContent, "utf-8");
  console.log(`Synced ${db.products.length} products into src/data/products.ts`);
}
