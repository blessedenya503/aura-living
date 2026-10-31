import type { MetadataRoute } from "next";
import { getStoreDb } from "@/lib/store-db";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://auraskinng.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/track-order`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    const db = await getStoreDb();
    const brands = Array.from(
      new Set((db.products || []).map((p) => p.brand).filter(Boolean))
    );

    const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
      url: `${SITE_URL}/?brand=${encodeURIComponent(brand)}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85,
    }));

    const productRoutes: MetadataRoute.Sitemap = (db.products || [])
      .slice(0, 200)
      .map((product) => ({
        url: `${SITE_URL}/?product=${encodeURIComponent(product.id)}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...baseRoutes, ...brandRoutes, ...productRoutes];
  } catch {
    return baseRoutes;
  }
}
