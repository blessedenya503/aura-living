import { NextResponse } from "next/server";
import { getStoreDb, saveStoreDb } from "@/lib/store-db";
import { getCurrentWeeklyTikTokCatalog } from "@/lib/weekly-tiktok";

export async function POST() {
  try {
    const db = await getStoreDb();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const { weekNumber, catalog, nextRotationAt } = getCurrentWeeklyTikTokCatalog();

    // Mark trending items in the database
    const trendingIds = new Set(catalog.map((c) => c.id));
    db.products.forEach((p) => {
      if (trendingIds.has(p.id)) {
        p.badge = "TikTok #1 Trending";
      }
    });

    db.settings = {
      ...db.settings,
      weeklySyncEnabled: true,
      lastWeeklySyncAt: now.toISOString(),
      nextWeeklySyncAt: nextRotationAt || nextWeek.toISOString(),
      weeklySyncSchedule: "Every Sunday at 00:00 UTC",
      tiktokTrendingProductId: catalog[0]?.id || "prod-cosrx-28",
      tiktokTrendingViews: catalog[0]?.views || "4.8B Views",
      tiktokTrendingTagline: `${catalog[0]?.brand} • Week ${weekNumber} Viral Trend`,
    };

    await saveStoreDb(db);

    return NextResponse.json({
      success: true,
      message: `Weekly storefront and TikTok catalog rotation executed successfully (Active: Week ${weekNumber} Collection).`,
      weekNumber,
      activeCatalogCount: catalog.length,
      lastWeeklySyncAt: db.settings.lastWeeklySyncAt,
      nextWeeklySyncAt: db.settings.nextWeeklySyncAt,
      syncedProductsCount: db.products.length,
      featuredTrend: catalog[0]?.name,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const db = await getStoreDb();
  const { weekNumber, catalog, nextRotationAt } = getCurrentWeeklyTikTokCatalog();

  return NextResponse.json({
    success: true,
    weeklySyncEnabled: db.settings.weeklySyncEnabled ?? true,
    lastWeeklySyncAt: db.settings.lastWeeklySyncAt,
    nextWeeklySyncAt: db.settings.nextWeeklySyncAt || nextRotationAt,
    weeklySyncSchedule: db.settings.weeklySyncSchedule || "Every Sunday at 00:00 UTC",
    currentWeekNumber: weekNumber,
    activeTikTokCatalog: catalog,
    totalCatalogCount: db.products.length,
  });
}
