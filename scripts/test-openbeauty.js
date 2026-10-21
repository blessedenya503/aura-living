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

async function searchProduct(term) {
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}&search_simple=1&action=process&json=1&page_size=5`;
  const data = await fetchJson(url);
  if (data.products && data.products.length > 0) {
    for (const p of data.products) {
      if (p.image_url || p.image_front_url) {
        return {
          name: p.product_name,
          brand: p.brands,
          image: p.image_front_url || p.image_url
        };
      }
    }
  }
  return null;
}

async function main() {
  const testTerms = [
    "Nivea Creme",
    "Nivea Soft",
    "Nivea Q10",
    "CeraVe Moisturizing Cream",
    "CeraVe Hydrating Cleanser",
    "La Roche Posay Cicaplast",
    "COSRX Snail",
    "The Ordinary Niacinamide",
    "Paula's Choice BHA"
  ];

  for (const t of testTerms) {
    try {
      const res = await searchProduct(t);
      if (res) {
        console.log(`[FOUND] "${t}" => ${res.brand} - ${res.name}: ${res.image}`);
      } else {
        console.log(`[NOT FOUND] "${t}"`);
      }
    } catch(err) {
      console.log(`[ERROR] "${t}": ${err.message}`);
    }
  }
}

main();
