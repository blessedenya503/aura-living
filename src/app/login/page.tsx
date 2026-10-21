import { Metadata } from "next";
import { SignInPage } from "@/components/ui/sign-in-page";

export const metadata: Metadata = {
  title: "Sign In • AURA Health & Skincare",
  description: "Sign in to track orders, access viral skincare drops, and manage your account.",
};

export default function LoginPage() {
  return (
    <SignInPage
      imageSrc="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1600&auto=format&fit=crop"
      imageAlt="AURA Skincare Customer Glow"
      quoteText="“Finding clinically verified Korean skincare and medical-grade moisturizers in one place transformed my routine. My barrier has never felt healthier.”"
      quoteAuthor="Dr. Elena Vance"
      quoteRole="Verified AURA Member"
    />
  );
}
