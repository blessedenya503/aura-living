const fs = require("fs");
const path = require("path");

function fixFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  if (raw.startsWith('"\\"') || raw.startsWith('"use client"') || raw.startsWith('"')) {
    try {
      // It was double encoded as JSON string literal
      const unescaped = JSON.parse(raw);
      fs.writeFileSync(filePath, unescaped, "utf8");
      console.log("Successfully fixed:", filePath);
    } catch (e) {
      console.log("JSON.parse error on", filePath, e.message);
    }
  }
}

const dir = "C:/Users/Blessed/Desktop/PrepPulse";
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      if (f !== "node_modules" && f !== ".next") walk(p);
    } else if (/\.(tsx?|json|css|mjs)$/.test(f)) {
      fixFile(p);
    }
  }
}

walk(dir);
console.log("Finished unescaping PrepPulse files.");
