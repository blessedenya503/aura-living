import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), "hosted-sites", slug, "public_html", "index.html");

  try {
    const content = await fs.readFile(filePath, "utf8");
    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Served-By": "NovaHost-LiteSpeed-Edge",
        "X-Host-Root": slug,
      },
    });
  } catch {
    return new NextResponse(
      `<!DOCTYPE html>
<html>
<head><title>404 - Site Not Found</title></head>
<body style="font-family:sans-serif;background:#090a12;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;margin:0;">
  <div style="text-align:center;">
    <h1 style="color:#6c5ce7;font-size:48px;margin:0;">404</h1>
    <h2>No website hosted at /${slug}</h2>
    <p style="color:#8a8d9e;">Deploy a site to this slug from NovaPanel.</p>
    <a href="/panel" style="color:#00cec9;font-weight:bold;">Open NovaPanel</a>
  </div>
</body>
</html>`,
      {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      }
    );
  }
}
