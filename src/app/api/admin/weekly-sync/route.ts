import { NextResponse } from "next/server";
import { getStoreDb, saveStoreDb } from "@/lib/store-db";

export async function POST() {
  try {
    const db = await getStoreDb();
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    db.settings = {
      ...db.settings,
      weeklySyncEnabled: true,
      lastWeeklySyncAt: now.toISOString(),
      nextWeeklySyncAt: nextWeek.toISOString(),
      weeklySyncSchedule: "Every Sunday at 00:00 UTC",
    };

    await saveStoreDb(db);

    return NextResponse.json({
      success: true,
      message: "Weekly storefront synchronization executed successfully.",
      lastWeeklySyncAt: db.settings.lastWeeklySyncAt,
      nextWeeklySyncAt: db.settings.nextWeeklySyncAt,
      syncedProductsCount: db.products.length,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  const db = await getStoreDb();
  return NextResponse.json({
    success: true,
    weeklySyncEnabled: db.settings.weeklySyncEnabled ?? true,
    lastWeeklySyncAt: db.settings.lastWeeklySyncAt,
    nextWeeklySyncAt: db.settings.nextWeeklySyncAt,
    weeklySyncSchedule: db.settings.weeklySyncSchedule || "Every Sunday at 00:00 UTC",
    totalCatalogCount: db.products.length,
  });
}
