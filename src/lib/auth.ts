import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { getResendClient, FROM_EMAIL, sendWelcomeEmail } from "@/lib/email";

/**
 * Real customer authentication (email + password with verified email, optional Google).
 * Users/sessions live in the existing Neon Postgres database.
 */
function connectionString() {
  const raw = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  // pg does not need channel_binding; strip it to avoid handshake issues
  return raw.replace(/[&?]channel_binding=[^&]+/, "");
}

const globalForPool = globalThis as unknown as { __authPool?: Pool };
const pool =
  globalForPool.__authPool ||
  new Pool({ connectionString: connectionString(), ssl: { rejectUnauthorized: false }, max: 3 });
if (process.env.NODE_ENV !== "production") globalForPool.__authPool = pool;

const siteUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3003");

async function sendMail(to: string, subject: string, html: string) {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[auth] Resend not configured; email not sent to", to);
    return;
  }
  const { error } = await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
  if (error) console.error("[auth] email error:", error);
}

const wrap = (title: string, body: string, cta: string, url: string) => `
<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:24px;color:#0f172a">
  <h2 style="margin:0 0 12px">${title}</h2>
  <p style="line-height:1.6;color:#334155">${body}</p>
  <p style="margin:24px 0"><a href="${url}" style="background:#0032A0;color:#fff;padding:12px 22px;border-radius:10px;text-decoration:none;font-weight:bold">${cta}</a></p>
  <p style="font-size:12px;color:#64748b">If the button doesn't work, paste this link into your browser:<br>${url}</p>
  <p style="font-size:12px;color:#64748b">If you didn't request this, you can ignore this email.</p>
</div>`;

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: pool,
  baseURL: siteUrl,
  secret:
    process.env.BETTER_AUTH_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    "aura-skin-clinical-better-auth-secret-key-2026-prod",
  trustedOrigins: [
    siteUrl,
    "https://auraskinng.vercel.app",
    "http://localhost:3002",
    "http://localhost:3003",
  ],
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: true,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) => {
      await sendMail(
        user.email,
        "Reset your AURA password",
        wrap("Reset your password", "Click below to choose a new password. This link expires in 1 hour.", "Reset password", url)
      );
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendMail(
        user.email,
        "Verify your email for AURA",
        wrap("Confirm your email", `Hi ${user.name || "there"}, confirm your email to activate your AURA account and unlock your VIP 20% welcome discount.`, "Verify email", url)
      );
    },
    afterEmailVerification: async (user) => {
      await sendWelcomeEmail(user.email, user.name).catch(() => {});
    },
  },
  socialProviders: googleEnabled
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID as string,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
      }
    : {},
  account: { accountLinking: { enabled: true, trustedProviders: ["google"] } },
});
