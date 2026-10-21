const fs = require("fs");
const path = require("path");

function fixFile(full) {
  let content = fs.readFileSync(full, "utf8");
  if (content.charCodeAt(0) === 34) { // quote
    try {
      let parsed = JSON.parse(content);
      fs.writeFileSync(full, parsed, "utf8");
      console.log("Fixed:", full);
    } catch (e) {
      // If it doesn't end cleanly with a quote or has trailing newline
      let trimmed = content.trim();
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        try {
          let parsed = JSON.parse(trimmed);
          fs.writeFileSync(full, parsed, "utf8");
          console.log("Fixed trimmed:", full);
        } catch (e2) {
          console.error("Trimmed parse failed:", full, e2.message);
        }
      }
    }
  }
}

function walk(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      if (item !== "node_modules" && item !== ".next") walk(full);
    } else {
      fixFile(full);
    }
  }
}

walk("C:/Users/Blessed/Desktop/PrepPulse");
console.log("Done walking.");
