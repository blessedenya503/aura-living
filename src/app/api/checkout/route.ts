import { NextResponse } from "next/server";
import { getStoreDb, saveStoreDb, CustomerOrder, OrderItem } from "@/lib/store-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      shippingAddress,
      city,
      country,
      postalCode,
      currency = "USD",
      paymentMethod = "Stripe Card",
      shippingProtection = true,
      discountUsd = 0,
      items = [],
    } = body;

    if (!customerName || !customerEmail || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required customer or cart information." },
        { status: 400 }
      );
    }

    const db = await getStoreDb();

    let subtotalUsd = 0;
    let supplierTotalCostUsd = 0;

    const orderItems: OrderItem[] = items.map((cartItem: {
      productId: string;
      variantName?: string;
      bundleTier?: 1 | 2 | 3;
      quantity: number;
      unitPriceUsd: number;
    }) => {
      const dbProd = db.products.find((p) => p.id === cartItem.productId);
      const unitPrice = Number(cartItem.unitPriceUsd) || dbProd?.price || 19.99;
      const qty = Number(cartItem.quantity) || 1;
      const wholesaleUnit = dbProd?.supplierCost || unitPrice * 0.35;

      subtotalUsd += unitPrice * qty;
      supplierTotalCostUsd += wholesaleUnit * qty;

      return {
        productId: cartItem.productId,
        sku: dbProd?.sku || "AUR-SKU",
        brand: dbProd?.brand || "AURA Skincare",
        name: dbProd?.name || "Hydration Cream",
        variantName: cartItem.variantName || "Standard Size",
        bundleTier: cartItem.bundleTier || 1,
        quantity: qty,
        unitPriceUsd: Number(unitPrice.toFixed(2)),
        supplierUnitCostUsd: Number(wholesaleUnit.toFixed(2)),
        image: dbProd?.image || "",
      };
    });

    const afterDiscount = Math.max(0, subtotalUsd - Number(discountUsd || 0));
    const shippingUsd =
      afterDiscount >= db.settings.freeShippingThresholdUsd ? 0 : 3.99;
    const shippingProtectionUsd = shippingProtection
      ? db.settings.shippingProtectionPriceUsd
      : 0;
    const totalPaidUsd = Number(
      (afterDiscount + shippingUsd + shippingProtectionUsd).toFixed(2)
    );

    // Estimate payment processing fee (2.9% + $0.30)
    const stripeFeeUsd = totalPaidUsd * 0.029 + 0.3;
    const netProfitUsd = Number(
      (totalPaidUsd - supplierTotalCostUsd - stripeFeeUsd).toFixed(2)
    );

    const orderNum = `AUR-${Math.floor(10000 + Math.random() * 89999)}`;
    const nowIso = new Date().toISOString();

    const newOrder: CustomerOrder = {
      id: orderNum,
      createdAt: nowIso,
      customerName,
      customerEmail,
      shippingAddress,
      city,
      country,
      postalCode,
      currency,
      subtotalUsd: Number(subtotalUsd.toFixed(2)),
      discountUsd: Number(Number(discountUsd || 0).toFixed(2)),
      shippingProtectionUsd: Number(shippingProtectionUsd.toFixed(2)),
      shippingUsd: Number(shippingUsd.toFixed(2)),
      totalPaidUsd,
      supplierTotalCostUsd: Number(supplierTotalCostUsd.toFixed(2)),
      netProfitUsd,
      paymentMethod,
      paymentStatus: "Paid",
      fulfillmentStatus: "Processing",
      carrier: "DHL Express",
      trackingNumber: `DHL-EXP-${Math.floor(100000000 + Math.random() * 900000000)}`,
      estimatedDelivery: "2–4 Business Days (Express)",
      items: orderItems,
      trackingTimeline: [
        {
          status: `Order Confirmed & ${paymentMethod} Payment Verified`,
          location: "AURA Encrypted Checkout Gateway",
          timestamp: "Just now",
          completed: true,
        },
        {
          status: "Order Sent to Temperature-Controlled Skincare Fulfillment",
          location: "Central Distribution Center",
          timestamp: "In Progress",
          completed: true,
        },
        {
          status: "Dermatological Quality Inspection & Batch Labeling",
          location: "Sterile Logistics Center",
          timestamp: "Queued",
          completed: false,
        },
        {
          status: "Handed over to Express Courier (DHL / Royal Mail / USPS)",
          location: city,
          timestamp: "Est. within 12 hours",
          completed: false,
        },
        {
          status: "Delivered to Doorstep",
          location: `${city}, ${country}`,
          timestamp: "Est. 2–4 Business Days",
          completed: false,
        },
      ],
    };

    db.orders.unshift(newOrder);
    await saveStoreDb(db);

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process checkout transaction." },
      { status: 500 }
    );
  }
}
