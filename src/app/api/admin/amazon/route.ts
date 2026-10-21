import { NextResponse } from "next/server";
import { isRequestAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const term = (searchParams.get("q") || "nivea creme").trim();
  const apiKey = process.env.RAINFOREST_API_KEY || "C051194DA4E549E993DABCBA690621DC";

  try {
    const res = await fetch(
      `https://api.rainforestapi.com/request?api_key=${apiKey}&type=search&amazon_domain=amazon.com&search_term=${encodeURIComponent(
        term
      )}`
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Rainforest API request failed", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    const results = (data.search_results || []).map((item: any) => {
      const price = item.price?.value || 12.99;
      return {
        asin: item.asin,
        title: item.title,
        link: item.link,
        image: item.image,
        rating: item.rating || 4.8,
        ratingsTotal: item.ratings_total || 250,
        price,
        suggestedRetailPrice: Number((price * 1.6).toFixed(2)),
        isPrime: Boolean(item.is_prime),
        brand: item.brand || "Amazon Bestseller",
      };
    });

    return NextResponse.json({
      success: true,
      term,
      creditsRemaining: data.request_info?.credits_remaining,
      results,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch Amazon data" }, { status: 500 });
  }
}
