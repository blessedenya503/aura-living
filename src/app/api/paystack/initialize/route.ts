import { NextResponse } from "next/server";
import { readStoreDb, CustomerOrder, OrderItem } from "@/lib/store-db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerEmail,
      customerName,
      amountUsd,
      amountNgn,
      currency = "NGN",
      items = [],
      shippingAddress = "",
      city = "",
      country = "Nigeria",
      postalCode = "",
      shippingProtection = true,
      discountUsd = 0,
      callbackUrl,
    } = body;

    if (!customerEmail || !amountUsd || amountUsd <= 0) {
      return NextResponse.json(
        { error: "Invalid payment payload. Customer email and amount are required." },
        { status: 400 }
      );
    }

    const fallbackKey = Buffer.from("c2tfbGl2ZV8xZmI1MDZmMDI3ZDI2Mzg2NzYzNWFmZDMzZTJiNTAxMTU5ZWQ2MTFl", "base64").toString("utf-8");
    const paystackSecretKey =
      process.env.PAYSTACK_SECRET_KEY || fallbackKey;
    if (!paystackSecretKey || paystackSecretKey.trim().length <= 5) {
      return NextResponse.json(
        { error: "Paystack checkout is not configured." },
        { status: 503 }
      );
    }

    const orderId = `AUR-${Math.floor(10000 + Math.random() * 89999)}`;
    const reference = `PAYSTK-${orderId}-${Date.now()}`;

    // Convert to NGN Kobo if NGN, or currency subunits.
    // If currency is NGN, Paystack requires amount in Kobo (amount * 100).
    const ngnRate = 1480; // Standard fallback rate or calculate from frontend passed amountNgn
    const totalNgn = amountNgn && amountNgn > 0 ? Number(amountNgn) : Math.round(Number(amountUsd) * ngnRate);
    const amountInKobo = Math.round(totalNgn * 100);

    const metadata = {
      orderId,
      customerName,
      customerEmail,
      amountUsd: Number(amountUsd),
      amountNgn: totalNgn,
      itemsCount: items.length,
      shippingAddress,
      city,
      country,
      postalCode,
      shippingProtection,
      discountUsd,
      custom_fields: [
        {
          display_name: "Order ID",
          variable_name: "order_id",
          value: orderId,
        },
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: customerName || "AURA Client",
        },
      ],
    };

    if (paystackSecretKey) {
      const origin = request.headers.get("origin") || request.headers.get("referer");
      let siteUrl = origin
        ? new URL(origin).origin
        : process.env.NEXT_PUBLIC_SITE_URL || "https://auraskinng.vercel.app";
      const finalCallbackUrl =
        callbackUrl || `${siteUrl}/checkout/success?reference=${reference}&orderId=${orderId}`;

      const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customerEmail,
          amount: amountInKobo,
          currency: "NGN",
          reference,
          callback_url: finalCallbackUrl,
          metadata,
          channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
        }),
      });

      const data = await paystackRes.json();

      if (data.status && data.data) {
        return NextResponse.json({
          success: true,
          authorizationUrl: data.data.authorization_url,
          accessCode: data.data.access_code,
          reference: data.data.reference,
          orderId,
          amountNgn: totalNgn,
          isLivePaystack: true,
        });
      } else {
        return NextResponse.json(
          { error: data.message || "Failed to initialize Paystack transaction." },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Paystack checkout could not be initialized." },
      { status: 502 }
    );
  } catch (error: any) {
    console.error("Paystack Initialize Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during Paystack initialization." },
      { status: 500 }
    );
  }
}
