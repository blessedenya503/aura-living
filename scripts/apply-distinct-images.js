const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const verifiedImagesPath = path.join(__dirname, "verified-images.json");
const productsTsPath = path.join(__dirname, "..", "src", "data", "products.ts");

const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const verifiedImages = JSON.parse(fs.readFileSync(verifiedImagesPath, "utf-8"));

console.log(`Assigning 100% distinct images to ${db.products.length} products using pool of ${verifiedImages.length} verified online images...`);

const usedImages = new Set();

db.products.forEach((product, idx) => {
  const primaryImage = verifiedImages[idx % verifiedImages.length];
  if (usedImages.has(primaryImage)) {
    console.error(`WARNING: Image collision for product ${idx}: ${primaryImage}`);
  }
  usedImages.add(primaryImage);

  product.image = primaryImage;
  
  // Also provide distinct gallery
  const secondaryImage = verifiedImages[(idx + 1) % verifiedImages.length];
  product.gallery = [primaryImage];
  
  // Also update variant image if set
  if (product.variants && product.variants.length > 0) {
    product.variants[0].image = primaryImage;
  }
});

console.log(`Verification:`);
console.log(`Total Products: ${db.products.length}`);
console.log(`Unique Product Images: ${usedImages.size}`);
console.log(`Image Collisions / Doubles: ${db.products.length - usedImages.size} (MUST BE ZERO)`);

if (db.products.length !== usedImages.size) {
  console.error("FAILED: Image collision detected!");
  process.exit(1);
}

// Write to store-db.json
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
console.log(`Successfully updated ${dbPath}`);

// Sync to INITIAL_PRODUCTS in products.ts
let tsContent = fs.readFileSync(productsTsPath, "utf-8");
const splitToken = "export const INITIAL_PRODUCTS: Product[] = [";
const splitIdx = tsContent.indexOf(splitToken);

if (splitIdx !== -1) {
  const header = tsContent.substring(0, splitIdx + splitToken.length);
  const productsFormatted = JSON.stringify(db.products, null, 2);
  const innerJson = productsFormatted.substring(1, productsFormatted.length - 1).trim();
  const newContent = `${header}\n${innerJson}\n];\n`;
  fs.writeFileSync(productsTsPath, newContent, "utf-8");
  console.log(`Synced ${db.products.length} products with distinct images into src/data/products.ts`);
}
