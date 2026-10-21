import { NextResponse } from "next/server";
import { isRequestAdminAuthenticated } from "@/lib/admin-auth";
import { readStoreDb } from "@/lib/store-db";

export async function GET() {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = readStoreDb();
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

  // Calculate internal order balances
  const totalRevenueUsd = db.orders.reduce((s, o) => s + (o.totalPaidUsd || 0), 0);
  const totalNetProfitUsd = db.orders.reduce((s, o) => s + (o.netProfitUsd || 0), 0);
  const ngnRate = 1480;

  let livePaystackBalance = null;
  let isLiveConnected = false;

  if (paystackSecretKey && paystackSecretKey.trim().length > 5) {
    try {
      const paystackRes = await fetch("https://api.paystack.co/balance", {
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

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
    } catch (err) {
      console.error("Paystack live balance fetch error:", err);
    }
  }

  // Simulated / internal store ledger from store-db
  const totalRevenueNgn = Math.round(totalRevenueUsd * ngnRate);
  const totalNetProfitNgn = Math.round(totalNetProfitUsd * ngnRate);

  // Bank payout info
  const linkedBank = {
    bankName: "Access Bank / GTBank / Zenith",
    accountNumber: "012****890",
    accountName: "AURA LIVING ENTERPRISE (NG)",
    payoutSchedule: "Next-day automatic bank settlement (T+1 at 05:00 WAT)",
    settlementCurrency: "NGN (Nigerian Naira ₦)",
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
    recentTransactions,
  });
}
