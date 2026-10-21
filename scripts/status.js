const fs = require("fs");
const path = require("path");
const d = require("../src/data/store-db.json");
const dir = path.join(__dirname, "..", "public", "products", "ai");
console.log("ai files:", fs.existsSync(dir) ? fs.readdirSync(dir) : []);
d.products.filter((p) => p.imageSource).forEach((p) =>
  console.log(p.id, "|", p.name, "|", p.imageSource, "|", (p.packagingDescription || "").slice(0, 120))
);
const c = {};
d.products.forEach((p) => { const k = p.imageSource || (p.image.includes("pexels") ? "stock" : "obf-old"); c[k] = (c[k] || 0) + 1; });
console.log(c);
