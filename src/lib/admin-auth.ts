import { cookies } from "next/headers";
import { computeSessionToken } from "@/lib/admin-session";

export const ADMIN_COOKIE_NAME = "aura_owner_session";

export function getExpectedAdminCredentials() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!email || !password || !secret) {
    return null;
  }

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
