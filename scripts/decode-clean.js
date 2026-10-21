const fs = require("fs");
const path = require("path");

function unquote(str) {
  let s = str.trim();
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1);
  }
  // replace escaped characters
  return s
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\\/g, "\\");
}

function processDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (f !== "node_modules" && f !== ".next") processDir(full);
    } else if (/\.(tsx?|json|css|mjs)$/.test(f)) {
      const content = fs.readFileSync(full, "utf8");
      if (content.startsWith('"') && (content.includes('\\n') || content.includes('\\"'))) {
        const decoded = unquote(content);
        fs.writeFileSync(full, decoded, "utf8");
        console.log("Decoded cleanly:", full);
      }
    }
  }
}

processDir("C:/Users/Blessed/Desktop/PrepPulse");
console.log("All PrepPulse files completely decoded.");
