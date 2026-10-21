import { NextResponse } from "next/server";

// Fallback rates if external API is unreachable
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.38,
  AUD: 1.54,
  JPY: 154.5,
  CHF: 0.89,
  NGN: 1480.0,
  ZAR: 18.4,
  KES: 131.0,
  AED: 3.67,
  SGD: 1.35,
  INR: 83.5,
  BRL: 5.65,
  CNY: 7.24,
  MXN: 19.8,
  KRW: 1380.0,
  SEK: 10.6,
  NZD: 1.66,
  HKD: 7.82,
};

let cachedRates: Record<string, number> = { ...FALLBACK_RATES };
let lastFetchedAt = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour cache

export async function GET() {
  const now = Date.now();

  // If cache is still valid, return cached rates
  if (now - lastFetchedAt < CACHE_TTL_MS && Object.keys(cachedRates).length > 10) {
    return NextResponse.json({
      success: true,
      source: "cache",
      base: "USD",
      timestamp: lastFetchedAt,
      rates: cachedRates,
    });
  }

  try {
    // Fetch live rates from Open Exchange Rates API (open free endpoint)
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        const merged: Record<string, number> = { ...FALLBACK_RATES };
        for (const code of Object.keys(FALLBACK_RATES)) {
          if (data.rates[code]) {
            merged[code] = Number(data.rates[code]);
          }
        }
        cachedRates = merged;
        lastFetchedAt = now;

        return NextResponse.json({
          success: true,
          source: "live-api",
          base: "USD",
          timestamp: lastFetchedAt,
          rates: cachedRates,
        });
      }
    }
  } catch (err) {
    console.error("Live exchange rates fetch error, serving fallback:", err);
  }

  // Return fallback if network fails
  return NextResponse.json({
    success: true,
    source: "fallback",
    base: "USD",
    timestamp: now,
    rates: cachedRates,
  });
}
