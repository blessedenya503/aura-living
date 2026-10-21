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

async function search(q) {
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=8`;
  const data = await fetchJson(url);
  if (data && data.products) {
    console.log(`\n=== Results for "${q}" (${data.products.length}) ===`);
    data.products.forEach(p => {
      const img = p.image_front_url || p.image_url;
      if (img) {
        console.log(`  * [${p.brands}] ${p.product_name}: ${img}`);
      }
    });
  }
}

async function main() {
  await search("ordinary niacinamide");
  await search("ordinary 10%");
  await search("cosrx essence");
  await search("cosrx snail");
  await search("beauty of joseon");
  await search("anua toner");
  await search("skin1004 centella ampoule");
  await search("dokdo cream");
  await search("torriden dive in");
}

main();
