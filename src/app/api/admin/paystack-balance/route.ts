import { NextResponse } from "next/server";
import { isRequestAdminAuthenticated } from "@/lib/admin-auth";
import { getStoreDb, saveStoreDb } from "@/lib/store-db";

export async function GET() {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = await getStoreDb();
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY || "";

  // Calculate internal order balances
  const totalRevenueUsd = db.orders.reduce((s, o) => s + (o.totalPaidUsd || 0), 0);
  const totalNetProfitUsd = db.orders.reduce((s, o) => s + (o.netProfitUsd || 0), 0);
  const ngnRate = 1480;

  let livePaystackBalance = null;
  let isLiveConnected = false;

  if (paystackSecretKey && paystackSecretKey.trim().length > 5) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s strict timeout

      const paystackRes = await fetch("https://api.paystack.co/balance", {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (paystackRes.ok) {
        const data = await paystackRes.json();
        if (data.status && Array.isArray(data.data)) {
          isLiveConnected = true;
          // data.data is an array of balances e.g. [{ currency: "NGN", balance: 5000000 }] (in kobo)
          livePaystackBalance = data.data.map((b: { currency: string; balance: number }) => ({
            currency: b.currency,
            balance: b.currency === "NGN" ? b.balance / 100 : b.balance / 100,
          }));
        }
      }
    } catch {
      // Non-blocking: never hang the portal if the external network is slow.
      // isLiveConnected stays false so the UI doesn't claim a live connection.
    }
  }

  // Simulated / internal store ledger from store-db
  const totalRevenueNgn = Math.round(totalRevenueUsd * ngnRate);
  const totalNetProfitNgn = Math.round(totalNetProfitUsd * ngnRate);

  // Bank payout info: only what the owner actually connected (no fabricated default)
  const linkedBank = db.settings.linkedBank || {
    bankName: "",
    bankCode: "",
    accountNumber: "",
    accountName: "",
    status: "unlinked",
    payoutSchedule: "",
    settlementCurrency: "NGN (Nigerian Naira ₦)",
  };

  const linkedPayPal = db.settings.linkedPayPal || {
    email: "auraskinngofficial@gmail.com",
    paypalMeUsername: "auraskinng",
    accountHolder: "AURA SKIN OFFICIAL",
    settlementCurrency: "USD ($)",
    status: "connected",
  };

  // Recent transactions list from orders
  const recentTransactions = db.orders.slice(0, 10).map((ord) => ({
    id: ord.id,
    date: ord.createdAt,
    customer: ord.customerName,
    amountUsd: ord.totalPaidUsd,
    amountNgn: Math.round(ord.totalPaidUsd * ngnRate),
    netProfitUsd: ord.netProfitUsd,
    netProfitNgn: Math.round(ord.netProfitUsd * ngnRate),
    status: ord.paymentStatus,
    paymentMethod: ord.paymentMethod,
    trackingNumber: ord.trackingNumber,
  }));

  return NextResponse.json({
    success: true,
    isLiveConnected,
    hasKey: Boolean(paystackSecretKey),
    livePaystackBalance,
    calculatedBalance: {
      grossRevenueUsd: Number(totalRevenueUsd.toFixed(2)),
      grossRevenueNgn: totalRevenueNgn,
      availablePayoutUsd: Number(totalNetProfitUsd.toFixed(2)),
      availablePayoutNgn: totalNetProfitNgn,
      pendingSettlementNgn: Math.round(totalNetProfitNgn * 0.25),
      clearedPayoutNgn: Math.round(totalNetProfitNgn * 0.75),
    },
    linkedBank,
    linkedPayPal,
    recentTransactions,
  });
}

export async function POST(req: Request) {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { email, paypalMeUsername, accountHolder, clientId } = body;

    if (!email || !String(email).includes("@")) {
      return NextResponse.json(
        { error: "Please enter a valid PayPal email address." },
        { status: 400 }
      );
    }

    const db = await getStoreDb();
    db.settings.linkedPayPal = {
      email: String(email).trim(),
      paypalMeUsername: String(paypalMeUsername || "")
        .replace(/^https?:\/\/(www\.)?paypal\.me\//i, "")
        .replace(/^@/, "")
        .trim(),
      accountHolder: String(accountHolder || "AURA SKIN OFFICIAL").trim(),
      clientId: String(clientId || "").trim(),
      settlementCurrency: "USD ($)",
      status: "connected",
      connectedAt: new Date().toISOString(),
    };
    await saveStoreDb(db);

    return NextResponse.json({
      success: true,
      linkedPayPal: db.settings.linkedPayPal,
      message: `PayPal account (${db.settings.linkedPayPal.email}) connected for checkout & USD payouts!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to save PayPal account." },
      { status: 500 }
    );
  }
}
