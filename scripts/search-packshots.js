const https = require("https");
const fs = require("fs");

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { "User-Agent": "AntiProjectBot/1.0 (contact@auraliving.store)" } }, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); } catch(e) { resolve(null); }
      });
    }).on("error", () => resolve(null));
  });
}

function checkHead(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request({
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "HEAD",
        timeout: 4000
      }, res => resolve(res.statusCode >= 200 && res.statusCode < 400));
      req.on("error", () => resolve(false));
      req.on("timeout", () => { req.destroy(); resolve(false); });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function findMatch(term) {
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=10`;
  const data = await fetchJson(url);
  if (data && data.products) {
    for (const p of data.products) {
      const img = p.image_front_url || p.image_url;
      if (img && (await checkHead(img))) {
        return {
          title: p.product_name || p.generic_name || "",
          brand: p.brands || "",
          img
        };
      }
    }
  }
  return null;
}

const SEARCH_TERMS = [
  "Nivea Q10 Night",
  "Nivea Luminous 630",
  "Nivea Luminous",
  "Nivea Cocoa Butter",
  "Nivea Repair Care",
  "Nivea Men Creme",
  "Nivea Sun Protect",
  "Nivea Sun Shine Control",
  "CeraVe Moisturising Lotion",
  "CeraVe Facial Moisturising Lotion",
  "CeraVe Retinol",
  "CeraVe Night Cream",
  "The Ordinary Niacinamide",
  "The Ordinary Hyaluronic Acid",
  "The Ordinary Glycolic Acid",
  "The Ordinary Buffet",
  "The Ordinary Peptides",
  "Cosrx Snail Essence",
  "Cosrx Snail Cream",
  "Beauty of Joseon Sun",
  "Beauty of Joseon Dynasty",
  "Anua Heartleaf",
  "Skin1004 Centella",
  "Round Lab Dokdo",
  "Torriden Dive In"
];

async function main() {
  const found = {};
  for (const t of SEARCH_TERMS) {
    const res = await findMatch(t);
    if (res) {
      console.log(`[FOUND] "${t}" => (${res.brand} - ${res.title}): ${res.img}`);
      found[t] = res.img;
    } else {
      console.log(`[NOT FOUND] "${t}"`);
    }
  }
  fs.writeFileSync("scripts/search-found.json", JSON.stringify(found, null, 2));
}

main();
