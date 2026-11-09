import { Navbar } from "@/components/Navbar";
import { DomainChecker } from "@/components/DomainChecker";
import { PricingSection } from "@/components/PricingSection";
import { ComparisonSection } from "@/components/ComparisonSection";
import { DatacenterMap } from "@/components/DatacenterMap";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import {
  Zap,
  ShieldCheck,
  Server,
  Cpu,
  ArrowRight,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Terminal,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0b0c14] text-[#f1f2f8] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-20 overflow-hidden">
          {/* Background Ambient Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#6c5ce7]/25 to-[#00cec9]/15 blur-[120px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              {/* Trust Badge with "by antigravity" */}
              <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-zinc-300 mb-6 backdrop-blur-md shadow-xl">
                <div className="flex items-center text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                </div>
                <span className="font-semibold text-white">4.8 / 5 Rating</span>
                <span className="text-zinc-600">•</span>
                <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Global Edge Network (38 Nodes)
                </span>
                <span className="text-zinc-600">•</span>
                <span className="text-[#a29bfe] font-bold font-mono">
                  by antigravity
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
                Everything You Need to <br />
                <span className="gradient-text">Create, Host & Scale</span> Your Website
              </h1>

              <p className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Blazing-fast NVMe storage, OpenLiteSpeed caching, and our signature{" "}
                <span className="text-[#a29bfe] font-semibold">NovaPanel</span>. Get up to 75% off with a free domain and 24/7 expert support.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                <Link
                  href="#plans"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#6c5ce7] hover:bg-[#5844e3] text-white font-bold text-base shadow-xl shadow-[#6c5ce7]/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Claim Hosting Deal ($2.49/mo)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/panel"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-[#131422] hover:bg-[#1a1b2e] border border-white/10 hover:border-[#6c5ce7]/40 text-white font-bold text-base transition-all flex items-center justify-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-[#00cec9]" />
                  <span>Explore NovaPanel Demo</span>
                </Link>
              </div>

              {/* Guarantees Strip */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Free Domain Included</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Free 1-Click SSL Certificates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#a29bfe]" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
              </div>
            </div>

            {/* DOMAIN SEARCH SECTION */}
            <div className="mt-12">
              <DomainChecker />
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <PricingSection />

        {/* PERFORMANCE & FEATURE HIGHLIGHTS */}
        <section className="py-16 bg-[#0e0f1a] border-y border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs uppercase tracking-widest text-[#6c5ce7] font-mono font-bold">
                Engineered for High Concurrency
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight mt-1">
                Next-Generation Hosting Technology
              </h2>
              <p className="text-zinc-400 text-sm mt-2">
                Say goodbye to overloaded servers, sluggish page loads, and confusing control panels.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="p-6 rounded-3xl bg-[#131422] border border-white/[0.08] hover:border-[#6c5ce7]/40 transition-all glow-card">
                <div className="w-12 h-12 rounded-2xl bg-[#6c5ce7]/10 border border-[#6c5ce7]/20 flex items-center justify-center text-[#a29bfe] mb-5">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  LiteSpeed Web Server + LSCache
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Consistently delivers TTFB under 80ms. Built-in WordPress and dynamic content caching handles sudden viral traffic spikes effortlessly.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-6 rounded-3xl bg-[#131422] border border-white/[0.08] hover:border-[#00cec9]/40 transition-all glow-card">
                <div className="w-12 h-12 rounded-2xl bg-[#00cec9]/10 border border-[#00cec9]/20 flex items-center justify-center text-[#00cec9] mb-5">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Proprietary NovaPanel (hPanel)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  A custom control panel designed for modern humans. Manage domains, files, MySQL/Postgres databases, and DNS zones in seconds.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-6 rounded-3xl bg-[#131422] border border-white/[0.08] hover:border-emerald-500/40 transition-all glow-card">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Enterprise DDoS & Auto SSL
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Automatic Let&apos;s Encrypt wildcard certificates renewed without downtime. Multi-layer WAF mitigation blocks malicious bots.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON BENCHMARK */}
        <ComparisonSection />

        {/* GLOBAL DATACENTER NETWORK */}
        <DatacenterMap />

        {/* BOTTOM CTA STRIP */}
        <section className="py-20 relative overflow-hidden bg-gradient-to-b from-[#0b0c14] to-[#121124]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-bold">
              Ready to Upgrade?
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-2 mb-4">
              Join Thousands of Creators and Businesses on NovaHost
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
              Migrate your existing website in under 5 minutes with our automated migration assistant, or launch a brand new site right now.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="#plans"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#6c5ce7] hover:bg-[#5844e3] text-white font-bold text-base shadow-xl shadow-[#6c5ce7]/30 transition-all"
              >
                Get Started for $2.49/mo
              </Link>
              <Link
                href="/panel"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-base border border-white/10 transition-all"
              >
                Launch NovaPanel Control Center
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
