import { NextRequest, NextResponse } from "next/server";
import { CurrencyCode, CURRENCIES } from "@/data/products";

// Map countries/regions to available currencies in our store
const COUNTRY_TO_CURRENCY: Record<string, CurrencyCode> = {
  // Africa
  NG: "NGN", // Nigeria
  GH: "NGN", // Ghana -> nearest active regional currency
  KE: "KES", // Kenya
  UG: "KES", // Uganda -> nearest regional KES
  TZ: "KES", // Tanzania -> nearest regional KES
  RW: "KES", // Rwanda -> KES
  ZA: "ZAR", // South Africa
  NA: "ZAR", // Namibia -> ZAR
  BW: "ZAR", // Botswana -> ZAR
  EG: "AED", // Egypt -> nearest Middle East/AED
  MA: "EUR", // Morocco -> nearest EUR

  // UK & Europe
  GB: "GBP", // United Kingdom
  IM: "GBP",
  JE: "GBP",
  GG: "GBP",
  FR: "EUR", // France
  DE: "EUR", // Germany
  IT: "EUR", // Italy
  ES: "EUR", // Spain
  NL: "EUR", // Netherlands
  BE: "EUR", // Belgium
  IE: "EUR", // Ireland
  PT: "EUR", // Portugal
  AT: "EUR", // Austria
  SE: "SEK", // Sweden
  NO: "SEK", // Norway -> nearest SEK
  DK: "EUR", // Denmark -> EUR
  CH: "CHF", // Switzerland

  // North America
  US: "USD", // United States
  CA: "CAD", // Canada
  MX: "MXN", // Mexico

  // Asia Pacific
  JP: "JPY", // Japan
  KR: "KRW", // South Korea
  CN: "CNY", // China
  HK: "HKD", // Hong Kong
  SG: "SGD", // Singapore
  MY: "SGD", // Malaysia -> nearest SGD
  IN: "INR", // India
  AU: "AUD", // Australia
  NZ: "NZD", // New Zealand

  // Middle East
  AE: "AED", // UAE
  SA: "AED", // Saudi Arabia -> AED
  QA: "AED", // Qatar -> AED

  // South America
  BR: "BRL", // Brazil
};

export async function GET(request: NextRequest) {
  // 1. Try Vercel / Cloudflare geo headers
  const countryHeader =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    request.headers.get("x-country-code");

  let countryCode = (countryHeader || "").toUpperCase();

  // 2. If not available in header (e.g. local dev), attempt quick public IP geo lookup with short timeout
  if (!countryCode || countryCode === "XX") {
    try {
      const clientIp =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
      if (clientIp && !clientIp.startsWith("127.") && !clientIp.startsWith("192.168.")) {
        const geoRes = await fetch(`https://ipapi.co/${clientIp}/country/`, {
          signal: AbortSignal.timeout(1500),
        });
        if (geoRes.ok) {
          const text = (await geoRes.text()).trim().toUpperCase();
          if (text && text.length === 2) {
            countryCode = text;
          }
        }
      }
    } catch {
      // fallback
    }
  }

  // Determine matching currency
  let matchedCurrency: CurrencyCode = "USD"; // global default
  if (countryCode && COUNTRY_TO_CURRENCY[countryCode]) {
    matchedCurrency = COUNTRY_TO_CURRENCY[countryCode];
  } else if (countryCode === "NG") {
    matchedCurrency = "NGN";
  }

  return NextResponse.json({
    success: true,
    country: countryCode || "US",
    currency: matchedCurrency,
    currencyConfig: CURRENCIES[matchedCurrency],
  });
}
