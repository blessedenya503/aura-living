"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, ShieldCheck, Loader2, LogOut, CheckCircle2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient, GOOGLE_AUTH_ENABLED } from "@/lib/auth-client";

interface SignInPageProps {
  className?: string;
  onSuccess?: () => void;
}

export function SignInPage({ className, onSuccess }: SignInPageProps) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [mode, setMode] = React.useState<"signin" | "signup" | "forgot">("signin");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [infoMsg, setInfoMsg] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!email.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    if (mode === "forgot") {
      setIsLoading(true);
      try {
        const res = await authClient.$fetch("/forget-password", {
          method: "POST",
          body: {
            email: email.trim(),
            redirectTo: "/login",
          },
        });
        if (res?.error) {
          setErrorMsg(res.error.message || "Could not send password reset email.");
        } else {
          setInfoMsg("If an account exists for that email, a password reset link has been sent to your inbox.");
        }
      } catch (err: any) {
        setErrorMsg(err?.message || "Failed to send password reset email.");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!password || password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "signup") {
        const displayName = name.trim() || email.split("@")[0];
        const { data, error } = await authClient.signUp.email({
          email: email.trim(),
          password,
          name: displayName,
          callbackURL: "/",
        });

        if (error) {
          setErrorMsg(error.message || "Could not create account. Please try again.");
          return;
        }

        if (data?.user) {
          setInfoMsg(
            `Verification link sent to ${email.trim()}! Please check your inbox (and spam folder) to verify your email and unlock your VIP 20% welcome discount.`
          );
          setPassword("");
        }
      } else {
        const { data, error } = await authClient.signIn.email({
          email: email.trim(),
          password,
          rememberMe,
          callbackURL: "/",
        });

        if (error) {
          if (
            error.status === 403 ||
            (error.message && error.message.toLowerCase().includes("verif"))
          ) {
            setErrorMsg(
              "Please verify your email address first. A fresh verification link has been sent to your inbox."
            );
          } else {
            setErrorMsg(error.message || "Invalid email or password.");
          }
          return;
        }

        if (data?.user) {
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "aura_customer_user",
              JSON.stringify({
                email: data.user.email,
                name: data.user.name,
                provider: "email",
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
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setInfoMsg(null);
    setGoogleLoading(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
      if (error) {
        setErrorMsg(error.message || "Google sign-in failed.");
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Google sign-in failed.");
      setGoogleLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await authClient.signOut();
      if (typeof window !== "undefined") {
        localStorage.removeItem("aura_customer_user");
      }
    } finally {
      setIsLoading(false);
    }
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
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex flex-col items-center group">
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
              Clinical &amp; Barrier Care
            </span>
          </Link>

          {session?.user ? (
            <div className="mt-5">
              <h1 className="text-lg font-medium text-slate-100">Signed in as {session.user.name || session.user.email}</h1>
              <p className="text-xs text-slate-400 mt-1">{session.user.email}</p>
            </div>
          ) : (
            <>
              <h1 className="text-lg font-medium text-slate-100 mt-5">
                {mode === "signin"
                  ? "Welcome back"
                  : mode === "signup"
                  ? "Create your account"
                  : "Reset your password"}
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {mode === "signin"
                  ? "Sign in to track orders, access refills, and save your routine"
                  : mode === "signup"
                  ? "Register with your email to receive your VIP 20% welcome reward"
                  : "Enter your email and we will send you a password recovery link"}
              </p>
            </>
          )}
        </div>

        {/* Active Session View */}
        {!isPending && session?.user ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <div className="font-semibold text-white">Your AURA account is active</div>
                <div className="text-slate-300 mt-0.5">
                  Use code <span className="font-mono font-bold text-amber-300">AURA20</span> at checkout for 20% off.
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/"
                className="w-full h-11 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/track-order"
                className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs transition-all flex items-center justify-center"
              >
                Track an Order
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={isLoading}
                className="w-full h-10 rounded-xl bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs (Sign In / Create Account) */}
            {mode !== "forgot" && (
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-5 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg(null);
                    setInfoMsg(null);
                  }}
                  className={cn(
                    "py-2 rounded-lg transition-all cursor-pointer",
                    mode === "signin"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrorMsg(null);
                    setInfoMsg(null);
                  }}
                  className={cn(
                    "py-2 rounded-lg transition-all cursor-pointer",
                    mode === "signup"
                      ? "bg-slate-800 text-white shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Google OAuth Button (Only rendered when Google OAuth credentials are configured) */}
            {GOOGLE_AUTH_ENABLED && mode !== "forgot" && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || isLoading}
                  className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl bg-slate-800/80 border border-slate-700/70 hover:border-slate-600 hover:bg-slate-800 text-slate-100 text-xs font-medium transition-all duration-200 disabled:opacity-50 cursor-pointer mb-5"
                >
                  {googleLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  <span>Continue with Google</span>
                </button>

                <div className="relative flex items-center justify-center my-5">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] font-medium text-slate-500 uppercase tracking-widest absolute">
                    or with email
                  </span>
                </div>
              </>
            )}

            {/* Error or Info Notification */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs text-center">
                {errorMsg}
              </div>
            )}

            {infoMsg && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs text-center flex items-center justify-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{infoMsg}</span>
              </div>
            )}

            {/* Email & Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="name">
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    className="w-full h-11 px-4 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 transition-all"
                  />
                </div>
              )}

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

              {mode !== "forgot" && (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300" htmlFor="password">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode("forgot");
                          setErrorMsg(null);
                          setInfoMsg(null);
                        }}
                        className="text-[11px] text-amber-300/80 hover:text-amber-200 transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 8 characters"
                      minLength={8}
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
              )}

              {mode === "signin" && (
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
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || googleLoading}
                className="w-full h-11 mt-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-semibold text-sm transition-all duration-200 shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {mode === "signup"
                        ? "Creating account..."
                        : mode === "forgot"
                        ? "Sending reset link..."
                        : "Signing in..."}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === "signup"
                        ? "Create Account"
                        : mode === "forgot"
                        ? "Send Reset Link"
                        : "Sign in to AURA"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {mode === "forgot" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setErrorMsg(null);
                    setInfoMsg(null);
                  }}
                  className="w-full text-center text-xs text-slate-400 hover:text-white pt-1 cursor-pointer"
                >
                  ← Back to Sign In
                </button>
              )}
            </form>
          </>
        )}

        {/* Security & Verification Badge */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0" />
          <span>Encrypted 256-bit authentication &amp; clinical privacy</span>
        </div>
      </div>
    </div>
  );
}
