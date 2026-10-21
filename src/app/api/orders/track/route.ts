import { NextResponse } from "next/server";
import { readStoreDb } from "@/lib/store-db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim().toUpperCase();

  if (!query) {
    return NextResponse.json(
      { error: "Please enter an Order ID (e.g. AUR-8921) or Tracking Number." },
      { status: 400 }
    );
  }

  const db = readStoreDb();
  const matched = db.orders.find(
    (o) =>
      o.id.toUpperCase() === query ||
      (o.trackingNumber && o.trackingNumber.toUpperCase() === query)
  );

  if (!matched) {
    return NextResponse.json(
      {
        error:
          "No order found matching that ID or tracking number. Try sample order AUR-8921 or AUR-8894.",
      },
      { status: 404 }
    );
  }

  // Strip private supplier cost & profit fields before returning to customer
  return NextResponse.json({
    order: {
      id: matched.id,
      createdAt: matched.createdAt,
      customerName: matched.customerName,
      city: matched.city,
      country: matched.country,
      fulfillmentStatus: matched.fulfillmentStatus,
      trackingNumber: matched.trackingNumber || "Pending Courier Assignment",
      carrier: matched.carrier || "DHL Express / Royal Mail",
      estimatedDelivery: matched.estimatedDelivery || "2–4 Business Days",
      totalPaidUsd: matched.totalPaidUsd,
      items: matched.items.map((item) => ({
        name: item.name,
        variantName: item.variantName,
        quantity: item.quantity,
        bundleTier: item.bundleTier,
        image: item.image,
      })),
      trackingTimeline: matched.trackingTimeline || [],
    },
  });
}
