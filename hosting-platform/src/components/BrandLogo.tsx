"use client";

import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

export function BrandLogo({ size = "md", href = "/", className = "" }: BrandLogoProps) {
  return (
    <Link href={href} className={`flex items-center gap-3 group ${className}`}>
      {/* Antigravity Quantum Levitation Emblem */}
      <div className="relative">
        {/* Ambient Ring Glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#6c5ce7] via-[#a29bfe] to-[#00cec9] opacity-40 blur-md group-hover:opacity-80 transition-opacity duration-500" />

        <div className="relative w-10 h-10 rounded-2xl bg-[#0d0e1b] border border-white/15 p-1 flex items-center justify-center shadow-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
          {/* Internal orbital background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#6c5ce7]/20 via-transparent to-[#00cec9]/15" />

          {/* Antigravity SVG Mark: Levitating Delta Core & Orbit Ring */}
          <svg
            className="w-6 h-6 text-white relative z-10 drop-shadow-[0_0_8px_rgba(108,92,231,0.8)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Outer Zero-G Orbit Ellipse */}
            <ellipse
              cx="12"
              cy="12"
              rx="9"
              ry="4.5"
              className="text-[#00cec9] opacity-70 group-hover:rotate-45 transition-transform duration-700"
              strokeDasharray="2 2"
            />
            {/* Levitating Geometric Antigravity Delta */}
            <path
              d="M12 4.5L18 16H6L12 4.5Z"
              className="fill-[#6c5ce7]/30 stroke-[#a29bfe]"
            />
            {/* Levitating Quantum Core */}
            <circle
              cx="12"
              cy="12.5"
              r="2"
              className="fill-[#00cec9] stroke-white animate-pulse"
            />
          </svg>
        </div>
      </div>

      {/* Brand Typography & "by antigravity" Tribute */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-xl font-black tracking-tight text-white">
            NOVA<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a29bfe] via-[#6c5ce7] to-[#00cec9]">HOST</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-extrabold tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-gradient-to-r from-[#6c5ce7]/20 to-[#00cec9]/20 text-[#a29bfe] border border-white/10">
            PRO
          </span>
        </div>

        {/* The User's Requested "by antigravity" Tribute */}
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[10px] tracking-wider font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors">
            by
          </span>
          <div className="flex items-center gap-1 px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/[0.08] group-hover:border-[#00cec9]/40 transition-colors">
            {/* Miniature Antigravity Spark Icon */}
            <svg
              className="w-2.5 h-2.5 text-[#00cec9] animate-spin-slow"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
            <span className="text-[9.5px] font-black tracking-wider uppercase bg-gradient-to-r from-[#a29bfe] to-[#00cec9] bg-clip-text text-transparent">
              antigravity
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
