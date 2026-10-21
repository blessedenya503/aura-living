// Restore any product whose AI image file is missing back to a working stock image (temporary until real/AI image exists).
const fs = require("fs");
const path = require("path");
const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
let fixed = 0;
for (const p of db.products) {
  if (p.image.startsWith("/products/ai/") && !fs.existsSync(path.join(__dirname, "..", "public", p.image))) {
    p.image = "https://images.pexels.com/photos/6621431/pexels-photo-6621431.jpeg?auto=compress&cs=tinysrgb&w=800&entry=" + p.id;
    p.gallery = [p.image];
    p.imageSource = "stock";
    fixed++;
    console.log("restored", p.id);
  }
  if (p.imageSource === "ai-generated" && !p.image.startsWith("/products/ai/")) p.imageSource = "stock";
}
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log("fixed", fixed, "| total", db.products.length);
