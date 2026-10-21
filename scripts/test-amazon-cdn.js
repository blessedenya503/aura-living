const https = require("https");

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const u = new URL(url);
      const req = https.request(
        {
          hostname: u.hostname,
          path: u.pathname,
          method: "HEAD",
          timeout: 5000,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
          }
        },
        (res) => {
          resolve({ ok: res.statusCode === 200, status: res.statusCode });
        }
      );
      req.on("error", () => resolve({ ok: false }));
      req.on("timeout", () => { req.destroy(); resolve({ ok: false }); });
      req.end();
    } catch {
      resolve({ ok: false });
    }
  });
}

async function testAmazonSamples() {
  // Test some known skincare packshots on Amazon CDN
  const samples = [
    "https://m.media-amazon.com/images/I/61bKk8V-k1L._SL1500_.jpg", // COSRX Snail 96
    "https://m.media-amazon.com/images/I/71u9c7m4yRL._SL1500_.jpg", // CeraVe Moisturizing Cream
    "https://m.media-amazon.com/images/I/51bYxIeG6vL._SL1500_.jpg", // Beauty of Joseon Relief Sun
    "https://m.media-amazon.com/images/I/61w6Yt4rV+L._SL1500_.jpg", // Paula's Choice 2% BHA
  ];

  for (const s of samples) {
    const res = await checkUrl(s);
    console.log(`${s.slice(0, 50)}... => Status: ${res.status}`);
  }
}

testAmazonSamples();
