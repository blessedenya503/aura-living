const https = require("https");

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

async function lookupBarcode(barcode) {
  const url = `https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`;
  const data = await fetchJson(url);
  if (data && data.product) {
    const img = data.product.image_front_url || data.product.image_url;
    if (img && (await checkHead(img))) {
      return {
        name: data.product.product_name || "",
        brand: data.product.brands || "",
        image: img
      };
    }
  }
  return null;
}

const BARCODES = {
  "prod-nivea-creme-classic": "4005808890590",
  "prod-nivea-soft": "4005808890576",
  "prod-nivea-q10-power": "4005900545503",
  "prod-nivea-q10-night": "4005900545534",
  "prod-nivea-luminous630": "4005900783394",
  "prod-nivea-luminous-fluid": "4005900783424",
  "prod-nivea-cocoa-butter": "4005900273765",
  "prod-nivea-repair-care-cream": "4005900784278",
  "prod-nivea-sun-protect-lotion": "4005900824967",
  "prod-nivea-sun-shine-control": "4005900695758",
  "prod-cerave-moisturizing-cream": "3606000537330",
  "prod-cerave-daily-lotion": "3337875597203",
  "prod-cerave-pm-lotion": "3606000537446",
  "prod-cerave-sa-cream": "3337875684101",
  "prod-cerave-hydrating-cleanser": "3337875597180",
  "prod-laroche-posay-cicaplast": "3337875816847",
  "prod-laroche-posay-anthelios-uvmune": "3337875777797",
  "prod-laroche-posay-hyalu-b5": "3337875583626",
  "prod-laroche-posay-lipikar-balm": "3337875696548",
  "prod-laroche-posay-effaclar-duo": "3337875863377",
  "prod-laroche-posay-toleriane-dermallergo": "3337875757614",
  "prod-paulas-choice-bha": "0655439007962",
  "prod-the-ordinary-niacinamide": "0769915190311",
  "prod-the-ordinary-hyaluronic": "0769915190281",
  "prod-the-ordinary-glycolic": "0769915190892",
  "prod-cosrx-snail-96": "8809416470009"
};

async function main() {
  console.log("Checking barcode packshots...");
  const results = {};
  for (const [id, code] of Object.entries(BARCODES)) {
    const res = await lookupBarcode(code);
    if (res) {
      console.log(`[FOUND] ${id} (${res.brand} - ${res.name}): ${res.image}`);
      results[id] = res.image;
    } else {
      console.log(`[NOT FOUND] ${id} for barcode ${code}`);
    }
  }
  fs.writeFileSync("scripts/found-barcodes.json", JSON.stringify(results, null, 2));
}

main();
