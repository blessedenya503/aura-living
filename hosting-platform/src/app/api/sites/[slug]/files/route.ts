import { NextRequest, NextResponse } from "next/server";
import {
  getRealSiteFiles,
  readRealFileContent,
  saveRealFileContent,
  createRealFile,
  deleteRealFile,
} from "@/lib/hostEngine";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");

  if (file) {
    const content = await readRealFileContent(slug, file);
    return NextResponse.json({ success: true, file, content });
  }

  const files = await getRealSiteFiles(slug);
  return NextResponse.json({ success: true, files });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const { name, content } = body;
  if (!name) {
    return NextResponse.json({ success: false, error: "File name required" }, { status: 400 });
  }
  const ok = await createRealFile(slug, name, content || "");
  return NextResponse.json({ success: ok });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json();
  const { name, content } = body;
  if (!name) {
    return NextResponse.json({ success: false, error: "File name required" }, { status: 400 });
  }
  const ok = await saveRealFileContent(slug, name, content ?? "");
  return NextResponse.json({ success: ok });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file");
  if (!file) {
    return NextResponse.json({ success: false, error: "File parameter required" }, { status: 400 });
  }
  const ok = await deleteRealFile(slug, file);
  return NextResponse.json({ success: ok });
}
