import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

/** Public: serves owner-uploaded images from data/uploads. */
export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  if (!/^[a-z0-9-]+\.jpg$/i.test(file)) {
    return new Response("Not found", { status: 404 });
  }
  const full = path.join(process.cwd(), "data", "uploads", file);
  if (!fs.existsSync(full)) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(fs.readFileSync(full)), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
