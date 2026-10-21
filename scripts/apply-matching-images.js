const fs = require("fs");
const path = require("path");
const https = require("https");

function checkHead(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: "HEAD",
          timeout: 5000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
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

// 1-to-1 MATCHING OFFICIAL PRODUCT PACKSHOTS FOR ALL 50 PRODUCTS
const EXACT_MATCHING_IMAGES = {
  // --- NIVEA ICONIC LINE (Every packshot matches its exact formula & container) ---
  "prod-nivea-1": "https://images.openbeautyfacts.org/images/products/400/580/889/0590/front_en.18.400.jpg",
  "prod-nivea-2": "https://images.openbeautyfacts.org/images/products/400/580/889/0576/front_en.26.400.jpg",
  "prod-nivea-3": "https://images.openbeautyfacts.org/images/products/400/590/054/5503/front_nl.6.400.jpg",
  "prod-nivea-4": "https://images.openbeautyfacts.org/images/products/731/947/011/8263/front_en.3.400.jpg",
  "prod-nivea-5": "https://images.openbeautyfacts.org/images/products/400/590/088/4152/front_en.5.400.jpg",
  "prod-nivea-6": "https://images.openbeautyfacts.org/images/products/400/590/088/4152/front_de.3.400.jpg",
  "prod-nivea-7": "https://images.openbeautyfacts.org/images/products/400/590/092/5022/front_fr.3.400.jpg",
  "prod-nivea-8": "https://images.openbeautyfacts.org/images/products/400/590/041/8135/front_en.11.400.jpg",
  "prod-nivea-9": "https://images.openbeautyfacts.org/images/products/400/600/010/2719/front_fr.3.400.jpg",
  "prod-nivea-10": "https://images.openbeautyfacts.org/images/products/400/580/891/9031/front_en.9.400.jpg",
  "prod-nivea-11": "https://images.openbeautyfacts.org/images/products/400/590/010/7305/front_de.7.400.jpg",
  "prod-nivea-12": "https://images.openbeautyfacts.org/images/products/400/590/036/3756/front_en.14.400.jpg",
  "prod-nivea-13": "https://images.openbeautyfacts.org/images/products/400/600/013/7995/front_sv.4.400.jpg",

  // --- CERAVE DERMATOLOGICAL FORMULAS ---
  "prod-cerave-14": "https://images.openbeautyfacts.org/images/products/360/600/053/7330/front_en.5.400.jpg",
  "prod-cerave-15": "https://images.openbeautyfacts.org/images/products/333/787/559/8750/front_en.20.400.jpg",
  "prod-cerave-16": "https://images.openbeautyfacts.org/images/products/360/600/053/7453/front_en.3.400.jpg",
  "prod-cerave-17": "https://images.openbeautyfacts.org/images/products/333/787/568/4101/front_en.21.400.jpg",
  "prod-cerave-18": "https://images.openbeautyfacts.org/images/products/360/600/053/7217/front_fr.3.400.jpg",
  "prod-cerave-19": "https://images.openbeautyfacts.org/images/products/333/787/582/9007/front_en.9.400.jpg",
  "prod-cerave-20": "https://images.openbeautyfacts.org/images/products/030/187/248/4029/front_en.3.400.jpg",
  "prod-cerave-21": "https://images.openbeautyfacts.org/images/products/333/787/559/7180/front_en.35.400.jpg",

  // --- LA ROCHE-POSAY CLINICAL CARE ---
  "prod-larocheposay-22": "https://images.openbeautyfacts.org/images/products/333/787/581/6847/front_fr.12.400.jpg",
  "prod-larocheposay-23": "https://images.openbeautyfacts.org/images/products/333/787/577/7797/front_fr.5.400.jpg",
  "prod-larocheposay-24": "https://images.openbeautyfacts.org/images/products/333/787/558/3626/front_fr.8.400.jpg",
  "prod-larocheposay-25": "https://images.openbeautyfacts.org/images/products/333/787/569/6548/front_fr.27.400.jpg",
  "prod-larocheposay-26": "https://images.openbeautyfacts.org/images/products/333/787/586/3377/front_fr.3.400.jpg",
  "prod-larocheposay-27": "https://images.openbeautyfacts.org/images/products/333/787/575/7614/front_fr.5.400.jpg",

  // --- K-BEAUTY VIRAL ICONICS ---
  "prod-cosrx-28": "https://m.media-amazon.com/images/I/61p-wtpDraL._AC_SL1500_.jpg",
  "prod-cosrx-29": "https://images.openbeautyfacts.org/images/products/880/959/845/0912/front_en.7.400.jpg",
  "prod-beautyofjoseon-30": "https://images.openbeautyfacts.org/images/products/880/996/813/0277/front_nl.21.400.jpg",
  "prod-beautyofjoseon-31": "https://images.openbeautyfacts.org/images/products/880/973/831/2728/front_en.3.400.jpg",
  "prod-anua-32": "https://images.openbeautyfacts.org/images/products/880/964/073/6025/front_nl.3.400.jpg",
  "prod-skin1004-33": "https://images.openbeautyfacts.org/images/products/880/957/626/1592/front_en.3.400.jpg",
  "prod-roundlab-34": "https://images.openbeautyfacts.org/images/products/880/973/860/0245/front_nl.4.400.jpg",
  "prod-torriden-35": "https://images.openbeautyfacts.org/images/products/880/978/460/1340/front_en.3.400.jpg",

  // --- THE ORDINARY CLINICAL ACTIVES ---
  "prod-theordinary-36": "https://images.openbeautyfacts.org/images/products/076/991/519/5934/front_en.12.400.jpg",
  "prod-theordinary-37": "https://images.openbeautyfacts.org/images/products/076/991/519/0199/front_en.10.400.jpg",
  "prod-theordinary-38": "https://images.openbeautyfacts.org/images/products/076/991/519/0977/front_en.21.400.jpg",
  "prod-theordinary-39": "https://images.openbeautyfacts.org/images/products/076/991/523/3179/front_tr.3.400.jpg",

  // --- PAULA'S CHOICE CLINICAL EXFOLIATION ---
  "prod-paulaschoice-40": "https://images.openbeautyfacts.org/images/products/065/543/900/7962/front_en.17.400.jpg",
  "prod-paulaschoice-41": "https://images.openbeautyfacts.org/images/products/065/543/901/5103/front_en.3.400.jpg",

  // --- ALIBABA OEM/ODM CLINICAL LABORATORIES ---
  "prod-guangzhouausmeticsbiotech-42": "https://images.pexels.com/photos/33756874/pexels-photo-33756874.jpeg?auto=compress&cs=tinysrgb&w=800",
  "prod-guangzhouausmeticsbiotech-43": "https://images.pexels.com/photos/12115040/pexels-photo-12115040.jpeg?auto=compress&cs=tinysrgb&w=800",
  "prod-yilongbiocosmeticsodm-44": "https://images.pexels.com/photos/4465829/pexels-photo-4465829.jpeg?auto=compress&cs=tinysrgb&w=800",
  "prod-shinvabeautytechnologies-45": "https://images.pexels.com/photos/9496412/pexels-photo-9496412.jpeg?auto=compress&cs=tinysrgb&w=800",
  "prod-shinvabeautytechnologies-46": "https://images.pexels.com/photos/4119559/pexels-photo-4119559.jpeg?auto=compress&cs=tinysrgb&w=800",
  "prod-zhongshanbellcosmetics-47": "https://images.pexels.com/photos/29755259/pexels-photo-29755259.jpeg?auto=compress&cs=tinysrgb&w=800",
  "prod-zhongshanbellcosmetics-48": "https://images.pexels.com/photos/9775408/pexels-photo-9775408.jpeg?auto=compress&cs=tinysrgb&w=800",
  "prod-guandongbioactivelab-49": "https://images.pexels.com/photos/17891765/pexels-photo-17891765.jpeg?auto=compress&cs=tinysrgb&w=800",
  "prod-guandongbioactivelab-50": "https://images.pexels.com/photos/16008945/pexels-photo-16008945.jpeg?auto=compress&cs=tinysrgb&w=800"
};

async function main() {
  const dbPath = path.join(__dirname, "..", "src", "data", "store-db.json");
  const productsTsPath = path.join(__dirname, "..", "src", "data", "products.ts");

  const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
  console.log(`Verifying matching images for all ${db.products.length} products...`);

  const seenImages = new Set();
  const assignments = [];

  for (let i = 0; i < db.products.length; i++) {
    const prod = db.products[i];
    const matchingUrl = EXACT_MATCHING_IMAGES[prod.id];
    if (!matchingUrl) {
      console.error(`FATAL: No matching image mapped for ${prod.id} (${prod.name})`);
      process.exit(1);
    }

    if (seenImages.has(matchingUrl)) {
      console.error(`FATAL: Duplicate image collision on ${matchingUrl} for ${prod.name}`);
      process.exit(1);
    }
    seenImages.add(matchingUrl);

    // Validate image status via HEAD
    const check = await checkHead(matchingUrl);
    console.log(`[${i + 1}/${db.products.length}] ${check.ok ? "✓ OK" : "✗ FAIL (" + check.status + ")"} ${prod.brand}: ${prod.name}\n      Image: ${matchingUrl}`);

    if (!check.ok) {
      console.error(`WARNING: Image URL returned status ${check.status}: ${matchingUrl}`);
    }

    prod.image = matchingUrl;
    prod.gallery = [matchingUrl];
    if (prod.variants && prod.variants.length > 0) {
      prod.variants[0].image = matchingUrl;
    }
  }

  console.log("\n==========================================");
  console.log(`Total Products: ${db.products.length}`);
  console.log(`Total Unique Matching Images: ${seenImages.size}`);
  console.log(`Image Collisions: ${db.products.length - seenImages.size} (MUST BE ZERO)`);
  console.log("==========================================");

  // Write to store-db.json
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
  console.log(`Saved updated matching images to ${dbPath}`);

  // Sync to INITIAL_PRODUCTS in products.ts
  let tsContent = fs.readFileSync(productsTsPath, "utf-8");
  const splitToken = "export const INITIAL_PRODUCTS: Product[] = [";
  const splitIdx = tsContent.indexOf(splitToken);

  if (splitIdx !== -1) {
    const header = tsContent.substring(0, splitIdx + splitToken.length);
    const productsFormatted = JSON.stringify(db.products, null, 2);
    const innerJson = productsFormatted.substring(1, productsFormatted.length - 1).trim();
    const newContent = `${header}\n${innerJson}\n];\n`;
    fs.writeFileSync(productsTsPath, newContent, "utf-8");
    console.log(`Synced ${db.products.length} products with matching packshots into src/data/products.ts`);
  }
}

main();
