"use client";

import { useState } from "react";
import { Search, CheckCircle2, XCircle, ArrowRight, Sparkles, Loader2, ShoppingCart } from "lucide-react";

interface TldOption {
  tld: string;
  price: string;
  originalPrice: string;
  popular?: boolean;
}

const TLDS: TldOption[] = [
  { tld: ".com", price: "$8.99", originalPrice: "$15.99", popular: true },
  { tld: ".online", price: "$0.99", originalPrice: "$34.99" },
  { tld: ".io", price: "$29.99", originalPrice: "$49.99", popular: true },
  { tld: ".tech", price: "$1.99", originalPrice: "$24.99" },
  { tld: ".store", price: "$1.49", originalPrice: "$29.99" },
  { tld: ".net", price: "$11.99", originalPrice: "$16.99" },
];

export function DomainChecker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [cartItem, setCartItem] = useState<string | null>(null);

  const cleanDomain = searchTerm.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");
  const baseName = cleanDomain.split(".")[0] || "myawesomeidea";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    setHasSearched(false);

    setTimeout(() => {
      setIsSearching(false);
      setHasSearched(true);
    }, 600);
  };

  return (
    <div id="domains" className="w-full max-w-4xl mx-auto py-8">
      <div className="text-center mb-6">
        <span className="text-xs uppercase tracking-widest text-[#00cec9] font-mono font-bold flex items-center justify-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          High-Speed Domain Registrar API
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Find Your Perfect Domain Name
        </h2>
        <p className="text-zinc-400 text-sm mt-1 max-w-lg mx-auto">
          Every Cloud & Web hosting plan includes a free domain for 1 year with automated DNS and SSL.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-zinc-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type your brand or domain (e.g. mynewbrand.com)..."
            className="w-full pl-12 pr-32 py-4 rounded-2xl bg-[#131422] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#6c5ce7] focus:ring-2 focus:ring-[#6c5ce7]/30 transition-all text-sm sm:text-base shadow-xl"
          />
          <button
            type="submit"
            disabled={isSearching || !searchTerm.trim()}
            className="absolute right-2 px-5 py-2.5 rounded-xl bg-[#6c5ce7] hover:bg-[#5844e3] disabled:opacity-50 text-white text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shadow-md shadow-[#6c5ce7]/30"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <span>Search</span>
                <ArrowRight className="w-4 h-4 hidden sm:inline" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* TLD Quick Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 text-xs">
        {TLDS.map((item) => (
          <button
            key={item.tld}
            onClick={() => {
              setSearchTerm(`mybrand${item.tld}`);
              setIsSearching(true);
              setTimeout(() => {
                setIsSearching(false);
                setHasSearched(true);
              }, 400);
            }}
            className="px-3 py-1.5 rounded-lg bg-[#131422] border border-white/[0.08] hover:border-[#6c5ce7]/50 text-zinc-300 hover:text-white transition-all flex items-center gap-1.5"
          >
            <span className="font-bold text-white">{item.tld}</span>
            <span className="text-emerald-400 font-semibold">{item.price}</span>
            <span className="line-through text-zinc-500 text-[10px]">{item.originalPrice}</span>
          </button>
        ))}
      </div>

      {/* Results Box */}
      {hasSearched && (
        <div className="mt-6 bg-[#131422] border border-white/10 rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">
                    {baseName}.com
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                    Available
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Includes free WHOIS Privacy protection + Auto DNS config
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              <div className="text-right">
                <div className="text-xl font-black text-emerald-400">$8.99<span className="text-xs text-zinc-400 font-normal">/yr</span></div>
                <div className="text-[11px] text-zinc-500 line-through">$15.99/yr</div>
              </div>
              <button
                onClick={() => setCartItem(`${baseName}.com`)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                  cartItem === `${baseName}.com`
                    ? "bg-emerald-600 text-white"
                    : "bg-[#6c5ce7] hover:bg-[#5844e3] text-white shadow-lg shadow-[#6c5ce7]/30"
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {cartItem === `${baseName}.com` ? "Added to Cart" : "Claim Domain"}
              </button>
            </div>
          </div>

          {/* Alternative Suggestions */}
          <div className="mt-4 pt-1">
            <p className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
              Popular Variations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { domain: `${baseName}.io`, price: "$29.99/yr", available: true },
                { domain: `${baseName}.tech`, price: "$1.99/yr", available: true },
                { domain: `${baseName}.store`, price: "$1.49/yr", available: true },
                { domain: `${baseName}.online`, price: "$0.99/yr", available: true },
              ].map((alt) => (
                <div
                  key={alt.domain}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors"
                >
                  <span className="text-sm font-medium text-zinc-200">
                    {alt.domain}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400">{alt.price}</span>
                    <button
                      onClick={() => setCartItem(alt.domain)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 hover:bg-[#6c5ce7] text-zinc-300 hover:text-white transition-colors"
                    >
                      {cartItem === alt.domain ? "Added" : "Select"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
