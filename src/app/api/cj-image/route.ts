import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const CACHE_DIR = path.join(process.cwd(), "public", "cj-cache");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawUrl = (searchParams.get("url") || "").trim();

  if (!rawUrl || (!rawUrl.startsWith("https://") && !rawUrl.startsWith("http://"))) {
    return new NextResponse("Invalid image URL", { status: 400 });
  }

  try {
    fs.mkdirSync(CACHE_DIR, { recursive: true });

    const hash = crypto.createHash("md5").update(rawUrl).digest("hex");
    const extMatch = rawUrl.match(/\.(png|webp|jpeg|jpg|gif)(\?|$)/i);
    const ext = extMatch ? extMatch[1].toLowerCase() : "jpg";
    const cachedFilePath = path.join(CACHE_DIR, `${hash}.${ext}`);

    if (!fs.existsSync(cachedFilePath) || fs.statSync(cachedFilePath).size < 100) {
      // Download the real product image from CJ CDN over IPv4 (-4) to bypass Windows IPv6 timeout
      const safeUrl = rawUrl.replace(/"/g, "");
      execSync(
        `curl.exe -4 -s -L -m 15 -A "Mozilla/5.0" -o "${cachedFilePath}" "${safeUrl}"`
      );
    }

    if (fs.existsSync(cachedFilePath) && fs.statSync(cachedFilePath).size > 100) {
      const buffer = fs.readFileSync(cachedFilePath);
      const contentType =
        ext === "png"
          ? "image/png"
          : ext === "webp"
          ? "image/webp"
          : ext === "gif"
          ? "image/gif"
          : "image/jpeg";

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch (err) {
    console.error("Failed to fetch CJ image via IPv4:", err);
  }

  return NextResponse.redirect(rawUrl);
}
