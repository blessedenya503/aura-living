import Link from "next/link";
import { Server, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";

export function Footer() {
  return (
    <footer className="bg-[#08090f] border-t border-white/[0.08] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="col-span-2">
            <div className="mb-4">
              <BrandLogo />
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-sm mb-4">
              Next-generation cloud and web hosting infrastructure. Engineered for unmatched speeds, automated deployments, and maximum uptime reliability.
            </p>
            <div className="flex items-center gap-2 text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PCI-DSS Certified • SOC 2 Type II Compliant</span>
            </div>
          </div>

          {/* Hosting Links */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Hosting
            </h4>
            <ul className="space-y-2">
              <li><Link href="#plans" className="hover:text-white transition-colors">Web Hosting</Link></li>
              <li><Link href="#plans" className="hover:text-white transition-colors">Cloud Premium</Link></li>
              <li><Link href="#plans" className="hover:text-white transition-colors">WordPress Hosting</Link></li>
              <li><Link href="#plans" className="hover:text-white transition-colors">Cloud KVM VPS</Link></li>
              <li><Link href="#plans" className="hover:text-white transition-colors">Agency Reseller</Link></li>
            </ul>
          </div>

          {/* Domain & Network */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Domains & Tools
            </h4>
            <ul className="space-y-2">
              <li><Link href="#domains" className="hover:text-white transition-colors">Domain Search</Link></li>
              <li><Link href="#domains" className="hover:text-white transition-colors">Domain Transfer</Link></li>
              <li><Link href="#domains" className="hover:text-white transition-colors">Free WHOIS Privacy</Link></li>
              <li><Link href="#comparison" className="hover:text-white transition-colors">Speed Benchmark</Link></li>
              <li><Link href="/panel" className="text-[#a29bfe] font-semibold hover:text-white transition-colors">NovaPanel Demo</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              Company & Help
            </h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:text-white transition-colors">About NovaHost</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">24/7 Live Support</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Server Status (99.99%)</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Knowledge Base</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-400">
          <div>
            © {new Date().getFullYear()} NovaHost Technologies Inc. All rights reserved. Inspired by Hostinger & modern cloud architecture.
          </div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for speed and modern builders</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
