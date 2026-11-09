import { NextRequest, NextResponse } from "next/server";
import { getHostedSites, createHostedSite, deleteHostedSite } from "@/lib/hostEngine";

export async function GET() {
  const sites = await getHostedSites();
  return NextResponse.json({ success: true, sites });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, type } = body;
    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }
    const newSite = await createHostedSite(name, type || "Static HTML5");
    return NextResponse.json({ success: true, site: newSite });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ success: false, error: "Slug is required" }, { status: 400 });
  }
  const ok = await deleteHostedSite(slug);
  return NextResponse.json({ success: ok });
}
