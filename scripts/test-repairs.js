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
          timeout: 4000,
          headers: { "User-Agent": "Mozilla/5.0" },
        },
        (res) => resolve(res.statusCode >= 200 && res.statusCode < 400)
      );
      req.on("error", () => resolve(false));
      req.on("timeout", () => { req.destroy(); resolve(false); });
      req.end();
    } catch {
      resolve(false);
    }
  });
}

async function findActive() {
  const candidates = [
    // Paula's choice resist
    "https://images.openbeautyfacts.org/images/products/065/543/900/7801/front_en.13.400.jpg",
    "https://images.openbeautyfacts.org/images/products/065/543/900/7801/front_en.15.400.jpg",
    "https://images.openbeautyfacts.org/images/products/065/543/900/7801/front_en.7.400.jpg",
    "https://images.openbeautyfacts.org/images/products/065/543/902/0909/front_en.3.400.jpg",
    "https://images.openbeautyfacts.org/images/products/065/543/902/0909/front_en.5.400.jpg",
    "https://images.openbeautyfacts.org/images/products/065/543/902/0909/front_en.9.400.jpg",
    // Nivea Radiant & Beauty Even Glow
    "https://images.openbeautyfacts.org/images/products/600/105/100/5238/front_en.3.400.jpg",
    "https://images.openbeautyfacts.org/images/products/600/105/100/5245/front_en.3.400.jpg",
    "https://images.openbeautyfacts.org/images/products/400/590/092/5022/front_en.3.400.jpg",
    "https://images.openbeautyfacts.org/images/products/400/590/092/5022/front_de.3.400.jpg",
    // Yilong body butter
    "https://images.pexels.com/photos/4465829/pexels-photo-4465829.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800"
  ];

  for (const c of candidates) {
    const ok = await checkHead(c);
    console.log(`${ok ? "[OK]" : "[FAIL]"} ${c}`);
  }
}

findActive();
