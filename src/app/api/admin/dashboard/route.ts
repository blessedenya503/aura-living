import { NextResponse } from "next/server";
import { isRequestAdminAuthenticated } from "@/lib/admin-auth";
import { getStoreDb, saveStoreDb, CustomerOrder } from "@/lib/store-db";
import { Product } from "@/data/products";

export async function GET() {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getStoreDb();

  const totalRevenueUsd = db.orders.reduce((s, o) => s + (o.totalPaidUsd || 0), 0);
  const totalSupplierCostUsd = db.orders.reduce(
    (s, o) => s + (o.supplierTotalCostUsd || 0),
    0
  );
  const totalNetProfitUsd = db.orders.reduce((s, o) => s + (o.netProfitUsd || 0), 0);
  const unfulfilledCount = db.orders.filter(
    (o) => o.fulfillmentStatus === "Unfulfilled" || o.fulfillmentStatus === "Processing"
  ).length;

  return NextResponse.json({
    products: db.products,
    orders: db.orders,
    settings: {
      ...db.settings,
      hasLiveStripeKey: Boolean(process.env.STRIPE_SECRET_KEY),
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY),
      geminiKeyMasked: (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)
        ? (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)!.slice(0, 8) + "••••••••" + (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)!.slice(-4)
        : null,
    },
    metrics: {
      totalRevenueUsd: Number(totalRevenueUsd.toFixed(2)),
      totalSupplierCostUsd: Number(totalSupplierCostUsd.toFixed(2)),
      totalNetProfitUsd: Number(totalNetProfitUsd.toFixed(2)),
      averageMarginPercent:
        totalRevenueUsd > 0
          ? Number(((totalNetProfitUsd / totalRevenueUsd) * 100).toFixed(1))
          : 0,
      totalOrders: db.orders.length,
      unfulfilledCount,
    },
  });
}

export async function POST(request: Request) {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const db = await getStoreDb();

  // If action is clear all orders / simulation data
  if (body.action === "clear_orders") {
    db.orders = [];
    await saveStoreDb(db);
    return NextResponse.json({ success: true, message: "All simulation orders cleared" });
  }

  // If action is creating sample test order
  if (body.action === "create_sample_order") {
    const randomProd = db.products[Math.floor(Math.random() * db.products.length)] || db.products[0];
    const qty = Math.floor(Math.random() * 2) + 1;
    const subtotal = Number((randomProd.price * qty).toFixed(2));
    const cost = Number((randomProd.supplierCost * qty).toFixed(2));
    const profit = Number((subtotal - cost).toFixed(2));

    const sampleOrder: CustomerOrder = {
      id: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName: body.customerName || "Sophia Laurent",
      customerEmail: body.customerEmail || "sophia.l@aura-skincare.com",
      shippingAddress: "220 Avenue Montaigne",
      city: "Paris",
      country: "France",
      postalCode: "75008",
      currency: "EUR",
      subtotalUsd: subtotal,
      discountUsd: 0,
      shippingProtectionUsd: 2.49,
      shippingUsd: 0,
      totalPaidUsd: Number((subtotal + 2.49).toFixed(2)),
      supplierTotalCostUsd: cost,
      netProfitUsd: profit,
      paymentMethod: "Apple Pay",
      paymentStatus: "Paid",
      fulfillmentStatus: "Processing",
      carrier: "DHL Express",
      trackingNumber: `DHL-FR-${Math.floor(10000000 + Math.random() * 90000000)}`,
      estimatedDelivery: "In 2 business days",
      items: [
        {
          productId: randomProd.id,
          sku: randomProd.sku,
          brand: randomProd.brand,
          name: randomProd.name,
          variantName: randomProd.variants?.[0]?.name || "Standard Size",
          bundleTier: 1,
          quantity: qty,
          unitPriceUsd: randomProd.price,
          supplierUnitCostUsd: randomProd.supplierCost,
          image: randomProd.image,
        },
      ],
      trackingTimeline: [
        {
          status: "Order Received & Payment Verified",
          location: "Secure Cloud Gateway",
          timestamp: "Just now",
          completed: true,
        },
      ],
    };

    db.orders.unshift(sampleOrder);
    await saveStoreDb(db);
    return NextResponse.json({ order: sampleOrder, success: true });
  }

  // Create new product
  const newProduct: Product = {
    id: body.id || `prod-${Date.now()}`,
    sku: body.sku || `SKU-${Date.now().toString().slice(-6)}`,
    brand: body.brand || "NIVEA",
    name: body.name || "Restorative Hydration Cream",
    tagline: body.tagline || "Pure cellular hydration and barrier defense",
    size: body.size || "200ml / 6.7 oz",
    skinType: body.skinType || "All Skin Types",
    category: body.category || "Moisturizing Creams",
    price: Number(body.price) || 14.99,
    compareAtPrice: Number(body.compareAtPrice) || 19.99,
    supplierCost: Number(body.supplierCost) || 4.5,
    rating: Number(body.rating) || 4.8,
    reviewCount: Number(body.reviewCount) || 120,
    soldCountText: body.soldCountText || "New Arrival",
    badge: body.badge || "Pure Care",
    shortDescription: body.shortDescription || "Gentle barrier-nourishing formula with clinically studied active ingredients.",
    keyIngredients: Array.isArray(body.keyIngredients)
      ? body.keyIngredients
      : (body.keyIngredients || "Panthenol, Glycerin, Ceramide").split(",").map((s: string) => s.trim()),
    benefits: Array.isArray(body.benefits)
      ? body.benefits
      : [
          "Deep 48-hour continuous moisture locks in essential hydration",
          "Dermatologically tested for sensitive, dry skin barriers",
        ],
    image: body.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
    gallery: Array.isArray(body.gallery) && body.gallery.length > 0
      ? body.gallery
      : [body.image || "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop"],
    variants: Array.isArray(body.variants) && body.variants.length > 0
      ? body.variants
      : [{ name: "Standard Size", colorHex: "#0032A0", inStock: true }],
    stockLeft: Number(body.stockLeft) || 150,
    reviews: [],
    faqs: [],
  };

  db.products.unshift(newProduct);
  await saveStoreDb(db);

  return NextResponse.json({ product: newProduct, success: true });
}

export async function PATCH(request: Request) {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const db = await getStoreDb();

  // Update order fulfillment status or tracking
  if (body.type === "update_order" && body.orderId) {
    const oIdx = db.orders.findIndex((o) => o.id === body.orderId);
    if (oIdx > -1) {
      if (body.fulfillmentStatus) {
        db.orders[oIdx].fulfillmentStatus = body.fulfillmentStatus;
      }
      if (body.trackingNumber) {
        db.orders[oIdx].trackingNumber = body.trackingNumber;
      }
      if (body.carrier) {
        db.orders[oIdx].carrier = body.carrier;
      }
      await saveStoreDb(db);
      return NextResponse.json({ order: db.orders[oIdx], success: true });
    }
  }

  // Update product details
  if (body.type === "update_product" && body.product) {
    const idx = db.products.findIndex((p) => p.id === body.product.id);
    if (idx > -1) {
      db.products[idx] = {
        ...db.products[idx],
        ...body.product,
        price: Number(body.product.price) || db.products[idx].price,
        compareAtPrice: Number(body.product.compareAtPrice) || db.products[idx].compareAtPrice,
        supplierCost: Number(body.product.supplierCost) || db.products[idx].supplierCost,
        stockLeft: Number(body.product.stockLeft) ?? db.products[idx].stockLeft,
      };
      await saveStoreDb(db);
      return NextResponse.json({ product: db.products[idx], success: true });
    }
  }

  // Update store settings
  if (body.type === "update_settings" && body.settings) {
    db.settings = {
      ...db.settings,
      ...body.settings,
      freeShippingThresholdUsd: Number(
        body.settings.freeShippingThresholdUsd ?? db.settings.freeShippingThresholdUsd
      ),
      defaultMarkupMultiplier: Number(
        body.settings.defaultMarkupMultiplier ?? db.settings.defaultMarkupMultiplier
      ),
    };
    await saveStoreDb(db);
    return NextResponse.json({ settings: db.settings, success: true });
  }

  return NextResponse.json({ error: "Invalid update payload" }, { status: 400 });
}

export async function DELETE(request: Request) {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("id");
  const orderId = searchParams.get("orderId");

  const db = await getStoreDb();

  if (orderId) {
    db.orders = db.orders.filter((o) => o.id !== orderId);
    await saveStoreDb(db);
    return NextResponse.json({ success: true });
  }

  if (productId) {
    if (productId === "all") {
      db.products = [];
    } else {
      db.products = db.products.filter((p) => p.id !== productId);
    }
    await saveStoreDb(db);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Missing parameter" }, { status: 400 });
}
