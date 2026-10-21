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

async function main() {
  const url = "https://world.openbeautyfacts.org/cgi/search.pl?search_terms=ordinary&search_simple=1&action=process&json=1&page_size=50";
  const data = await fetchJson(url);
  if (data && data.products) {
    console.log(`Found ${data.products.length} products for 'ordinary':`);
    data.products.forEach(p => {
      const img = p.image_front_url || p.image_url;
      if (img) {
        console.log(`  - [${p.code}] ${p.product_name}: ${img}`);
      }
    });
  }
}

main();
