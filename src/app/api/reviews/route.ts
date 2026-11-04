import { NextResponse } from "next/server";
import { getStoreDb, saveStoreDb } from "@/lib/store-db";

export const dynamic = "force-dynamic";

export interface UserReviewItem {
  id: string;
  author: string;
  location?: string;
  rating: number;
  title: string;
  comment: string;
  productName?: string;
  brand?: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export async function GET() {
  try {
    const db = await getStoreDb();
    const reviews: UserReviewItem[] = (db as any).userReviews || [];
    return NextResponse.json({ reviews });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to load reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { author, location, rating, title, comment, productName, brand } = body;

    if (!author?.trim() || !comment?.trim() || !rating) {
      return NextResponse.json({ error: "Name, rating, and comment are required." }, { status: 400 });
    }

    const db = await getStoreDb();
    const existing: UserReviewItem[] = (db as any).userReviews || [];

    const newReview: UserReviewItem = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      author: author.trim(),
      location: location?.trim() || "Nigeria",
      rating: Number(rating) || 5,
      title: title?.trim() || "Verified Customer Review",
      comment: comment.trim(),
      productName: productName?.trim() || "AURA Skincare Routine",
      brand: brand?.trim() || "AURA",
      date: "Just now",
      verified: true,
      helpfulCount: 0,
    };

    const updated = [newReview, ...existing];
    (db as any).userReviews = updated;

    await saveStoreDb(db);

    return NextResponse.json({ success: true, review: newReview, reviews: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to submit review" }, { status: 500 });
  }
}
