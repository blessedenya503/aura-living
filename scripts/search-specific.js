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

async function test(term) {
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=5`;
  const res = await fetchJson(url);
  if (res && res.products) {
    console.log(`\n=== "${term}" (${res.products.length}) ===`);
    res.products.forEach(p => {
      console.log(`  - [${p.brands}] ${p.product_name}: ${p.image_front_url || p.image_url}`);
    });
  }
}

async function main() {
  await test("The Ordinary Niacinamide");
  await test("COSRX Advanced Snail");
  await test("COSRX Snail 96");
  await test("COSRX Snail 92");
  await test("Torriden Dive-In");
  await test("Round Lab Dokdo");
}

main();
