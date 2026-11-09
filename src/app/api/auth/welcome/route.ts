import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const result = await sendWelcomeEmail(email, name);

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `VIP Welcome email dispatched to ${email}`
        : "Email queued (Resend sandboxed)",
      error: result.error,
    });
  } catch (err: any) {
    console.error("Auth email route error:", err);
    return NextResponse.json({ error: err.message || "Failed to send email" }, { status: 500 });
  }
}
