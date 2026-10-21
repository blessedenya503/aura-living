const https = require("https");

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

async function getBrandProducts(brand) {
  const url = `https://world.openbeautyfacts.org/brand/${encodeURIComponent(brand.toLowerCase())}.json`;
  try {
    const data = await fetchJson(url);
    if (data.products) {
      console.log(`\n=== Brand: ${brand} (Found ${data.products.length} products) ===`);
      const sample = data.products
        .filter(p => p.image_front_url || p.image_url)
        .slice(0, 8)
        .map(p => ({
          name: p.product_name || p.generic_name || "Unnamed",
          img: p.image_front_url || p.image_url
        }));
      sample.forEach(s => console.log(`  - ${s.name}: ${s.img}`));
    } else {
      console.log(`Brand ${brand}: no products array`);
    }
  } catch (err) {
    console.error(`Error for ${brand}:`, err.message);
  }
}

async function main() {
  await getBrandProducts("nivea");
  await getBrandProducts("cerave");
  await getBrandProducts("la-roche-posay");
  await getBrandProducts("the-ordinary");
  await getBrandProducts("cosrx");
}

main();
