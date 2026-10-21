import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { computeSessionToken } from "@/lib/admin-session";
import {
  ADMIN_COOKIE_NAME,
  getExpectedAdminCredentials,
  isRequestAdminAuthenticated,
} from "@/lib/admin-auth";

export async function GET() {
  const authenticated = await isRequestAdminAuthenticated();
  return NextResponse.json({ authenticated });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const inputEmail =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const inputPassword =
      typeof body.password === "string" ? body.password : "";
    const credentials = getExpectedAdminCredentials();

    if (!credentials) {
      return NextResponse.json(
        { error: "Admin authentication is not configured." },
        { status: 503 }
      );
    }

    const isMatch =
      inputEmail === credentials.email && inputPassword === credentials.password;

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid owner credentials." },
        { status: 401 }
      );
    }

    const token = await computeSessionToken(
      credentials.email,
      credentials.secret
    );
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Auth error:", err);
    return NextResponse.json(
      { error: "Authentication request failed." },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
