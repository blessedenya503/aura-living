import fs from "fs";
import path from "path";
import { INITIAL_PRODUCTS, Product } from "@/data/products";
import type { ClinicalStudyCase } from "@/lib/clinical-cases";
import { getNeonSql } from "@/lib/neon";

export interface OrderItem {
  productId: string;
  sku: string;
  brand?: string;
  name: string;
  variantName: string;
  bundleTier: 1 | 2 | 3;
  quantity: number;
  unitPriceUsd: number;
  supplierUnitCostUsd: number;
  image: string;
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string;
  completed: boolean;
}

export interface CustomerOrder {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  country: string;
  postalCode: string;
  currency: string;
  subtotalUsd: number;
  discountUsd: number;
  shippingProtectionUsd: number;
  shippingUsd: number;
  totalPaidUsd: number;
  supplierTotalCostUsd: number;
  netProfitUsd: number;
  paymentMethod:
    | "Paystack (Cards / Bank Transfer)"
    | "PayPal"
    | "Stripe Card"
    | "Debit / Credit Card"
    | "Apple Pay"
    | "Google Pay"
    | "Verve Card";
  paymentStatus: "Paid" | "Refunded";
  fulfillmentStatus: "Unfulfilled" | "Processing" | "In Transit" | "Delivered";
  trackingNumber?: string;
  carrier?: string;
  estimatedDelivery?: string;
  items: OrderItem[];
  trackingTimeline: TrackingEvent[];
}

export interface LinkedBankAccount {
  bankName: string;
  bankCode?: string;
  accountNumber: string;
  accountName: string;
  payoutSchedule: string;
  settlementCurrency: string;
  status?: "connected" | "pending" | "unlinked";
  connectedAt?: string;
  recipientCode?: string;
  verifiedVia?: string;
}

export interface LinkedPayPalAccount {
  email: string;
  paypalMeUsername?: string;
  accountHolder?: string;
  clientId?: string;
  settlementCurrency?: string;
  status?: "connected" | "pending" | "unlinked";
  connectedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  freeShippingThresholdUsd: number;
  shippingProtectionPriceUsd: number;
  defaultMarkupMultiplier: number;
  announcementText: string;
  stripeConnected: boolean;
  tiktokTrendingProductId?: string;
  tiktokTrendingViews?: string;
  tiktokTrendingTagline?: string;
  weeklySyncEnabled?: boolean;
  lastWeeklySyncAt?: string;
  nextWeeklySyncAt?: string;
  weeklySyncSchedule?: string;
  linkedBank?: LinkedBankAccount;
  linkedPayPal?: LinkedPayPalAccount;
}

export interface StoreDatabase {
  products: Product[];
  orders: CustomerOrder[];
  settings: StoreSettings;
  /** Owner-editable before/after slideshow. Falls back to defaults when absent. */
  clinicalCases?: ClinicalStudyCase[];
}

const DB_FILE_PATH = path.join(process.cwd(), "src", "data", "store-db.json");

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: "AURA SKIN",
  supportEmail: "auraskinngofficial@gmail.com",
  freeShippingThresholdUsd: 35,
  shippingProtectionPriceUsd: 2.49,
  defaultMarkupMultiplier: 2.5,
  announcementText:
    "🌍 WORLDWIDE TRACKED SHIPPING • FREE SHIPPING OVER $35",
  stripeConnected: true,
  tiktokTrendingProductId: "prod-cosrx-28",
  tiktokTrendingViews: "Viral Skincare Sensation",
  tiktokTrendingTagline: "#TikTokMadeMeBuyIt • Viral Glass Skin Sensation",
  weeklySyncEnabled: true,
  lastWeeklySyncAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  nextWeeklySyncAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // in 5 days
  weeklySyncSchedule: "Every Sunday at 00:00 UTC",
  linkedBank: {
    bankName: "Access Bank / GTBank / Zenith",
    accountNumber: "0123456789",
    accountName: "AURA LIVING ENTERPRISE",
    payoutSchedule: "Next-day automatic bank settlement (T+1 at 05:00 WAT)",
    settlementCurrency: "NGN (₦)",
  },
  linkedPayPal: {
    email: "auraskinngofficial@gmail.com",
    paypalMeUsername: "auraskinng",
    accountHolder: "AURA SKIN OFFICIAL",
    settlementCurrency: "USD ($)",
    status: "connected",
  },
};

export const INITIAL_SAMPLE_ORDERS: CustomerOrder[] = [];

let cachedDb: StoreDatabase | null = null;
let lastNeonFetch = 0;
const MEMORY_CACHE_TTL = 5 * 1000; // 5s memory cache for near-instant visibility of portal updates

export async function getStoreDb(): Promise<StoreDatabase> {
  const now = Date.now();
  if (cachedDb && now - lastNeonFetch < MEMORY_CACHE_TTL) {
    return cachedDb;
  }

  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = (await sql`
        SELECT data FROM store_state WHERE key = 'current_store_db' LIMIT 1
      `) as any[];
      if (Array.isArray(rows) && rows.length > 0 && rows[0]?.data) {
        const remote = rows[0].data as StoreDatabase;
        remote.orders = (remote.orders || []).filter(
          (o) => o.customerName !== "Sophia Laurent" && o.customerEmail !== "sophia.l@aura-skincare.com"
        );
        if (
          remote.settings &&
          (!remote.settings.supportEmail ||
            remote.settings.supportEmail === "concierge@auraliving.store" ||
            remote.settings.supportEmail === "orders@auraskinng.com")
        ) {
          remote.settings.supportEmail = "auraskinngofficial@gmail.com";
        }
        cachedDb = remote;
        lastNeonFetch = now;
        return cachedDb;
      }
    } catch (err) {
      console.warn("Neon getStoreDb query fallback to local file:", err);
    }
  }

  if (cachedDb) return cachedDb;
  const local = readStoreDb();
  cachedDb = local;
  lastNeonFetch = now;
  return local;
}

export async function saveStoreDb(db: StoreDatabase): Promise<void> {
  cachedDb = db;
  lastNeonFetch = Date.now();
  try {
    fs.mkdirSync(path.dirname(DB_FILE_PATH), { recursive: true });
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch {}

  const sql = getNeonSql();
  if (sql) {
    try {
      await sql`
        INSERT INTO store_state (key, data, updated_at)
        VALUES ('current_store_db', ${JSON.stringify(db)}, NOW())
        ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
      `;

      if (db.settings) {
        await sql`
          INSERT INTO store_settings (id, data, updated_at)
          VALUES ('main_settings', ${JSON.stringify(db.settings)}, NOW())
          ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();
        `;
      }
    } catch (err) {
      console.error("Failed to persist store state to Neon:", err);
    }
  }
}

export function readStoreDb(): StoreDatabase {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as StoreDatabase;
      if (
        parsed &&
        Array.isArray(parsed.products) &&
        parsed.products.length > 0 &&
        parsed.products[0].brand // skincare indicator
      ) {
        parsed.orders = (parsed.orders || []).filter(
          (o) => o.customerName !== "Sophia Laurent" && o.customerEmail !== "sophia.l@aura-skincare.com"
        );
        if (
          parsed.settings &&
          (!parsed.settings.supportEmail ||
            parsed.settings.supportEmail === "concierge@auraliving.store" ||
            parsed.settings.supportEmail === "orders@auraskinng.com")
        ) {
          parsed.settings.supportEmail = "auraskinngofficial@gmail.com";
        }
        cachedDb = parsed;
        return parsed;
      }
    }
  } catch {
    // Fallback to initial seed
  }

  const initialDb: StoreDatabase = {
    products: INITIAL_PRODUCTS,
    orders: [],
    settings: INITIAL_SETTINGS,
  };

  try {
    fs.mkdirSync(path.dirname(DB_FILE_PATH), { recursive: true });
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialDb, null, 2), "utf-8");
  } catch {
    // Ignore write error
  }

  cachedDb = initialDb;
  return initialDb;
}

export function writeStoreDb(db: StoreDatabase): void {
  cachedDb = db;
  try {
    fs.mkdirSync(path.dirname(DB_FILE_PATH), { recursive: true });
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to persist store-db.json locally:", err);
  }

  // Also trigger async Neon sync
  saveStoreDb(db).catch(err => {
    console.error("Background Neon sync failed in writeStoreDb:", err);
  });
}

export function sanitizeProductForPublic(product: Product): Product {
  const p = product;
  let image = p.image || "";
  if (image.startsWith("http") && !image.startsWith("/api/proxy-image")) {
    image = `/api/proxy-image?url=${encodeURIComponent(image)}`;
  }

  const gallery = Array.isArray(p.gallery) && p.gallery.length > 0
    ? p.gallery.slice(0, 3).map((img) =>
        img && img.startsWith("http") && !img.startsWith("/api/proxy-image")
          ? `/api/proxy-image?url=${encodeURIComponent(img)}`
          : img
      )
    : [image];

  return {
    id: p.id,
    sku: p.sku || "AUR-SKU",
    name: p.name,
    brand: p.brand,
    tagline: p.tagline || "",
    supplierCost: p.supplierCost ?? 0,
    price: p.price,
    compareAtPrice: p.compareAtPrice || p.price,
    rating: p.rating || 4.8,
    reviewCount: p.reviewCount || 120,
    soldCountText: p.soldCountText || "",
    image,
    gallery,
    category: p.category,
    skinType: p.skinType || "All Skin Types",
    size: p.size || "",
    badge: p.badge || "",
    shortDescription: p.shortDescription ? p.shortDescription.slice(0, 240) : "",
    keyIngredients: Array.isArray(p.keyIngredients) ? p.keyIngredients.slice(0, 5) : [],
    benefits: Array.isArray(p.benefits) ? p.benefits.slice(0, 3) : [],
    variants: Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants
      : [{ name: "Standard Size", colorHex: "#0032A0", inStock: true }],
    stockLeft: p.stockLeft ?? 100,
    supplierSource: p.supplierSource || undefined,
    shippingDays: p.shippingDays || "2–5 Days Tracked Express Delivery",
    verification: p.verification
      ? {
          registry: p.verification.registry || "Manufacturer Batch Registry",
          referenceId: p.verification.referenceId || p.sku || "VERIFIED",
          sourceUrl: p.verification.sourceUrl || "https://auraskinng.vercel.app",
          originCountry: p.verification.originCountry || "Verified Origin",
          laboratoryCertifications: Array.isArray(p.verification.laboratoryCertifications)
            ? p.verification.laboratoryCertifications
            : ["Dermatologically Tested", "ISO 22716:2007 GMP Certified"],
          batchLotNumber: p.verification.batchLotNumber || `LOT-${p.sku || "AURA"}`,
          verifiedAt: p.verification.verifiedAt || "2026-11-08 (Audited Batch)",
        }
      : undefined,
    howToUse: p.howToUse,
    isBundle: p.isBundle,
    bundledItems: p.bundledItems,
    reviews: [],
    faqs: [],
  };
}
