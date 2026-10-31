import { NextResponse } from "next/server";
import { getStoreDb, sanitizeProductForPublic } from "@/lib/store-db";
import { getCurrentWeeklyTikTokCatalog } from "@/lib/weekly-tiktok";

export async function GET() {
  const db = await getStoreDb();
  const { weekNumber, catalog, nextRotationAt } = getCurrentWeeklyTikTokCatalog();

  return NextResponse.json(
    {
      products: db.products.map(sanitizeProductForPublic),
      settings: {
        storeName: db.settings.storeName,
        supportEmail: db.settings.supportEmail,
        freeShippingThresholdUsd: db.settings.freeShippingThresholdUsd,
        shippingProtectionPriceUsd: db.settings.shippingProtectionPriceUsd,
        announcementText: db.settings.announcementText,
        tiktokTrendingProductId: db.settings.tiktokTrendingProductId || catalog[0]?.id,
        tiktokTrendingViews: db.settings.tiktokTrendingViews || catalog[0]?.views,
        tiktokTrendingTagline: db.settings.tiktokTrendingTagline || `${catalog[0]?.brand} • Week ${weekNumber} Viral Trend`,
        weeklySyncSchedule: db.settings.weeklySyncSchedule || "Every Sunday at 00:00 UTC",
        lastWeeklySyncAt: db.settings.lastWeeklySyncAt,
        nextWeeklySyncAt: db.settings.nextWeeklySyncAt || nextRotationAt,
        weeklyTikTokCatalog: catalog,
        currentWeekNumber: weekNumber,
      },
    },
    {
      headers: {
        "Cache-Control": "public, max-age=120, s-maxage=600, stale-while-revalidate=86400",
      },
    }
  );
}
