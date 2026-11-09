import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoreDb, sanitizeProductForPublic } from "@/lib/store-db";
import { INITIAL_PRODUCTS, Product } from "@/data/products";
import { ProductDetailPage } from "@/components/ProductDetailPage";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const LEGACY_PRODUCT_ID_MAP: Record<string, string> = {
  "prod-laroche-posay-vitaminc10": "prod-larocheposay-vitaminc10",
  "prod-larocheposay-vitaminc": "prod-larocheposay-vitaminc10",
  "prod-laroche-posay-vitamin-c": "prod-larocheposay-vitaminc10",
  "imp-drunk-elephant-cfirma": "prod-drunkelephant-184",
  "prod-cosrx-snail-96": "prod-cosrx-28",
  "prod-nivea-creme-classic": "amz-prod-B00A35SIHE",
  "prod-nivea-luminous630": "prod-nivea-7",
  "prod-nivea-q10-power": "prod-nivea-5",
  "prod-nivea-radiant-beauty": "prod-nivea-11",
  "prod-laroche-posay-cicaplast": "prod-larocheposay-22",
  "prod-cerave-moisturizing-cream": "prod-cerave-14",
  "prod-the-ordinary-niacinamide": "prod-theordinary-36",
  "prod-paulas-choice-bha": "prod-paulaschoice-41",
  "prod-beauty-of-joseon-relief-sun": "prod-beautyofjoseon-30",
  "prod-beautyofjoseon-44": "prod-beautyofjoseon-138",
  "prod-anua-43": "prod-anua-146",
  "imp-tatcha-water-cream": "prod-tatcha-193",
  "imp-tatcha-dewy-skin": "prod-tatcha-194",
  "imp-bioderma-sensibio-h2o": "prod-bioderma-96",
  "imp-bioderma-atoderm-baume": "prod-bioderma-97",
  "imp-eucerin-advanced-repair": "prod-eucerin-55",
  "imp-eucerin-anti-pigment": "prod-eucerin-56",
  "imp-avene-cicalfate-plus": "prod-avne-76",
  "imp-avene-thermal-spring-water": "prod-avne-77",
  "imp-neutrogena-hydro-boost": "prod-neutrogena-281",
  "imp-sunday-riley-good-genes": "prod-theordinary-38",
  "prod-eucerin-68": "prod-eucerin-56",
  "prod-avne-94": "prod-avne-82",
  "prod-anua-147": "prod-anua-144",
  "prod-theordinary-179": "prod-theordinary-168",
};

function resolveProduct(products: Product[], rawId: string): Product | undefined {
  const cleanId = rawId.trim();
  const lowerId = cleanId.toLowerCase();
  const pool = products.length > 0 ? products : INITIAL_PRODUCTS;

  // 1. Exact ID or SKU match
  const exact =
    pool.find((p) => p.id.toLowerCase() === lowerId || (p.sku && p.sku.toLowerCase() === lowerId)) ||
    INITIAL_PRODUCTS.find((p) => p.id.toLowerCase() === lowerId || (p.sku && p.sku.toLowerCase() === lowerId));
  if (exact) return exact;

  // 2. Legacy ID alias map
  const mappedId = LEGACY_PRODUCT_ID_MAP[lowerId];
  if (mappedId) {
    const mapped =
      pool.find((p) => p.id === mappedId) || INITIAL_PRODUCTS.find((p) => p.id === mappedId);
    if (mapped) return mapped;
  }

  // 3. Keyword / slug fallback so old bookmarks or partial slugs never 404
  if (lowerId.includes("vitaminc") || lowerId.includes("vitamin-c")) {
    return (
      pool.find((p) => p.id === "prod-larocheposay-vitaminc10") ||
      INITIAL_PRODUCTS.find((p) => p.id === "prod-larocheposay-vitaminc10")
    );
  }
  if (lowerId.includes("cfirma") || lowerId.includes("c-firma")) {
    return (
      pool.find((p) => p.id === "prod-drunkelephant-184") ||
      INITIAL_PRODUCTS.find((p) => p.id === "prod-drunkelephant-184")
    );
  }

  const tokens = lowerId
    .replace(/^(prod|imp|amz|gen)-/, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3);

  if (tokens.length > 0) {
    let best: Product | undefined;
    let bestScore = 0;
    for (const p of pool) {
      const hay = `${p.id} ${p.brand} ${p.name} ${p.sku || ""}`.toLowerCase();
      let score = 0;
      for (const t of tokens) {
        if (hay.includes(t)) score += t.length;
      }
      if (score > bestScore) {
        bestScore = score;
        best = p;
      }
    }
    if (best && bestScore >= 4) return best;
  }

  return undefined;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const db = await getStoreDb();
  const rawProduct = resolveProduct(db.products, decodedId);

  if (!rawProduct) {
    return {
      title: "Product Not Found • AURA",
      description: "The requested clinical skincare item could not be located.",
    };
  }

  const product = sanitizeProductForPublic(rawProduct);
  const title = `${product.name} • AURA`;
  const description =
    product.shortDescription ||
    `${product.brand} - ${product.tagline}. Authentic clinical skincare with verified batch authenticity and fast tracked delivery worldwide.`;

  const imageUrl = product.image.startsWith("http")
    ? product.image
    : `https://auraskinng.vercel.app${product.image}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: ProductPageProps) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const db = await getStoreDb();
  const rawProduct = resolveProduct(db.products, decodedId);

  if (!rawProduct) {
    notFound();
  }

  const product = sanitizeProductForPublic(rawProduct);

  // Suggested related products from same brand or category
  const related = db.products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.brand === product.brand || p.category === product.category)
    )
    .slice(0, 4)
    .map(sanitizeProductForPublic);

  return <ProductDetailPage initialProduct={product} relatedProducts={related} />;
}
