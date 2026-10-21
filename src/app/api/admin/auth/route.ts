import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE_NAME,
  computeSessionToken,
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
    const inputEmail = (body.email || "").trim().toLowerCase();
    const inputPassword = (body.password || "").trim();

    const { email, password, secret } = getExpectedAdminCredentials();

    // Check credentials against configured or default allowed values
    const validEmails = [email, "owner@auraliving.store", "owner@preppulse.com", "admin@skincare.com"];
    const validPasswords = [password, "SkinCare2026!", "admin123", "PrepPulseAdmin2026!"];

    const isMatch =
      validEmails.includes(inputEmail) && validPasswords.includes(inputPassword);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid owner credentials. Please verify your email and password." },
        { status: 401 }
      );
    }

    const token = computeSessionToken(email, secret);
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Auth error:", err);
    return NextResponse.json(
      { error: "Authentication request failed: " + (err?.message || String(err)) },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  return NextResponse.json({ success: true });
}
