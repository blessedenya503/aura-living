"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, CheckCircle2, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SocialProvider = "google" | "x" | "facebook" | "instagram";

interface SignInPageProps {
  className?: string;
  onSuccess?: () => void;
}

export function SignInPage({ className, onSuccess }: SignInPageProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState<SocialProvider | null>(null);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const userObj = {
        email,
        name: email.split("@")[0],
        provider: "email",
        isLoggedIn: true,
        loggedInAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("aura_customer_user", JSON.stringify(userObj));
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    }, 700);
  };

  const handleSocialLogin = (provider: SocialProvider) => {
    setErrorMsg(null);
    setSocialLoading(provider);

    setTimeout(() => {
      setSocialLoading(null);
      const providerNames: Record<SocialProvider, string> = {
        google: "Google User",
        x: "X Member",
        facebook: "Facebook User",
        instagram: "Instagram Member",
      };

      const userObj = {
        email: `${provider}.user@aura-client.com`,
        name: providerNames[provider],
        provider,
        isLoggedIn: true,
        loggedInAt: new Date().toISOString(),
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("aura_customer_user", JSON.stringify(userObj));
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/");
      }
    }, 850);
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950 text-white relative overflow-hidden selection:bg-amber-500/30 selection:text-amber-200",
        className
      )}
    >
      {/* Sleek Atmospheric Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-24 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Glassmorphism Card */}
      <div className="w-full max-w-[440px] relative z-10 bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-black/60">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center group">
            {/* Glowing AURA AU Monogram */}
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-slate-800 to-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg shadow-amber-500/10 mb-3 group-hover:border-amber-400/50 transition-all duration-300">
              <span className="font-serif text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-400">
                AU
              </span>
              <div className="absolute -inset-1 rounded-2xl bg-amber-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <span className="font-serif text-2xl font-light tracking-[0.28em] text-white uppercase group-hover:text-amber-100 transition-colors">
              AURA
            </span>
            <span className="text-[10px] tracking-[0.25em] text-amber-300/70 uppercase font-medium mt-0.5">
              Clinical & Barrier Care
            </span>
          </Link>

          <h1 className="text-lg font-medium text-slate-100 mt-5">Welcome back</h1>
          <p className="text-xs text-slate-400 mt-1">Sign in to track orders, access refills, and save your routine</p>
        </div>

        {/* Social Sign-In Providers: Google, X, Facebook, Instagram */}
        <div className="grid grid-cols-4 gap-2.5 mb-6">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={Boolean(socialLoading) || isLoading}
            aria-label="Sign in with Google"
            className="flex items-center justify-center h-12 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 hover:bg-slate-800 text-slate-200 hover:text-white transition-all duration-200 group relative disabled:opacity-50"
            title="Google"
          >
            {socialLoading === "google" ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.7c-.2-.7-.4-1.6-.4-2.7s.1-1.9.4-2.7L1.9 6.4C.7 8.8 0 10.8 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.8 7.5 23 12 23z"
                />
              </svg>
            )}
          </button>

          {/* X (formerly Twitter) */}
          <button
            type="button"
            onClick={() => handleSocialLogin("x")}
            disabled={Boolean(socialLoading) || isLoading}
            aria-label="Sign in with X"
            className="flex items-center justify-center h-12 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 hover:bg-slate-800 text-slate-200 hover:text-white transition-all duration-200 group relative disabled:opacity-50"
            title="X (Twitter)"
          >
            {socialLoading === "x" ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            )}
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={() => handleSocialLogin("facebook")}
            disabled={Boolean(socialLoading) || isLoading}
            aria-label="Sign in with Facebook"
            className="flex items-center justify-center h-12 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 hover:bg-slate-800 text-slate-200 hover:text-white transition-all duration-200 group relative disabled:opacity-50"
            title="Facebook"
          >
            {socialLoading === "facebook" ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <svg className="w-4 h-4 fill-[#1877F2] transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            )}
          </button>

          {/* Instagram */}
          <button
            type="button"
            onClick={() => handleSocialLogin("instagram")}
            disabled={Boolean(socialLoading) || isLoading}
            aria-label="Sign in with Instagram"
            className="flex items-center justify-center h-12 rounded-xl bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 hover:bg-slate-800 text-slate-200 hover:text-white transition-all duration-200 group relative disabled:opacity-50"
            title="Instagram"
          >
            {socialLoading === "instagram" ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <radialGradient id="ig-grad" r="150%" cx="30%" cy="107%">
                  <stop offset="0" stopColor="#fdf497" />
                  <stop offset="0.05" stopColor="#fdf497" />
                  <stop offset="0.45" stopColor="#fd5949" />
                  <stop offset="0.6" stopColor="#d6249f" />
                  <stop offset="0.9" stopColor="#285AEB" />
                </radialGradient>
                <path
                  fill="url(#ig-grad)"
                  d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-6">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-widest absolute">
            or with email
          </span>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              className="w-full h-11 px-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 transition-all"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-slate-300" htmlFor="password">
                Password
              </label>
              <a
                href="#forgot"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password recovery link sent if email is registered.");
                }}
                className="text-[11px] text-amber-300/80 hover:text-amber-200 transition-colors"
              >
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full h-11 pl-4 pr-11 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-400/20 focus:ring-offset-0 transition-colors"
              />
              <span className="text-xs text-slate-400">Keep me signed in</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || Boolean(socialLoading)}
            className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in to AURA</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security & Verification Badge */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
          <span>Encrypted 256-bit authentication & clinical privacy</span>
        </div>
      </div>
    </div>
  );
}
