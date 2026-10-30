import { NextResponse } from "next/server";
import { isRequestAdminAuthenticated } from "@/lib/admin-auth";
import { getStoreDb, saveStoreDb, writeStoreDb } from "@/lib/store-db";

export const dynamic = "force-dynamic";

async function paystack(path: string, secret: string, init?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`https://api.paystack.co${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    return { ok: res.ok, json };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(req: Request) {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { bankName, bankCode, accountNumber, accountName } = await req.json();

    if (!bankName || !bankCode || !/^\d{10}$/.test(String(accountNumber || ""))) {
      return NextResponse.json(
        { error: "Select a bank and enter a valid 10-digit account number." },
        { status: 400 }
      );
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "PAYSTACK_SECRET_KEY is not configured." },
        { status: 500 }
      );
    }

    // 1. Resolve the account name with the bank via Paystack
    let resolvedName = "";
    try {
      const resolved = await paystack(
        `/bank/resolve?account_number=${encodeURIComponent(accountNumber)}&bank_code=${encodeURIComponent(bankCode)}`,
        secret
      );
      if (resolved.ok && resolved.json?.data?.account_name) {
        resolvedName = resolved.json.data.account_name;
      }
    } catch {
      // resolve is best-effort; recipient creation below is the real check
    }

    // 2. Register a Paystack transfer recipient (this is the real verification)
    const recipient = await paystack("/transferrecipient", secret, {
      method: "POST",
      body: JSON.stringify({
        type: "nuban",
        name: resolvedName || accountName || "Store Beneficiary",
        account_number: accountNumber,
        bank_code: bankCode,
        currency: "NGN",
      }),
    }).catch(() => null);

    if (!recipient || !recipient.ok || !recipient.json?.data?.recipient_code) {
      return NextResponse.json(
        {
          error:
            recipient?.json?.message ||
            "Paystack could not verify this account (check the bank and number, or your internet connection).",
        },
        { status: 422 }
      );
    }

    const db = await getStoreDb();
    db.settings.linkedBank = {
      bankName,
      bankCode,
      accountNumber,
      accountName: recipient.json.data.details?.account_name || resolvedName || accountName || "",
      recipientCode: recipient.json.data.recipient_code,
      status: "connected",
      connectedAt: new Date().toISOString(),
      payoutSchedule: "Next-day automatic bank settlement (T+1)",
      settlementCurrency: "NGN (Nigerian Naira ₦)",
      verifiedVia: "Paystack transfer recipient",
    };
    await saveStoreDb(db);

    return NextResponse.json({
      success: true,
      linkedBank: db.settings.linkedBank,
      message: `Verified and connected: ${bankName} •••• ${String(accountNumber).slice(-4)}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to connect bank account." },
      { status: 500 }
    );
  }
}
