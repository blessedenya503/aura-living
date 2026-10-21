"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Eye, EyeOff, CheckCircle2, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignInPageProps {
  className?: string;
  imageSrc?: string;
  imageAlt?: string;
  quoteText?: string;
  quoteAuthor?: string;
  quoteRole?: string;
  onSuccess?: () => void;
}

export function SignInPage({
  className,
  imageSrc = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1600&auto=format&fit=crop",
  imageAlt = "AURA Skincare Customer Glow",
  quoteText = "“Finding clinically verified Korean skincare and medical-grade moisturizers in one place transformed my routine. My barrier has never felt healthier.”",
  quoteAuthor = "Dr. Elena Vance",
  quoteRole = "Verified AURA Club Member",
  onSuccess,
}: SignInPageProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState<"google" | "github" | null>(null);
  const [rememberMe, setRememberMe] = React.useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay for smooth UX
    setTimeout(() => {
      setIsLoading(false);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "aura_customer_user",
          JSON.stringify({
            email,
            name: email.split("@")[0],
            isLoggedIn: true,
            loggedInAt: new Date().toISOString(),
          })
        );
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    }, 900);
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    setSocialLoading(provider);
    setTimeout(() => {
      setSocialLoading(null);
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "aura_customer_user",
          JSON.stringify({
            email: provider === "google" ? "google.user@gmail.com" : "developer@github.com",
            name: provider === "google" ? "Google User" : "GitHub Developer",
            provider,
            isLoggedIn: true,
            loggedInAt: new Date().toISOString(),
          })
        );
      }
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    }, 1000);
  };

  return (
    <div className={cn("min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-white", className)}>
      {/* Left Column: Visual Showcase with Image and Brand Overlay */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-slate-900 border-r border-slate-800">
        {/* Background Image with Ambient Skincare Gradient Mask */}
        <div className="absolute inset-0 z-0">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
          />
          {/* Subtle gradient vignette for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/30" />
        </div>

        {/* Top Brand Pill Header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-linear-to-tr from-[#002B7F] to-cyan-500 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-cyan-900/40 group-hover:scale-105 transition-transform">
              AU
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors leading-none">
                AURA
              </span>
              <span className="text-[10px] text-cyan-300 font-mono tracking-widest uppercase">
                Health &amp; Skincare
              </span>
            </div>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-semibold text-cyan-300 backdrop-blur-md shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            100% Verified Sourced
          </span>
        </div>

        {/* Bottom Testimonial / Credibility Hook */}
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-[11px] font-bold text-cyan-300 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Member Privileges &amp; Express Dropship Tracking
          </div>

          <blockquote className="text-lg font-medium leading-relaxed text-slate-100 drop-shadow-sm">
            {quoteText}
          </blockquote>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-cyan-400/40">
              EV
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">{quoteAuthor}</p>
              <p className="text-xs text-slate-400 mt-1">{quoteRole}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Sign In Form Stage */}
      <div className="flex flex-col justify-between p-6 sm:p-12 lg:p-16 bg-slate-950 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Mobile Header */}
        <div className="flex items-center justify-between lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#002B7F] to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
              AU
            </div>
            <span className="text-lg font-bold text-white tracking-tight">AURA</span>
          </Link>
          <Link
            href="/"
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Back to Store
          </Link>
        </div>

        {/* Desktop Top Right Navigation */}
        <div className="hidden lg:flex justify-end items-center gap-3 text-xs">
          <span className="text-slate-400">Don&apos;t have an account?</span>
          <Link
            href="/login?mode=signup"
            className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors underline-offset-4 hover:underline"
          >
            Sign up for free
          </Link>
        </div>

        {/* Center Container */}
        <div className="w-full max-w-md mx-auto my-auto space-y-6">
          <div className="space-y-2 text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Sign in to track your dropship parcels, access member discounts, and manage saved formulations.
            </p>
          </div>

          {/* Social Sign In Buttons (Google & GitHub) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google OAuth Button */}
            <button
              type="button"
              disabled={socialLoading !== null}
              onClick={() => handleSocialLogin("google")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {socialLoading === "google" ? (
                <span className="inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Google</span>
            </button>

            {/* GitHub OAuth Button */}
            <button
              type="button"
              disabled={socialLoading !== null}
              onClick={() => handleSocialLogin("github")}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-855 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {socialLoading === "github" ? (
                <span className="inline-block w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
              )}
              <span>GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <span className="relative px-3 bg-slate-950 text-[11px] uppercase tracking-wider text-slate-500 font-mono">
              Or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:bg-slate-950 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition-all shadow-inner"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Password
                </label>
                <Link
                  href="/login?mode=forgot"
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 focus:bg-slate-950 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none transition-all shadow-inner font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-slate-400">Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-[#002B7F] to-blue-600 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-xs transition-all shadow-lg shadow-blue-900/40 hover:shadow-cyan-900/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Demo Pill */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setEmail("member@aura.skin");
                setPassword("AuraGlow2026!");
              }}
              className="text-[11px] text-slate-500 hover:text-slate-300 font-mono underline cursor-pointer"
            >
              Autofill test credentials (member@aura.skin)
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center lg:text-left text-[11px] text-slate-500 mt-8 pt-4 border-t border-slate-900">
          By signing in, you agree to AURA&apos;s{" "}
          <Link href="/terms" className="text-slate-400 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-slate-400 hover:underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
