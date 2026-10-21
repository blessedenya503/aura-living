const fs = require("fs");
const path = require("path");

function unescapeAll(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (item !== "node_modules" && item !== ".next") {
        unescapeAll(full);
      }
    } else if (/\.(tsx?|json|css|js|mjs)$/.test(item)) {
      let content = fs.readFileSync(full, "utf8");
      if (content.startsWith('"') && content.endsWith('"')) {
        try {
          const parsed = JSON.parse(content);
          fs.writeFileSync(full, parsed, "utf8");
          console.log("Unescaped:", full);
        } catch (e) {
          console.error("Failed to parse:", full, e.message);
        }
      }
    }
  }
}

unescapeAll("C:/Users/Blessed/Desktop/PrepPulse");
console.log("Unescape complete.");
