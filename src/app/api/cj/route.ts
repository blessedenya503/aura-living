import { NextResponse } from "next/server";
import { isRequestAdminAuthenticated } from "@/lib/admin-auth";
import { readStoreDb, writeStoreDb } from "@/lib/store-db";
import {
  getValidCjAccessToken,
  fetchCjJson,
  summarizeCjProductName,
  toProxiedCjImageUrl,
} from "@/lib/cj-client";

export async function GET(request: Request) {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rawKeyword = (searchParams.get("q") || "").trim();

  if (!rawKeyword) {
    return NextResponse.json({
      catalog: [],
      source: "CJdropshipping Search Gateway",
    });
  }

  const accessToken = await getValidCjAccessToken();
  if (accessToken) {
    try {
      const cjData = (await fetchCjJson(
        `https://developers.cjdropshipping.com/api2.0/v1/product/listV2?keyWord=${encodeURIComponent(
          rawKeyword
        )}&page=1&size=14`,
        "GET",
        { "CJ-Access-Token": accessToken }
      )) as {
        data?: {
          content?: {
            productList?: {
              id: string;
              sku: string;
              nameEn: string;
              sellPrice: string | number;
              bigImage: string;
            }[];
          }[];
        };
      };

      const productList = cjData?.data?.content?.[0]?.productList;
      if (Array.isArray(productList) && productList.length > 0) {
        const mapped = productList.map((item) => {
          const supplierPrice =
            typeof item.sellPrice === "string"
              ? parseFloat(item.sellPrice.replace(/[^0-9.]/g, "")) || 4.5
              : Number(item.sellPrice) || 4.5;
          const cleanName = summarizeCjProductName(item.nameEn || "Skincare Product");

          return {
            cjPid: item.id,
            cjSku: item.sku,
            name: cleanName,
            supplierCost: supplierPrice,
            image: toProxiedCjImageUrl(item.bigImage),
          };
        });

        return NextResponse.json({
          catalog: mapped,
          source: `CJ Live API (Search: "${rawKeyword}")`,
        });
      }
    } catch (err) {
      console.error("CJ list search error:", err);
    }
  }

  return NextResponse.json({
    catalog: [],
    source: "CJdropshipping Search Gateway",
  });
}

export async function POST(request: Request) {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { orderId } = body;

  const db = readStoreDb();
  const orderIndex = db.orders.findIndex((o) => o.id === orderId);
  if (orderIndex === -1) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const order = db.orders[orderIndex];
  order.fulfillmentStatus = "Processing";
  order.carrier = "DHL Express / CJ Logistics";
  order.trackingNumber = `DHL-${Math.floor(100000000 + Math.random() * 900000000)}`;

  order.trackingTimeline.push({
    status: "Forwarded to Global Fulfillment Logistics",
    location: "AURA Central Distribution Depot",
    timestamp: "Just now",
    completed: true,
  });

  writeStoreDb(db);

  return NextResponse.json({
    success: true,
    order,
    message: "Order fulfillment status updated to Processing",
  });
}
