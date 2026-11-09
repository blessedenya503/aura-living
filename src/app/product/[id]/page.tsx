import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoreDb, sanitizeProductForPublic } from "@/lib/store-db";
import { ProductDetailPage } from "@/components/ProductDetailPage";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);
  const db = await getStoreDb();
  const rawProduct = db.products.find(
    (p) => p.id === decodedId || p.sku.toLowerCase() === decodedId.toLowerCase()
  );

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
  const rawProduct = db.products.find(
    (p) => p.id === decodedId || p.sku.toLowerCase() === decodedId.toLowerCase()
  );

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
