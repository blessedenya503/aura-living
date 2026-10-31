export interface TikTokViralTrend {
  id: string;
  brand: string;
  name: string;
  views: string;
  viralTag: string;
  trendHook: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroImage: string;
  fallbackPrice: number;
  size: string;
  rating: number;
  reviewCount: number;
  ingredients: string[];
}

// Weekly rotating catalog pools of viral TikTok skincare formulas
export const WEEKLY_TIKTOK_POOLS: TikTokViralTrend[][] = [
  // Week 1: Korean Glass Skin & Barrier Essentials
  [
    {
      id: "prod-cosrx-28",
      brand: "COSRX",
      name: "COSRX Advanced Snail 96 Mucin Power Essence",
      views: "4.8B Views",
      viralTag: "#TikTokMadeMeBuyIt • Viral Glass Skin",
      trendHook: "The #1 Most Viral Skincare Product on TikTok Globally",
      heroHeadline: "Glass Skin Dew.",
      heroHighlight: "4.8 Billion TikTok Sensation.",
      heroSubtitle:
        "Formulated with 96.3% Snail Secretion Filtrate to repair damaged moisture barriers, fade post-acne marks, and deliver intense luminous hydration.",
      heroImage: "https://m.media-amazon.com/images/I/61p-wtpDraL._AC_SL1500_.jpg",
      fallbackPrice: 19.99,
      size: "100ml / 3.38 fl. oz",
      rating: 4.9,
      reviewCount: 48920,
      ingredients: ["96.3% Snail Secretion Filtrate", "Sodium Hyaluronate", "Allantoin", "Panthenol"],
    },
    {
      id: "prod-nivea-1",
      brand: "NIVEA",
      name: "NIVEA Creme Classic Intensive Hydration Tin",
      views: "1.5B Views",
      viralTag: "Viral #LaMerDupe Trend",
      trendHook: "Dermatologists & Beauty Creators Swear By It",
      heroHeadline: "The $8 Miracle Cream.",
      heroHighlight: "TikTok's Famous Crème Dupe.",
      heroSubtitle:
        "Skin-identical Eucerit® and Provitamin B5 deliver rich 48H continuous occlusive slugging that rivals $350 luxury moisturizers.",
      heroImage: "https://images.openbeautyfacts.org/images/products/400/580/889/0590/front_en.18.400.jpg",
      fallbackPrice: 8.99,
      size: "250ml / 8.4 oz Classic Tin",
      rating: 4.9,
      reviewCount: 38200,
      ingredients: ["Eucerit®", "Panthenol (B5)", "Glycerin", "Lanolin Alcohol"],
    },
    {
      id: "prod-beautyofjoseon-30",
      brand: "Beauty of Joseon",
      name: "Beauty of Joseon Relief Sun: Rice + Probiotics SPF 50+",
      views: "1.9B Views",
      viralTag: "TikTok #1 Holy Grail Sunscreen",
      trendHook: "Zero White Cast • Serum Texture",
      heroHeadline: "No White Cast.",
      heroHighlight: "TikTok's Holy Grail Sunscreen.",
      heroSubtitle:
        "Infused with 30% Rice Extract and fermented grain probiotics. Feels like a lightweight moisturizing cream without greasiness.",
      heroImage: "https://images.openbeautyfacts.org/images/products/880/996/813/0277/front_nl.21.400.jpg",
      fallbackPrice: 18.0,
      size: "50ml Tube",
      rating: 4.9,
      reviewCount: 31400,
      ingredients: ["30% Rice Extract", "Grain Fermented Probiotics", "Niacinamide", "Vitamin E"],
    },
    {
      id: "prod-anua-32",
      brand: "Anua",
      name: "Anua Heartleaf 77% Soothing Toner Balance & Calm",
      views: "2.4B Views",
      viralTag: "TikTok Viral #GlassSkin Toner",
      trendHook: "Korea's Olive Young #1 Viral Award Winner",
      heroHeadline: "Calm Redness.",
      heroHighlight: "77% Pure Heartleaf Extract.",
      heroSubtitle:
        "Soothes sensitive, breakout-prone skin while restoring optimal pH balance. The secret behind the viral TikTok 7-Skin Method.",
      heroImage: "https://images.openbeautyfacts.org/images/products/880/964/073/6025/front_nl.3.400.jpg",
      fallbackPrice: 22.0,
      size: "250ml Bottle",
      rating: 4.8,
      reviewCount: 24500,
      ingredients: ["77% Houttuynia Cordata Extract", "Centella Asiatica", "Chamomilla Flower", "Panthenol"],
    },
    {
      id: "prod-larocheposay-22",
      brand: "La Roche-Posay",
      name: "La Roche-Posay Cicaplast Baume B5+ Ultra-Repairing Balm",
      views: "3.2B Views",
      viralTag: "TikTok #SkinCycling & Slugging",
      trendHook: "Emergency Barrier Recovery in 1 Night",
      heroHeadline: "Overnight Repair.",
      heroHighlight: "TikTok Slugging Essential.",
      heroSubtitle:
        "Madecassoside, 5% Panthenol, and Tribioma prebiotics instantly rebuild damaged barriers from over-exfoliation and retinoid irritation.",
      heroImage: "https://images.openbeautyfacts.org/images/products/333/787/581/6847/front_fr.12.400.jpg",
      fallbackPrice: 22.99,
      size: "100ml Large Tube",
      rating: 4.9,
      reviewCount: 42100,
      ingredients: ["5% Panthenol (B5)", "Madecassoside", "Tribioma Prebiotics", "Shea Butter"],
    },
  ],
  // Week 2: High-Performance Glow & Peptide Radiance
  [
    {
      id: "imp-glow-recipe-dew-drops",
      brand: "Glow Recipe",
      name: "Glow Recipe Watermelon Glow Niacinamide Dew Drops",
      views: "3.6B Views",
      viralTag: "#DewDrops • TikTok Highlighting Serum",
      trendHook: "The Original Viral Glass Skin Primer",
      heroHeadline: "Instant Dew.",
      heroHighlight: "TikTok's Cult Dew Drops.",
      heroSubtitle:
        "Multi-use highlighting serum with Niacinamide and Hyaluronic Acid that delivers an effortless dewy glow without mica, glitter, or grey cast.",
      heroImage: "https://m.media-amazon.com/images/I/51h-PS9qIIL._AC_UL320_.jpg",
      fallbackPrice: 35.0,
      size: "40ml / 1.35 oz",
      rating: 4.8,
      reviewCount: 22800,
      ingredients: ["Niacinamide (Vitamin B3)", "Watermelon Extract", "Hyaluronic Acid", "Moringa Seed Oil"],
    },
    {
      id: "prod-theordinary-162",
      brand: "The Ordinary",
      name: "The Ordinary Niacinamide 10% + Zinc 1% Oil-Free Serum",
      views: "4.1B Views",
      viralTag: "#PoreMinimizer • TikTok Staple",
      trendHook: "The Most Recommended Blemish Serum",
      heroHeadline: "Clear Pores.",
      heroHighlight: "High-Strength Niacinamide.",
      heroSubtitle:
        "High-potency 10% niacinamide and 1% zinc PCA visibly balance excess sebum activity and refine enlarged pore appearance.",
      heroImage: "https://images.openbeautyfacts.org/images/products/076/991/519/0425/front_en.16.400.jpg",
      fallbackPrice: 10.8,
      size: "60ml Value Size",
      rating: 4.8,
      reviewCount: 54300,
      ingredients: ["10% Niacinamide", "1% Zinc PCA", "Tamarindus Indica Seed Gum", "Ethoxydiglycol"],
    },
    {
      id: "prod-torriden-35",
      brand: "Torriden",
      name: "Torriden DIVE-IN Low Molecule Hyaluronic Acid Soothing Cream",
      views: "1.7B Views",
      viralTag: "TikTok #InnerHydration Favorite",
      trendHook: "5D Hyaluronic Acid Micro-Penetration",
      heroHeadline: "5D Hydration.",
      heroHighlight: "TikTok Deep Water Burst.",
      heroSubtitle:
        "Features 5 molecular weights of hyaluronic acid that drench dehydrated stratum corneum layers with bouncy non-sticky moisture.",
      heroImage: "https://images.openbeautyfacts.org/images/products/880/964/073/6025/front_nl.3.400.jpg",
      fallbackPrice: 21.0,
      size: "80ml Tub",
      rating: 4.9,
      reviewCount: 19800,
      ingredients: ["5D Complex Hyaluronic Acid", "D-Panthenol", "Allantoin", "Malachite Extract"],
    },
    {
      id: "prod-roundlab-34",
      brand: "Round Lab",
      name: "Round Lab 1025 Dokdo Cream Deep Mineral Barrier",
      views: "1.4B Views",
      viralTag: "TikTok #KoreanAwardWinner",
      trendHook: "Ulleungdo Island Deep Sea Minerals",
      heroHeadline: "Mineral Barrier.",
      heroHighlight: "Round Lab Holy Grail.",
      heroSubtitle:
        "Enriched with 72 types of deep sea minerals and 5 essential ceramides to repair sensitised barriers within 24 hours.",
      heroImage: "https://images.openbeautyfacts.org/images/products/880/964/073/6025/front_nl.3.400.jpg",
      fallbackPrice: 24.0,
      size: "80ml Jar",
      rating: 4.8,
      reviewCount: 16700,
      ingredients: ["Deep Sea Minerals", "5 Ceramide Complex", "Hyaluronic Acid", "Shea Butter"],
    },
    {
      id: "imp-glow-recipe-plum-plump",
      brand: "Glow Recipe",
      name: "Glow Recipe Plum Plump Hyaluronic Cream",
      views: "2.1B Views",
      viralTag: "#PlumPlump • Weightless Dew",
      trendHook: "5 Molecular Weights of Hyaluronic Acid",
      heroHeadline: "Cellular Plump.",
      heroHighlight: "Kakadu Plum Whipped Gel.",
      heroSubtitle:
        "Whipped gel-cream infused with juicy Kakadu Plum and polyglutamic acid for lightweight all-day hydration without heaviness.",
      heroImage: "https://m.media-amazon.com/images/I/61WZN4-TPBL._AC_UL320_.jpg",
      fallbackPrice: 40.0,
      size: "50ml Refillable Jar",
      rating: 4.8,
      reviewCount: 13900,
      ingredients: ["Kakadu Plum Extract", "Polyglutamic Acid", "5 Molecular HA", "Willowherb"],
    },
  ],
  // Week 3: Dermal Repair & Dermatologist Slugging Champions
  [
    {
      id: "prod-bioderma-102",
      brand: "Bioderma",
      name: "Bioderma Atoderm Intensive Baume Ultra-Soothing Emollient",
      views: "1.8B Views",
      viralTag: "#DermApproved • Eczema & Slugging",
      trendHook: "Reconstructs Cutaneous Lipid Matrix",
      heroHeadline: "Clinical Barrier.",
      heroHighlight: "Dermatologist Atoderm Baume.",
      heroSubtitle:
        "Medical-grade Skin Barrier Therapy™ biologically restructures lipid integrity and blocks bacterial adhesion for sensitized skin.",
      heroImage: "https://images.openbeautyfacts.org/images/products/340/139/937/2784/front_en.11.400.jpg",
      fallbackPrice: 24.99,
      size: "500ml Family Pump",
      rating: 4.9,
      reviewCount: 29800,
      ingredients: ["Skin Barrier Therapy™", "Palmitoylethanolamide (PEA)", "Lipigenium Complex", "Zinc"],
    },
    {
      id: "prod-cosrx-29",
      brand: "COSRX",
      name: "COSRX Advanced Snail 92 All in One Cream",
      views: "2.8B Views",
      viralTag: "#SnailCream • Plumping Sensation",
      trendHook: "92% Pure Snail Secretion Filtrate",
      heroHeadline: "92% Pure Mucin.",
      heroHighlight: "TikTok Snail Cream Miracle.",
      heroSubtitle:
        "Rich gel-cream texture glides effortlessly to soothe hyper-sensitive post-breakout skin and create a protective moisture shield.",
      heroImage: "https://images.openbeautyfacts.org/images/products/880/941/647/0023/front_en.15.400.jpg",
      fallbackPrice: 22.0,
      size: "100g Jar",
      rating: 4.8,
      reviewCount: 38400,
      ingredients: ["92% Snail Secretion Filtrate", "Hyaluronic Acid", "Betaine", "Allantoin"],
    },
    {
      id: "prod-skin1004-153",
      brand: "Skin1004",
      name: "Skin1004 Madagascar Centella Soothing Cream Gel Moisture",
      views: "2.3B Views",
      viralTag: "#Centella • Redness Neutralizer",
      trendHook: "100% Organic Madagascar Cica",
      heroHeadline: "Madagascar Cica.",
      heroHighlight: "Instant Thermal Cooling.",
      heroSubtitle:
        "Infused with 4 botanical ceramides and high-potency Asiaticoside to cool facial skin temperature and soothe inflamed rosacea.",
      heroImage: "https://images.openbeautyfacts.org/images/products/880/964/073/6025/front_nl.3.400.jpg",
      fallbackPrice: 19.5,
      size: "75ml Tube",
      rating: 4.9,
      reviewCount: 21500,
      ingredients: ["Madagascar Centella Asiatica", "4 Ceramide Complex", "Phytosphingosine", "Tranexamic Acid"],
    },
    {
      id: "prod-theordinary-165",
      brand: "The Ordinary",
      name: "The Ordinary Glycolic Acid 7% Exfoliating Toner",
      views: "3.9B Views",
      viralTag: "#GlycolicAcid • 10-in-1 Viral Hack",
      trendHook: "Multi-Zone Body & Facial Clarifier",
      heroHeadline: "10-in-1 Exfoliant.",
      heroHighlight: "7% Glycolic Acid Phenomenon.",
      heroSubtitle:
        "The most viral multi-use acid on social media. Gently dissolves keratinized surface accumulation on face, elbows, and scalp.",
      heroImage: "https://images.openbeautyfacts.org/images/products/076/991/519/0609/front_en.14.400.jpg",
      fallbackPrice: 13.0,
      size: "240ml Bottle",
      rating: 4.8,
      reviewCount: 46200,
      ingredients: ["7% Glycolic Acid (AHA)", "Tasmanian Pepperberry", "Aloe Vera", "Ginseng Root"],
    },
    {
      id: "prod-beautyofjoseon-31",
      brand: "Beauty of Joseon",
      name: "Beauty of Joseon Dynasty Cream Royal Hydration",
      views: "1.6B Views",
      viralTag: "#DynastyCream • Hanbang Luxury",
      trendHook: "Royal Court Hanbang Herbal Secrets",
      heroHeadline: "Royal Moisture.",
      heroHighlight: "Dynasty Hanbang Formula.",
      heroSubtitle:
        "Packed with 2% Niacinamide, 29% Rice Bran Water, and Ginseng Water for a bouncy, dense mochi-skin radiance.",
      heroImage: "https://images.openbeautyfacts.org/images/products/880/996/813/0277/front_nl.21.400.jpg",
      fallbackPrice: 20.0,
      size: "50ml Glass Jar",
      rating: 4.8,
      reviewCount: 18900,
      ingredients: ["Rice Bran Water 29%", "Ginseng Root Water", "Squalane 2%", "Niacinamide 2%"],
    },
  ],
];

/**
 * Calculates which weekly catalog pool should be active right now
 * based on the current week epoch (changes automatically every Sunday at 00:00 UTC).
 */
export function getCurrentWeeklyTikTokCatalog() {
  const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
  const weekIndex = Math.floor(Date.now() / ONE_WEEK_MS) % WEEKLY_TIKTOK_POOLS.length;
  return {
    weekNumber: weekIndex + 1,
    catalog: WEEKLY_TIKTOK_POOLS[weekIndex],
    nextRotationAt: new Date((Math.floor(Date.now() / ONE_WEEK_MS) + 1) * ONE_WEEK_MS).toISOString(),
  };
}
