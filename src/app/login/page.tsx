import { Metadata } from "next";
import { SignInPage } from "@/components/ui/sign-in-page";

export const metadata: Metadata = {
  title: "Sign In • AURA",
  description: "Sign in to track orders, access viral skincare drops, and manage your account.",
};

export default function LoginPage() {
  return <SignInPage />;
}
