import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { computeSessionToken } from "@/lib/admin-session";

const ADMIN_COOKIE_NAME = "aura_owner_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const isPort3003 = host.includes(":3003");
  const isPort3002 = host.includes(":3002");

  // Rule 1: Port 3003 is the public website.
  // The owner portal is NOT visible to the public on port 3003!
  if (isPort3003 && pathname.startsWith("/owner-portal")) {
    const publicHome = new URL("/", request.url);
    const res = NextResponse.redirect(publicHome);
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
    return res;
  }

  // Rule 2: Port 3002 is the dedicated Owner Portal port.
  // When owner opens http://localhost:3002/, auto-redirect directly to the dashboard
  if (isPort3002 && pathname === "/") {
    const portalUrl = new URL("/owner-portal", request.url);
    return NextResponse.redirect(portalUrl);
  }

  if (pathname.startsWith("/owner-portal")) {
    const isLoginPage = pathname === "/owner-portal/login";
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const secret = process.env.ADMIN_SESSION_SECRET;
    const expectedToken =
      email && secret ? await computeSessionToken(email, secret) : null;
    const isAuthenticated = Boolean(
      sessionCookie && expectedToken && sessionCookie === expectedToken
    );

    if (!isAuthenticated && !isLoginPage) {
      const loginUrl = new URL("/owner-portal/login", request.url);
      const res = NextResponse.redirect(loginUrl);
      res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return res;
    }

    if (isAuthenticated && isLoginPage) {
      const portalUrl = new URL("/owner-portal", request.url);
      const res = NextResponse.redirect(portalUrl);
      res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return res;
    }

    const res = NextResponse.next();
    res.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/owner-portal/:path*"],
};
