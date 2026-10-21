const fs = require("fs");
const path = require("path");

async function testAveneAndAquaphor() {
  const queries = [
    "Avene Cicalfate",
    "Avene Thermal Spring",
    "Aquaphor Healing Ointment",
    "Eucerin Hyaluron Filler",
    "Eucerin UreaRepair",
    "Drunk Elephant Protini",
    "Drunk Elephant Lala Retro",
    "Drunk Elephant B Hydra",
    "Tatcha Water Cream",
    "Tatcha Dewy Skin",
    "Tatcha Rice Polish"
  ];

  for (const q of queries) {
    const url = `https://world.openbeautyfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=5`;
    const res = await fetch(url, { headers: { "User-Agent": "AuraSkincarePackshotCatalog/1.0" } });
    if (!res.ok) continue;
    const data = await res.json();
    const imgs = (data.products || [])
      .map(p => ({ name: p.product_name, img: p.image_front_url || p.image_url }))
      .filter(p => p.img && p.img.startsWith("https://images.openbeautyfacts.org"));
    console.log(`Query "${q}" -> ${imgs.length} matches:`, imgs[0] ? `${imgs[0].name} => ${imgs[0].img}` : "None");
  }
}

testAveneAndAquaphor();
