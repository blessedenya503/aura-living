import { NextResponse } from "next/server";
import { getStoreDb, sanitizeProductForPublic } from "@/lib/store-db";
import { getCurrentWeeklyTikTokCatalog } from "@/lib/weekly-tiktok";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getStoreDb();
  const { weekNumber, catalog, nextRotationAt } = getCurrentWeeklyTikTokCatalog();
  const userReviews: any[] = Array.isArray((db as any).userReviews) ? (db as any).userReviews : [];

  const productsWithRealRatings = db.products.map((raw) => {
    const p = sanitizeProductForPublic(raw);
    const matchingReviews = userReviews.filter(
      (r) =>
        r.productId === p.id ||
        (r.productName &&
          p.name.toLowerCase().includes(String(r.productName).trim().toLowerCase()))
    );
    if (matchingReviews.length > 0) {
      const avg =
        matchingReviews.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) /
        matchingReviews.length;
      return {
        ...p,
        rating: Number(avg.toFixed(1)),
        reviewCount: matchingReviews.length,
      };
    }
    return {
      ...p,
      rating: 0,
      reviewCount: 0,
    };
  });

  return NextResponse.json(
    {
      products: productsWithRealRatings,
      settings: {
        storeName: "AURA SKIN",
        supportEmail: db.settings.supportEmail || "auraskinngofficial@gmail.com",
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
        userReviews,
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}
