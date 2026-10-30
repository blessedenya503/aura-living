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
  storeName: "AURA Living & Skincare",
  supportEmail: "concierge@auraliving.store",
  freeShippingThresholdUsd: 35,
  shippingProtectionPriceUsd: 2.49,
  defaultMarkupMultiplier: 2.5,
  announcementText:
    "FREE TRACKED SHIPPING OVER $35 • DERMATOLOGICALLY VERIFIED NIVEA & PREMIUM SKINCARE",
  stripeConnected: true,
  tiktokTrendingProductId: "prod-cosrx-snail-96",
  tiktokTrendingViews: "4.8B TikTok Views",
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
};

export const INITIAL_SAMPLE_ORDERS: CustomerOrder[] = [
  {
    id: "AUR-8921",
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(), // 42 mins ago
    customerName: "Camilla Lindqvist",
    customerEmail: "camilla.l@nordicmail.com",
    shippingAddress: "42 Strandvägen, Apt 4B",
    city: "Stockholm",
    country: "Sweden",
    postalCode: "114 56",
    currency: "EUR",
    subtotalUsd: 59.97,
    discountUsd: 0,
    shippingProtectionUsd: 2.49,
    shippingUsd: 0,
    totalPaidUsd: 62.46,
    supplierTotalCostUsd: 22.1,
    netProfitUsd: 40.36,
    paymentMethod: "Apple Pay",
    paymentStatus: "Paid",
    fulfillmentStatus: "Processing",
    trackingNumber: "DHL-EUR-99482104",
    carrier: "DHL Express",
    estimatedDelivery: "In 2 business days",
    items: [
      {
        productId: "prod-nivea-luminous630",
        sku: "NIV-LUM-030",
        brand: "NIVEA",
        name: "NIVEA Cellular Luminous630 Dark-Spot Serum",
        variantName: "30ml Precision Dropper",
        bundleTier: 1,
        quantity: 1,
        unitPriceUsd: 29.99,
        supplierUnitCostUsd: 11.5,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
      },
      {
        productId: "prod-nivea-creme-classic",
        sku: "NIV-CRM-250",
        brand: "NIVEA",
        name: "NIVEA Creme Classic Intensive Hydration",
        variantName: "400ml Family Jar",
        bundleTier: 1,
        quantity: 1,
        unitPriceUsd: 8.99,
        supplierUnitCostUsd: 3.1,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
      },
      {
        productId: "prod-laroche-posay-cicaplast",
        sku: "LRP-CICA-100",
        brand: "La Roche-Posay",
        name: "La Roche-Posay Cicaplast Baume B5+ Soothing Cream",
        variantName: "100ml Large Tube",
        bundleTier: 1,
        quantity: 1,
        unitPriceUsd: 21.99,
        supplierUnitCostUsd: 8.4,
        image: "https://images.unsplash.com/photo-1608248597359-001099e0fbfa?q=80&w=1000&auto=format&fit=crop",
      },
    ],
    trackingTimeline: [
      {
        status: "Payment Confirmed (Apple Pay)",
        location: "Stripe Secure Gateway",
        timestamp: "42 mins ago",
        completed: true,
      },
      {
        status: "Fulfillment Packing & Batch Label Generated",
        location: "AURA Central Distribution (Helsinki Hub)",
        timestamp: "18 mins ago",
        completed: true,
      },
      {
        status: "Awaiting Carrier Pickup (DHL Express)",
        location: "Outbound Logistics Dock 3",
        timestamp: "Just now",
        completed: false,
      },
    ],
  },
  {
    id: "AUR-8894",
    createdAt: new Date(Date.now() - 1000 * 60 * 185).toISOString(), // 3 hours ago
    customerName: "Eleanor Wright",
    customerEmail: "eleanor.w@chelsea-health.co.uk",
    shippingAddress: "18 King's Road",
    city: "London",
    country: "United Kingdom",
    postalCode: "SW3 4RP",
    currency: "GBP",
    subtotalUsd: 48.47,
    discountUsd: 7.27, // 15% Duo bundle
    shippingProtectionUsd: 2.49,
    shippingUsd: 0,
    totalPaidUsd: 43.69,
    supplierTotalCostUsd: 15.6,
    netProfitUsd: 28.09,
    paymentMethod: "Stripe Card",
    paymentStatus: "Paid",
    fulfillmentStatus: "In Transit",
    trackingNumber: "RM-GB-74920194GB",
    carrier: "Royal Mail 24 Tracked",
    estimatedDelivery: "Tomorrow by 1 PM",
    items: [
      {
        productId: "prod-cerave-moisturizing-cream",
        sku: "CRV-MOIST-453",
        brand: "CeraVe",
        name: "CeraVe Moisturizing Cream with 3 Essential Ceramides",
        variantName: "453g Tub with Pump",
        bundleTier: 2,
        quantity: 2,
        unitPriceUsd: 16.99,
        supplierUnitCostUsd: 7.8,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
      },
      {
        productId: "prod-the-ordinary-niacinamide",
        sku: "ORD-NIAC-060",
        brand: "The Ordinary",
        name: "The Ordinary Niacinamide 10% + Zinc 1% Oil-Free Serum",
        variantName: "60ml Value Size",
        bundleTier: 1,
        quantity: 1,
        unitPriceUsd: 10.99,
        supplierUnitCostUsd: 3.8,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
      },
    ],
    trackingTimeline: [
      {
        status: "Order Dispatched from London Depot",
        location: "Royal Mail Heathrow Hub",
        timestamp: "1 hour ago",
        completed: true,
      },
      {
        status: "In Transit to Local Delivery Office",
        location: "SW3 Chelsea Delivery Unit",
        timestamp: "32 mins ago",
        completed: true,
      },
    ],
  },
  {
    id: "AUR-8760",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // Yesterday
    customerName: "Dr. Marcus Brody",
    customerEmail: "mbrody@wellnessmed.org",
    shippingAddress: "740 Park Ave, Suite 901",
    city: "New York",
    country: "United States",
    postalCode: "10021",
    currency: "USD",
    subtotalUsd: 84.47,
    discountUsd: 0,
    shippingProtectionUsd: 2.49,
    shippingUsd: 0,
    totalPaidUsd: 86.96,
    supplierTotalCostUsd: 27.5,
    netProfitUsd: 59.46,
    paymentMethod: "Google Pay",
    paymentStatus: "Paid",
    fulfillmentStatus: "Delivered",
    trackingNumber: "USPS-940011189956281048",
    carrier: "USPS Priority Mail",
    estimatedDelivery: "Delivered Yesterday",
    items: [
      {
        productId: "prod-paulas-choice-bha",
        sku: "PC-BHA-118",
        brand: "Paula's Choice",
        name: "Paula's Choice 2% BHA Liquid Exfoliant",
        variantName: "118ml Full Size",
        bundleTier: 1,
        quantity: 1,
        unitPriceUsd: 35.0,
        supplierUnitCostUsd: 14.2,
        image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1000&auto=format&fit=crop",
      },
      {
        productId: "prod-nivea-q10-power",
        sku: "NIV-Q10-050",
        brand: "NIVEA",
        name: "NIVEA Q10 Power Anti-Wrinkle Day Cream SPF 15",
        variantName: "50ml Day Cream SPF 15",
        bundleTier: 1,
        quantity: 1,
        unitPriceUsd: 16.99,
        supplierUnitCostUsd: 6.2,
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop",
      },
      {
        productId: "prod-nivea-radiant-beauty",
        sku: "NIV-RAD-400",
        brand: "NIVEA",
        name: "NIVEA Radiant & Beauty Advanced Care 48H Cream",
        variantName: "400ml Tub",
        bundleTier: 1,
        quantity: 2,
        unitPriceUsd: 12.99,
        supplierUnitCostUsd: 4.5,
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1000&auto=format&fit=crop",
      },
    ],
    trackingTimeline: [
      {
        status: "Delivered to Front Porch / Doorman",
        location: "New York, NY 10021",
        timestamp: "Yesterday, 3:15 PM",
        completed: true,
      },
    ],
  },
];

let cachedDb: StoreDatabase | null = null;

export async function getStoreDb(): Promise<StoreDatabase> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = (await sql`
        SELECT data FROM store_state WHERE key = 'current_store_db' LIMIT 1
      `) as any[];
      if (Array.isArray(rows) && rows.length > 0 && rows[0]?.data) {
        cachedDb = rows[0].data as StoreDatabase;
        return cachedDb;
      }
    } catch (err) {
      console.warn("Neon getStoreDb query fallback to local file:", err);
    }
  }

  if (cachedDb) return cachedDb;
  const local = readStoreDb();
  cachedDb = local;
  return local;
}

export async function saveStoreDb(db: StoreDatabase): Promise<void> {
  cachedDb = db;
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
  const copy = { ...product };
  // Keep clean public-safe fields, protect supplier cost
  delete (copy as any).supplierCost;
  delete (copy as any).cjShippingCost;
  return copy;
}
