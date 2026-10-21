const fs = require("fs");
const path = require("path");

function stripLeadingQuotes(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== "node_modules" && f !== ".next") stripLeadingQuotes(full);
    } else if (/\.(tsx?|json|css|mjs)$/.test(f)) {
      let content = fs.readFileSync(full, "utf8");
      if (content.startsWith('""')) {
        content = content.slice(1);
        if (content.endsWith('"')) content = content.slice(0, -1);
        fs.writeFileSync(full, content, "utf8");
        console.log("Stripped double quote:", full);
      }
    }
  }
}

stripLeadingQuotes("C:/Users/Blessed/Desktop/PrepPulse");
console.log("Double quotes stripped.");
