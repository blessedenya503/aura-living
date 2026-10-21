const https = require("https");
const fs = require("fs");
const path = require("path");

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "AntiProjectBot/1.0 (contact@auraliving.store)" } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); } catch(e) { reject(e); }
      });
    }).on("error", reject);
  });
}

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: "HEAD",
          timeout: 4000,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        },
        (res) => resolve(res.statusCode >= 200 && res.statusCode < 400)
      );
      req.on("error", () => resolve(false));
      req.on("timeout", () => { req.destroy(); resolve(false); });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function searchObf(query) {
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=5`;
  try {
    const data = await fetchJson(url);
    if (data.products && data.products.length > 0) {
      for (const p of data.products) {
        const img = p.image_front_url || p.image_url;
        if (img && (await checkUrl(img))) {
          return {
            title: p.product_name || p.generic_name || "",
            image: img
          };
        }
      }
    }
  } catch {}
  return null;
}

async function main() {
  const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

  console.log(`Searching OpenBeautyFacts for matching real packshot images for ${db.products.length} products...`);
  
  const matches = {};

  for (let i = 0; i < db.products.length; i++) {
    const prod = db.products[i];
    // Formulate a smart short search term
    const shortSearch = `${prod.brand} ${prod.name.replace(prod.brand, "").split(" ").slice(0, 3).join(" ")}`.trim();
    const res = await searchObf(shortSearch);
    if (res) {
      console.log(`[${i + 1}/50] MATCH for "${prod.name}":\n       => ${res.title} (${res.image})`);
      matches[prod.id] = res.image;
    } else {
      console.log(`[${i + 1}/50] NO DIRECT MATCH for "${shortSearch}"`);
    }
  }

  fs.writeFileSync("scripts/obf-matches.json", JSON.stringify(matches, null, 2), "utf-8");
  console.log(`\nMatched ${Object.keys(matches).length} products on OpenBeautyFacts.`);
}

main();
