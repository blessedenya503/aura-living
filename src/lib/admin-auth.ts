import { cookies } from "next/headers";
import { computeSessionToken } from "@/lib/admin-session";

export const ADMIN_COOKIE_NAME = "aura_owner_session";

export function getExpectedAdminCredentials() {
  const email = (process.env.ADMIN_EMAIL || "owner@preppulse.com").trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "PrepPulseAdmin2026!";
  const secret = process.env.ADMIN_SESSION_SECRET || "preppulse_super_secret_hmac_key_2026_x99";

  return { email, password, secret };
}

export async function isRequestAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const credentials = getExpectedAdminCredentials();
  if (!token || !credentials) return false;

  const expected = await computeSessionToken(
    credentials.email,
    credentials.secret
  );
  return token === expected;
}
