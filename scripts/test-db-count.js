const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const currentDb = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

console.log(`Current products count: ${currentDb.products.length}`);
