const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const productsTsPath = path.join(__dirname, "..", "src", "data", "products.ts");

const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

let tsContent = fs.readFileSync(productsTsPath, "utf-8");

// Find where INITIAL_PRODUCTS starts
const splitToken = "export const INITIAL_PRODUCTS: Product[] = [";
const splitIdx = tsContent.indexOf(splitToken);

if (splitIdx !== -1) {
  const header = tsContent.substring(0, splitIdx + splitToken.length);
  const productsFormatted = JSON.stringify(db.products, null, 2);
  // remove outer brackets [ ] from json
  const innerJson = productsFormatted.substring(1, productsFormatted.length - 1).trim();
  
  const newContent = `${header}\n${innerJson}\n];\n`;
  fs.writeFileSync(productsTsPath, newContent, "utf-8");
  console.log(`Synced ${db.products.length} distinct verified products into src/data/products.ts`);
} else {
  console.error("Could not find INITIAL_PRODUCTS token in products.ts");
}
