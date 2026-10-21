const fs = require("fs");
const path = require("path");

async function fetchOBF(query, pageSize = 50) {
  const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=${pageSize}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "AuraSkincarePackshotCatalog/1.0" } });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.products) return [];
    return data.products
      .map(p => ({
        name: p.product_name || p.generic_name || "",
        brands: p.brands || "",
        image: p.image_front_url || p.image_url || "",
        code: p.code
      }))
      .filter(p => p.image && p.image.startsWith("https://images.openbeautyfacts.org"));
  } catch (err) {
    return [];
  }
}

async function testBrands() {
  const brands = [
    "Eucerin",
    "Avene",
    "Bioderma",
    "Neutrogena",
    "The Ordinary",
    "COSRX",
    "Beauty of Joseon",
    "Anua",
    "Skin1004",
    "Round Lab",
    "Haruharu",
    "Drunk Elephant",
    "Tatcha",
    "Paula's Choice",
    "CeraVe",
    "La Roche-Posay"
  ];

  for (const b of brands) {
    const prods = await fetchOBF(b, 50);
    console.log(`Brand [${b}]: Found ${prods.length} packshots`);
  }
}

testBrands();
