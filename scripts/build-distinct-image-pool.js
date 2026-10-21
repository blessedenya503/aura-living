const https = require("https");

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request(
        {
          hostname: u.hostname,
          path: u.pathname + u.search,
          method: "HEAD",
          timeout: 4000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "image/webp,image/apng,image/*,*/*;q=0.8",
          },
        },
        (res) => {
          resolve(res.statusCode >= 200 && res.statusCode < 400);
        }
      );
      req.on("error", () => resolve(false));
      req.on("timeout", () => {
        req.destroy();
        resolve(false);
      });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

const CANDIDATES = [
  // --- VERIFIED UNSPLASH BEAUTY & SKINCARE (Confirmed Working) ---
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1629732047847-50219e9c5aef?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=1000&auto=format&fit=crop",

  // --- VERIFIED PEXELS DIRECT CDN SKINCARE & BEAUTY PRODUCTS ---
  "https://images.pexels.com/photos/6168343/pexels-photo-6168343.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/14215459/pexels-photo-14215459.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/33756874/pexels-photo-33756874.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/12115040/pexels-photo-12115040.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/20377674/pexels-photo-20377674.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6925480/pexels-photo-6925480.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/9496412/pexels-photo-9496412.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4119559/pexels-photo-4119559.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/29755259/pexels-photo-29755259.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/9775408/pexels-photo-9775408.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/17891765/pexels-photo-17891765.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/16008945/pexels-photo-16008945.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4857813/pexels-photo-4857813.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/12124912/pexels-photo-12124912.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/34544440/pexels-photo-34544440.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/16378451/pexels-photo-16378451.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/15569182/pexels-photo-15569182.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/8989967/pexels-photo-8989967.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6568231/pexels-photo-6568231.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/9485797/pexels-photo-9485797.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/7446659/pexels-photo-7446659.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/14983053/pexels-photo-14983053.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/15633556/pexels-photo-15633556.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/25867568/pexels-photo-25867568.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/17740925/pexels-photo-17740925.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/11538356/pexels-photo-11538356.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/30455874/pexels-photo-30455874.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/30282121/pexels-photo-30282121.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/30282119/pexels-photo-30282119.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/30455899/pexels-photo-30455899.jpeg?auto=compress&cs=tinysrgb&w=800",

  // --- ADDITIONAL CURATED HIGH-RES SKINCARE PHOTO IDENTIFIERS ---
  "https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3738349/pexels-photo-3738349.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3762871/pexels-photo-3762871.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4465829/pexels-photo-4465829.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4465832/pexels-photo-4465832.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4612159/pexels-photo-4612159.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4735904/pexels-photo-4735904.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4938505/pexels-photo-4938505.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5217882/pexels-photo-5217882.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5797991/pexels-photo-5797991.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6621472/pexels-photo-6621472.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6763617/pexels-photo-6763617.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/6763618/pexels-photo-6763618.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/7262402/pexels-photo-7262402.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/7262996/pexels-photo-7262996.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/7263015/pexels-photo-7263015.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/7528448/pexels-photo-7528448.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/7795808/pexels-photo-7795808.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/8054418/pexels-photo-8054418.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/8128069/pexels-photo-8128069.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/8467970/pexels-photo-8467970.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/8468000/pexels-photo-8468000.jpeg?auto=compress&cs=tinysrgb&w=800"
];

async function main() {
  console.log(`Testing ${CANDIDATES.length} candidate images concurrently...`);
  const results = [];
  
  // Test in chunks of 5
  for (let i = 0; i < CANDIDATES.length; i += 5) {
    const chunk = CANDIDATES.slice(i, i + 5);
    const checks = await Promise.all(
      chunk.map(async (url) => {
        const ok = await checkUrl(url);
        return { url, ok };
      })
    );
    for (const r of checks) {
      if (r.ok) {
        results.push(r.url);
        console.log(`[VERIFIED ${results.length}] ${r.url}`);
      } else {
        console.log(`[FAIL] ${r.url}`);
      }
    }
  }

  console.log(`\n==========================================`);
  console.log(`Total verified working distinct images: ${results.length}`);
  console.log(`==========================================`);
  
  const fs = require("fs");
  fs.writeFileSync("scripts/verified-images.json", JSON.stringify(results, null, 2), "utf-8");
}

main();
