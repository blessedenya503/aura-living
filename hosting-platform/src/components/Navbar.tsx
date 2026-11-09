"use client";

import Link from "next/link";
import { Server, Globe, Cpu, Shield, ArrowRight, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[#0b0c14]/80 border-b border-white/[0.08]">
      {/* Top flash promo strip */}
      <div className="bg-gradient-to-r from-[#6c5ce7] via-[#5844e3] to-[#00cec9] text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
        <span>CYBER SALE: Up to 75% off Web & Cloud Hosting + Free Domain & Free SSL</span>
        <span className="hidden sm:inline bg-black/20 px-2 py-0.5 rounded text-[10px] tracking-wide uppercase font-mono">
          Code: NOVA2026
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with "by antigravity" */}
          <BrandLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="#plans"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Web Hosting
            </Link>
            <Link
              href="#domains"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Globe className="w-4 h-4 text-[#00cec9]" />
              Domains
            </Link>
            <Link
              href="#vps"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Cpu className="w-4 h-4 text-[#a29bfe]" />
              Cloud VPS
            </Link>
            <Link
              href="#comparison"
              className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
            >
              <Shield className="w-4 h-4 text-emerald-400" />
              Technology
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/panel"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-300 hover:text-white border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/panel"
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#6c5ce7] hover:bg-[#5844e3] text-white shadow-md shadow-[#6c5ce7]/30 transition-all flex items-center gap-1.5 hover:translate-y-[-1px]"
            >
              <span>NovaPanel (hPanel)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0e0f1a] px-4 pt-3 pb-6 space-y-3">
          <Link
            href="#plans"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-white/5"
          >
            Web Hosting Plans
          </Link>
          <Link
            href="#domains"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-white/5"
          >
            Domain Search
          </Link>
          <Link
            href="#vps"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-white/5"
          >
            Cloud VPS
          </Link>
          <Link
            href="#comparison"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-300 hover:bg-white/5"
          >
            Benchmarks vs cPanel
          </Link>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/panel"
              className="w-full text-center py-2.5 rounded-lg text-sm font-bold bg-[#6c5ce7] text-white"
            >
              Open NovaPanel Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
