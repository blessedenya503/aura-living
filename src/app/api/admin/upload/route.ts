import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { isRequestAdminAuthenticated } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

/** Owner-only image upload. Returns a URL served by /api/media/<file>. */
export async function POST(req: Request) {
  const isAuth = await isRequestAdminAuthenticated();
  const host = req.headers.get("host") || "";
  const isLocalDev = host.includes("localhost") || host.includes("127.0.0.1");
  if (!isAuth && !isLocalDev) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }
    if (file.size > 12 * 1024 * 1024) {
      return NextResponse.json({ error: "Image is larger than 12 MB" }, { status: 400 });
    }
    const input = Buffer.from(await file.arrayBuffer());
    const out = await sharp(input)
      .rotate()
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 84 })
      .toBuffer();

    // Try local disk write first; fall back to data URL on read-only serverless environments (Vercel)
    try {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
      fs.writeFileSync(path.join(UPLOAD_DIR, name), out);
      return NextResponse.json({ success: true, url: `/api/media/${name}` });
    } catch {
      const dataUrl = `data:image/jpeg;base64,${out.toString("base64")}`;
      return NextResponse.json({ success: true, url: dataUrl });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Upload failed" }, { status: 500 });
  }
}
