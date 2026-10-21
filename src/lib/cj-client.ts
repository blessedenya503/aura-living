import fs from "fs";
import path from "path";
import dns from "dns";
import { execSync } from "child_process";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // ignore
}

const TOKEN_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "cj-token.json"
);

interface CJTokenData {
  accessToken: string;
  accessTokenExpiryDate: string;
  refreshToken: string;
  refreshTokenExpiryDate: string;
}

/**
 * Summarizes keyword-stuffed CJdropshipping titles into a clean, concise product name.
 */
export function summarizeCjProductName(rawName: string): string {
  if (!rawName) return "Kitchen Tool";

  // 1. Strip bracketed warehouse notes
  let cleaned = rawName
    .replace(/\[.*?\]/g, "")
    .replace(/（.*?）/g, "")
    .replace(/\(.*?\)/g, "")
    .trim();

  // 2. Take the primary segment before comma, hyphen, or pipe
  cleaned = cleaned.split(/[,|—–]| - /)[0].trim();

  // 3. Remove common CJ filler/spam phrases
  const fillerPatterns = [
    /\b(household|home use|for kitchen and home use|for snacks home|kitchen household|kitchen accessories|kitchen tools|kitchen gadgets|lazy artifact|artifact|multifunctional|multi-functional|new|hot sale|portable|universal|creative|simple|fashionable|versatile|paired with)\b/gi,
    /\b(for baking|for cooking|for home brewing|with usb port|for car|for bathroom)\b/gi,
  ];
  for (const pattern of fillerPatterns) {
    cleaned = cleaned.replace(pattern, " ");
  }

  // Normalize "2 In 1" -> "2-in-1", "16 In 1" -> "16-in-1"
  cleaned = cleaned.replace(/\b(\d+)\s+in\s+(\d+)\b/gi, "$1-in-$2");

  // 4. Deduplicate repeated words (case-insensitive) while keeping order
  const words = cleaned.split(/\s+/).filter(Boolean);
  const seen = new Set<string>();
  const uniqueWords: string[] = [];

  for (const w of words) {
    const lower = w.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!lower) continue;
    if (seen.has(lower) && lower.length > 2) continue;
    seen.add(lower);
    const formatted =
      w.includes("-")
        ? w
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    uniqueWords.push(formatted);
  }

  // 5. Cap at 5 words and strip dangling prepositions/conjunctions at the end
  const sliced = uniqueWords.slice(0, 5);
  const trailingStopWords = new Set([
    "with",
    "for",
    "and",
    "or",
    "in",
    "on",
    "to",
    "of",
    "by",
    "from",
    "at",
    "the",
    "a",
    "an",
  ]);
  while (
    sliced.length > 1 &&
    trailingStopWords.has(sliced[sliced.length - 1].toLowerCase())
  ) {
    sliced.pop();
  }

  const summarized = sliced.join(" ").trim();
  return summarized || "Kitchen Gadget";
}

/**
 * Converts a direct CJ CDN image URL into our local IPv4-cached proxy URL
 * so images load in <500ms without browser IPv6 timeouts.
 */
export function toProxiedCjImageUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  if (rawUrl.startsWith("/api/cj-image?url=")) return rawUrl;
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return `/api/cj-image?url=${encodeURIComponent(rawUrl)}`;
  }
  return rawUrl;
}

// In-memory cache for CJ searches and product queries to make search instant (<50ms)
const CJ_API_CACHE = new Map<string, { data: unknown; expires: number }>();

export async function fetchCjJson(
  url: string,
  method: "GET" | "POST" = "GET",
  headers: Record<string, string> = {},
  bodyObj: Record<string, unknown> | null = null,
  cacheTtlMs: number = 1000 * 60 * 15 // 15 mins
): Promise<unknown> {
  const cacheKey = `${method}:${url}:${bodyObj ? JSON.stringify(bodyObj) : ""}`;
  if (method === "GET" && cacheTtlMs > 0) {
    const cached = CJ_API_CACHE.get(cacheKey);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 14000);

  try {
    const reqHeaders: Record<string, string> = { ...headers };
    if (bodyObj) {
      reqHeaders["Content-Type"] = "application/json";
    }

    const res = await fetch(url, {
      method,
      headers: reqHeaders,
      body: bodyObj ? JSON.stringify(bodyObj) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`CJ API HTTP ${res.status}`);
    }

    const json = await res.json();
    if (method === "GET" && cacheTtlMs > 0) {
      CJ_API_CACHE.set(cacheKey, { data: json, expires: Date.now() + cacheTtlMs });
    }
    return json;
  } catch (fetchErr) {
    clearTimeout(timeoutId);
    // Non-blocking fallback via curl -4 if native fetch fails
    try {
      const headerArgs = Object.entries(headers)
        .map(([k, v]) => `-H "${k}: ${v}"`)
        .join(" ");
      const bodyArg = bodyObj
        ? `-d "${JSON.stringify(bodyObj).replace(/"/g, '\\"')}"`
        : "";
      const cmd = `curl.exe -4 -s -m 12 -X ${method} ${headerArgs} ${bodyArg} "${url}"`;
      const raw = execSync(cmd, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
      const parsed = JSON.parse(raw);
      if (method === "GET" && cacheTtlMs > 0) {
        CJ_API_CACHE.set(cacheKey, {
          data: parsed,
          expires: Date.now() + cacheTtlMs,
        });
      }
      return parsed;
    } catch {
      throw fetchErr;
    }
  }
}

// Retain backwards-compatible synchronous wrapper if needed
export function fetchCjJsonViaCurl(
  url: string,
  method: "GET" | "POST" = "GET",
  headers: Record<string, string> = {},
  bodyObj: Record<string, unknown> | null = null
): unknown {
  const headerArgs = Object.entries(headers)
    .map(([k, v]) => `-H "${k}: ${v}"`)
    .join(" ");
  const bodyArg = bodyObj
    ? `-d "${JSON.stringify(bodyObj).replace(/"/g, '\\"')}"`
    : "";
  const cmd = `curl.exe -4 -s -m 12 -X ${method} ${headerArgs} ${bodyArg} "${url}"`;
  const raw = execSync(cmd, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
  return JSON.parse(raw);
}

export async function getValidCjAccessToken(): Promise<string | null> {
  const apiKey = process.env.CJ_API_KEY;
  if (!apiKey) return null;

  try {
    if (fs.existsSync(TOKEN_FILE_PATH)) {
      const raw = fs.readFileSync(TOKEN_FILE_PATH, "utf-8");
      const cached = JSON.parse(raw) as CJTokenData;
      if (
        cached?.accessToken &&
        cached?.accessTokenExpiryDate &&
        new Date(cached.accessTokenExpiryDate).getTime() >
          Date.now() + 60 * 1000
      ) {
        return cached.accessToken;
      }
    }
  } catch {
    // Proceed to fetch fresh token
  }

  try {
    const data = (await fetchCjJson(
      "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken",
      "POST",
      { "Content-Type": "application/json" },
      { apiKey },
      0
    )) as { result?: boolean; data?: CJTokenData };

    if (data?.result && data?.data?.accessToken) {
      try {
        fs.mkdirSync(path.dirname(TOKEN_FILE_PATH), { recursive: true });
        fs.writeFileSync(
          TOKEN_FILE_PATH,
          JSON.stringify(data.data, null, 2),
          "utf-8"
        );
      } catch {
        // Ignore write error
      }
      return data.data.accessToken;
    }
  } catch (err) {
    console.error("Failed to fetch CJ access token:", err);
  }

  return null;
}

