import { NextResponse } from "next/server";
import { getStoreDb, sanitizeProductForPublic } from "@/lib/store-db";

export async function GET() {
  const db = await getStoreDb();
  return NextResponse.json(
    {
      products: db.products.map(sanitizeProductForPublic),
      settings: {
        storeName: db.settings.storeName,
        supportEmail: db.settings.supportEmail,
        freeShippingThresholdUsd: db.settings.freeShippingThresholdUsd,
        shippingProtectionPriceUsd: db.settings.shippingProtectionPriceUsd,
        announcementText: db.settings.announcementText,
        tiktokTrendingProductId: db.settings.tiktokTrendingProductId || "prod-cosrx-snail-96",
        tiktokTrendingViews: db.settings.tiktokTrendingViews || "4.8B TikTok Views",
        tiktokTrendingTagline: db.settings.tiktokTrendingTagline || "#TikTokMadeMeBuyIt • Viral Glass Skin Sensation",
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=120, s-maxage=600, stale-while-revalidate=86400",
      },
    }
  );
}
