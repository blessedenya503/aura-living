const fs = require("fs");
const path = require("path");
const https = require("https");

const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

function checkHead(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: "HEAD",
          timeout: 6000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "image/*,*/*;q=0.8",
          },
        },
        (res) => resolve({ ok: res.statusCode >= 200 && res.statusCode < 400, status: res.statusCode })
      );
      req.on("error", () => resolve({ ok: false, status: 500 }));
      req.on("timeout", () => { req.destroy(); resolve({ ok: false, status: 408 }); });
      req.end();
    } catch {
      resolve({ ok: false, status: 500 });
    }
  });
}

async function searchOpenBeautyFacts(brand, name) {
  // Clean name for best query precision
  const cleanTerms = name
    .replace(/Alibaba (OEM|ODM)/gi, "")
    .replace(/SPF \d+\+?/gi, "")
    .replace(/\d+ml|\d+g/gi, "")
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join(" ");

  const query = `${brand} ${cleanTerms}`;
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1`;

  try {
    const res = await fetch(url, { headers: { "User-Agent": "AuraStorePackshotAuditor/1.0" } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.products && data.products.length > 0) {
      for (const p of data.products) {
        const img = p.image_front_url || p.image_url;
        if (img && img.startsWith("https://images.openbeautyfacts.org")) {
          return { name: p.product_name, img };
        }
      }
    }
  } catch (err) {
    // ignore
  }
  return null;
}

async function main() {
  console.log(`Analyzing ${db.products.length} products for matching packshot consistency...`);

  const brands = {};
  for (const p of db.products) {
    brands[p.brand] = (brands[p.brand] || 0) + 1;
  }
  console.log("Brand breakdown:", JSON.stringify(brands, null, 2));
}

main();
