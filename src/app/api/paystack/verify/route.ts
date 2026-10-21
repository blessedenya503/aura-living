import { NextResponse } from "next/server";
import { readStoreDb, writeStoreDb, CustomerOrder, OrderItem } from "@/lib/store-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, orderPayload } = body;

    if (!reference) {
      return NextResponse.json(
        { error: "Missing Paystack reference." },
        { status: 400 }
      );
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey || paystackSecretKey.trim().length <= 5) {
      return NextResponse.json(
        { error: "Paystack payment verification is not configured." },
        { status: 503 }
      );
    }

    let paymentVerified = false;
    let verifiedAmountNgn = 0;
    let customerEmail = orderPayload?.customerEmail || "";
    let customerName = orderPayload?.customerName || "";

    if (paystackSecretKey && paystackSecretKey.trim().length > 5) {
      const verifyRes = await fetch(
        `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${paystackSecretKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      const verifyData = await verifyRes.json();

      if (verifyData.status && verifyData.data && verifyData.data.status === "success") {
        paymentVerified = true;
        verifiedAmountNgn = verifyData.data.amount / 100; // convert kobo to Naira
        customerEmail = verifyData.data.customer?.email || customerEmail;
      } else {
        return NextResponse.json(
          { error: verifyData.message || "Paystack transaction could not be verified." },
          { status: 400 }
        );
      }
    }

    if (paymentVerified) {
      const db = readStoreDb();
      const items = orderPayload?.items || [];

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

      const discountUsd = Number(orderPayload?.discountUsd || 0);
      const afterDiscount = Math.max(0, subtotalUsd - discountUsd);
      const shippingUsd = afterDiscount >= db.settings.freeShippingThresholdUsd ? 0 : 3.99;
      const shippingProtectionUsd = orderPayload?.shippingProtection
        ? db.settings.shippingProtectionPriceUsd
        : 0;
      const totalPaidUsd = Number(
        (afterDiscount + shippingUsd + shippingProtectionUsd).toFixed(2)
      );

      // Paystack fee (1.5% capped at N1,000 for local NGN or 3.9% for international)
      const estimatedFeeUsd = totalPaidUsd * 0.015;
      const netProfitUsd = Number(
        (totalPaidUsd - supplierTotalCostUsd - estimatedFeeUsd).toFixed(2)
      );

      const orderId = orderPayload?.orderId || `AUR-${Math.floor(10000 + Math.random() * 89999)}`;
      const nowIso = new Date().toISOString();

      const newOrder: CustomerOrder = {
        id: orderId,
        createdAt: nowIso,
        customerName: orderPayload?.customerName || customerName || "AURA Client",
        customerEmail: orderPayload?.customerEmail || customerEmail || "guest@auraliving.store",
        shippingAddress: orderPayload?.shippingAddress || "Victoria Island",
        city: orderPayload?.city || "Lagos",
        country: orderPayload?.country || "Nigeria",
        postalCode: orderPayload?.postalCode || "101241",
        currency: orderPayload?.currency || "NGN",
        subtotalUsd: Number(subtotalUsd.toFixed(2)),
        discountUsd: Number(discountUsd.toFixed(2)),
        shippingProtectionUsd: Number(shippingProtectionUsd.toFixed(2)),
        shippingUsd: Number(shippingUsd.toFixed(2)),
        totalPaidUsd,
        supplierTotalCostUsd: Number(supplierTotalCostUsd.toFixed(2)),
        netProfitUsd,
        paymentMethod: "Paystack (Cards / Bank Transfer)" as any,
        paymentStatus: "Paid",
        fulfillmentStatus: "Processing",
        carrier: "DHL Express / Red Star",
        trackingNumber: `PAYSTK-${reference.slice(-10)}`,
        estimatedDelivery: "2–4 Business Days (Express)",
        items: orderItems,
        trackingTimeline: [
          {
            status: "Paystack Payment Verified & Deposited into Settlement Balance",
            location: "Paystack Secure Settlement Vault",
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
            status: "Handed over to Express Courier (DHL / Red Star)",
            location: orderPayload?.city || "Lagos",
            timestamp: "Est. within 12 hours",
            completed: false,
          },
          {
            status: "Delivered to Doorstep",
            location: `${orderPayload?.city || "Lagos"}, ${orderPayload?.country || "Nigeria"}`,
            timestamp: "Est. 2–4 Business Days",
            completed: false,
          },
        ],
      };

      db.orders.unshift(newOrder);
      writeStoreDb(db);

      return NextResponse.json({
        success: true,
        order: newOrder,
        reference,
        verifiedAmountNgn,
      });
    }

    return NextResponse.json(
      { error: "Payment verification failed." },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Paystack Verify Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to verify Paystack payment." },
      { status: 500 }
    );
  }
}
