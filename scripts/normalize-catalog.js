/**
 * Normalizes the catalog across src/data/store-db.json AND src/data/products.ts:
 *  - removes dropship / Amazon-Prime wording from all customer-facing text
 *  - fills missing supplierSource / shippingDays / description
 *  - mirrors every remote product image into public/uploads/products (higher-res)
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const DB_PATH = "src/data/store-db.json";
const TS_PATH = "src/data/products.ts";
const IMG_DIR = path.join("public", "uploads", "products");
fs.mkdirSync(IMG_DIR, { recursive: true });

const SHIPPING = "2–5 Days Tracked Express Delivery";
const SOURCE = "Direct Pharmaceutical Wholesale";

const REPLACEMENTS = [
  [/Authentic Amazon Prime Express Delivery \(2–4 Days\)/g, "100% Authentic • Tracked Express Delivery (2–5 Days)"],
  [/\s*Verified authentic batch registered under Amazon Bestseller Catalog \(ASIN: [A-Z0-9]+\)\./g, " Verified authentic, factory-sealed retail pack."],
  [/\s*Verified authentic batch registered under Amazon Bestseller Catalog\./g, " Verified authentic, factory-sealed retail pack."],
  [/\d[–-]\d Days \((?:Amazon )?Prime Dropship\)/g, SHIPPING],
  [/\((?:Amazon )?Prime Dropship\)/g, "(Tracked Express Delivery)"],
  [/Express Prime Courier Dispatch/g, "Tracked Express Courier Dispatch"],
  [/\d[–-]\d Days Express Tracked Courier Dispatch/g, SHIPPING],
  [/delivery timeframe\?/g, "delivery timeframe?"],
  [/dropshipping/gi, "shipping"],
  [/Express Dropship/gi, "Express Delivery"],
  [/Amazon Bestseller Catalog/g, "Bestseller"],
  [/Amazon Prime/g, "Express"],
  [/Prime Dropship/g, "Tracked Express"],
  [/Dropship/g, "Delivery"],
];

function cleanText(s) {
  let out = s;
  for (const [re, rep] of REPLACEMENTS) out = out.replace(re, rep);
  return out;
}

function deepClean(v) {
  if (typeof v === "string") {
    // never touch image URLs here
    if (/^https?:\/\//.test(v) || v.startsWith("/uploads")) return v;
    return cleanText(v);
  }
  if (Array.isArray(v)) return v.map(deepClean);
  if (v && typeof v === "object") {
    const o = {};
    for (const k of Object.keys(v)) o[k] = deepClean(v[k]);
    return o;
  }
  return v;
}

function buildDescription(p) {
  const ing = Array.isArray(p.keyIngredients) && p.keyIngredients.length ? ` Key actives: ${p.keyIngredients.join(", ")}.` : "";
  const skin = p.skinType ? ` Formulated for ${p.skinType.toLowerCase()}.` : "";
  const size = p.size && !/standard retail pack/i.test(p.size) ? ` Size: ${p.size}.` : "";
  const base = (p.shortDescription || p.tagline || p.name).replace(/\s+$/, "");
  return `${base}${/[.!?]$/.test(base) ? "" : "."}${ing}${skin}${size} 100% authentic, factory-sealed and shipped with tracking.`;
}

function normalizeProduct(p) {
  const c = deepClean(p);
  if (!c.supplierSource) c.supplierSource = SOURCE;
  if (!c.shippingDays || /dropship|prime/i.test(c.shippingDays)) c.shippingDays = SHIPPING;
  if (!c.description || !String(c.description).trim()) c.description = buildDescription(c);
  return c;
}

function download(url, dest, redirects = 0) {
  return new Promise((resolve) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if ([301, 302].includes(res.statusCode) && res.headers.location && redirects < 3) {
          res.resume();
          return resolve(download(res.headers.location, dest, redirects + 1));
        }
        if (res.statusCode !== 200 || !/image/.test(res.headers["content-type"] || "")) {
          res.resume();
          return resolve(false);
        }
        const chunks = [];
        res.on("data", (d) => chunks.push(d));
        res.on("end", () => {
          const buf = Buffer.concat(chunks);
          if (buf.length < 2000) return resolve(false);
          fs.writeFileSync(dest, buf);
          resolve(true);
        });
      })
      .on("error", () => resolve(false));
  });
}

const cache = new Map(); // remote url -> local path

async function localize(url, id, idx) {
  if (!/^https?:\/\//.test(url)) return url;
  if (cache.has(url)) return cache.get(url);
  const file = `${id}${idx ? "-" + idx : ""}.jpg`;
  const dest = path.join(IMG_DIR, file);
  const rel = `/uploads/products/${file}`;
  if (fs.existsSync(dest) && fs.statSync(dest).size > 2000) {
    cache.set(url, rel);
    return rel;
  }
  const hi = url.replace(/\._[A-Z0-9_,]+_\.(jpg|png)/i, "._AC_SL1000_.$1");
  let ok = hi !== url && (await download(hi, dest));
  if (!ok) ok = await download(url, dest);
  const result = ok ? rel : url;
  cache.set(url, result);
  return result;
}

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const k = i++;
        await fn(items[k], k);
      }
    })
  );
}

async function processList(list) {
  const out = list.map(normalizeProduct);
  const jobs = [];
  out.forEach((p) => {
    jobs.push(async () => {
      p.image = await localize(p.image, p.id, 0);
      if (Array.isArray(p.gallery)) {
        const g = [];
        for (let i = 0; i < p.gallery.length; i++) {
          g.push(p.gallery[i] === list.find((x) => x.id === p.id).image ? p.image : await localize(p.gallery[i], p.id, i + 1));
        }
        p.gallery = [...new Set(g)];
      }
    });
  });
  await pool(jobs, 8, (j) => j());
  return out;
}

(async () => {
  const db = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  db.products = await processList(db.products);
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

  const ts = fs.readFileSync(TS_PATH, "utf8");
  const marker = "export const INITIAL_PRODUCTS: Product[] = ";
  const start = ts.indexOf(marker);
  const arrStart = start + marker.length;
  const arrEnd = ts.lastIndexOf("];") + 1;
  const arr = JSON.parse(ts.slice(arrStart, arrEnd));
  const normTs = await processList(arr);
  fs.writeFileSync(TS_PATH, ts.slice(0, arrStart) + JSON.stringify(normTs, null, 2) + ts.slice(arrEnd));

  const remote = db.products.filter((p) => /^https?:/.test(p.image)).length;
  const txt = JSON.stringify(db.products);
  console.log("products:", db.products.length, "ts:", normTs.length);
  console.log("remote images left:", remote);
  console.log("dropship/prime/amazon text left:", (txt.match(/dropship|amazon prime|prime delivery|bestseller catalog/gi) || []).length);
  console.log("empty descriptions:", db.products.filter((p) => !p.description).length);
  console.log("no supplierSource:", db.products.filter((p) => !p.supplierSource).length);
})();
