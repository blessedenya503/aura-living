const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..", "src");
const re = /3,?000\+?|3k\+|\b3\.?0k\b|\b3[0-9]{3}\+/i;
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p);
    else if (/\.(tsx?|json)$/.test(f) && !/products\.ts$|store-db\.json$/.test(f)) {
      fs.readFileSync(p, "utf-8").split("\n").forEach((line, i) => {
        if (re.test(line) && !/localhost|PORT|port/.test(line)) console.log(path.relative(root, p) + ":" + (i + 1) + ": " + line.trim().slice(0, 160));
      });
    }
  }
}
walk(root);
const db = require("../src/data/store-db.json");
console.log("Actual product count in DB:", db.products.length);
