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

async function searchObf(q) {
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=10`;
  const data = await fetchJson(url);
  if (data && data.products) {
    console.log(`\nQuery "${q}": found ${data.products.length} products`);
    data.products.slice(0, 5).forEach(p => {
      const img = p.image_front_url || p.image_url;
      if (img) {
        console.log(`  - [${p.brands}] ${p.product_name}: ${img}`);
      }
    });
  } else {
    console.log(`\nQuery "${q}": no products`);
  }
}

async function main() {
  await searchObf("Niacinamide 10% Zinc 1%");
  await searchObf("Cosrx Snail 96");
  await searchObf("Cosrx 92");
  await searchObf("CeraVe PM");
  await searchObf("CeraVe Healing");
  await searchObf("Dynasty Cream");
  await searchObf("Radiant Beauty");
}

main();
