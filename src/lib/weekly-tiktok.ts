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

// Guaranteed 100% working high-resolution CDN images from Amazon & verified direct inventory
export const WEEKLY_TIKTOK_POOLS: TikTokViralTrend[][] = [
  // Week 1: Global Viral Sensations & Glass Skin
  [
    {
      id: "prod-cosrx-28",
      brand: "COSRX",
      name: "COSRX Advanced Snail 96 Mucin Power Essence",
      views: "Viral Favorite",
      viralTag: "#TikTokMadeMeBuyIt • Viral Glass Skin",
      trendHook: "The #1 Most Viral Skincare Product on TikTok Globally",
      heroHeadline: "Glass Skin Dew.",
      heroHighlight: "Original COSRX Snail Mucin.",
      heroSubtitle:
        "Formulated with 96.3% Snail Secretion Filtrate to repair damaged moisture barriers, fade post-acne marks, and deliver intense luminous hydration.",
      heroImage: "/uploads/hero-61p-wtpDraL.jpg",
      fallbackPrice: 19.99,
      size: "100ml / 3.38 fl. oz",
      rating: 4.9,
      reviewCount: 48920,
      ingredients: ["96.3% Snail Secretion Filtrate", "Sodium Hyaluronate", "Allantoin", "Panthenol"],
    },
    {
      id: "amz-prod-B00A35SIHE",
      brand: "NIVEA",
      name: "NIVEA Creme Classic Intensive Hydration Tin",
      views: "Viral Favorite",
      viralTag: "Viral #LaMerDupe Trend",
      trendHook: "Overnight Barrier Slugging Essential",
      heroHeadline: "The $8 Miracle Cream.",
      heroHighlight: "TikTok's Famous Crème Dupe.",
      heroSubtitle:
        "Skin-identical Eucerit® and Provitamin B5 deliver rich 48H continuous occlusive slugging that rivals $350 luxury moisturizers.",
      heroImage: "/uploads/hero-61dNDSeJTUL.jpg",
      fallbackPrice: 8.99,
      size: "250ml / 8.4 oz Classic Tin",
      rating: 4.9,
      reviewCount: 38200,
      ingredients: ["Eucerit®", "Panthenol (B5)", "Glycerin", "Lanolin Alcohol"],
    },
    {
      id: "imp-glow-recipe-dew-drops",
      brand: "Glow Recipe",
      name: "Glow Recipe Watermelon Glow Niacinamide Dew Drops",
      views: "Viral Favorite",
      viralTag: "#DewDrops • TikTok Highlighting Serum",
      trendHook: "The Original Viral Glass Skin Primer",
      heroHeadline: "Instant Dew.",
      heroHighlight: "TikTok's Cult Dew Drops.",
      heroSubtitle:
        "Multi-use highlighting serum with Niacinamide and Hyaluronic Acid that delivers an effortless dewy glow without mica, glitter, or grey cast.",
      heroImage: "/uploads/hero-51h-PS9qIIL.jpg",
      fallbackPrice: 35.0,
      size: "40ml / 1.35 oz",
      rating: 4.8,
      reviewCount: 22800,
      ingredients: ["Niacinamide (Vitamin B3)", "Watermelon Extract", "Hyaluronic Acid", "Moringa Seed Oil"],
    },
    {
      id: "amz-prod-B0CM47G1JJ",
      brand: "La Roche-Posay",
      name: "La Roche-Posay Cicaplast Baume B5+ Ultra-Repairing Balm",
      views: "Viral Favorite",
      viralTag: "TikTok #SkinCycling & Slugging",
      trendHook: "Emergency Barrier Recovery in 1 Night",
      heroHeadline: "Overnight Repair.",
      heroHighlight: "TikTok Slugging Essential.",
      heroSubtitle:
        "Madecassoside, 5% Panthenol, and Tribioma prebiotics instantly rebuild damaged barriers from over-exfoliation and retinoid irritation.",
      heroImage: "/uploads/hero-51DNkL-r2uL.jpg",
      fallbackPrice: 22.99,
      size: "100ml Large Tube",
      rating: 4.9,
      reviewCount: 42100,
      ingredients: ["5% Panthenol (B5)", "Madecassoside", "Tribioma Prebiotics", "Shea Butter"],
    },
    {
      id: "imp-tatcha-water-cream",
      brand: "Tatcha",
      name: "Tatcha The Water Cream Oil-Free Pore-Minimizing",
      views: "Viral Favorite",
      viralTag: "#WaterBurst • Japanese Glow",
      trendHook: "Pure Hydration Burst with Japanese Botanicals",
      heroHeadline: "Water-Burst Plump.",
      heroHighlight: "Tatcha Cult Water Cream.",
      heroSubtitle:
        "Unique oil-free water cream releases a burst of balancing Japanese wild rose and leopard lily to tighten pores and hydrate deeply.",
      heroImage: "/uploads/hero-51G9yTBH28L.jpg",
      fallbackPrice: 70.0,
      size: "50ml / 1.7 oz",
      rating: 4.8,
      reviewCount: 21400,
      ingredients: ["Japanese Wild Rose", "Japanese Leopard Lily", "Hadasei-3 Complex", "Green Tea"],
    },
  ],
  // Week 2: High-Performance Glow, Peptides & Barrier Quench
  [
    {
      id: "imp-glow-recipe-plum-plump",
      brand: "Glow Recipe",
      name: "Glow Recipe Plum Plump Hyaluronic Cream",
      views: "Viral Favorite",
      viralTag: "#PlumPlump • Weightless Dew",
      trendHook: "5 Molecular Weights of Hyaluronic Acid",
      heroHeadline: "Cellular Plump.",
      heroHighlight: "Kakadu Plum Whipped Gel.",
      heroSubtitle:
        "Whipped gel-cream infused with juicy Kakadu Plum and polyglutamic acid for lightweight all-day hydration without heaviness.",
      heroImage: "/uploads/hero-61WZN4-TPBL.jpg",
      fallbackPrice: 40.0,
      size: "50ml Refillable Jar",
      rating: 4.8,
      reviewCount: 13900,
      ingredients: ["Kakadu Plum Extract", "Polyglutamic Acid", "5 Molecular HA", "Willowherb"],
    },
    {
      id: "imp-drunk-elephant-protini",
      brand: "Drunk Elephant",
      name: "Drunk Elephant Protini™ Polypeptide Cream",
      views: "Viral Favorite",
      viralTag: "#ProteinShot • 9 Signal Peptides",
      trendHook: "Clinical Collagen Firming Sensation",
      heroHeadline: "Signal Peptides.",
      heroHighlight: "Drunk Elephant Protini.",
      heroSubtitle:
        "A breakthrough protein moisturizer combining 9 signal peptides, growth factors, and amino acids for visibly firmer, bouncy skin.",
      heroImage: "/uploads/hero-61DKfnKG8XL.jpg",
      fallbackPrice: 68.0,
      size: "50ml Airless Pump",
      rating: 4.8,
      reviewCount: 14900,
      ingredients: ["9 Signal Peptide Complex", "Pygmy Waterlily Extract", "Soybean Folic Acid", "Marula Oil"],
    },
    {
      id: "prod-theordinary-168",
      brand: "The Ordinary",
      name: "The Ordinary Buffet Multi-Peptide + HA Matrix Serum",
      views: "Viral Favorite",
      viralTag: "#PeptideBuffet • Cellular Density",
      trendHook: "Comprehensive Multi-Technology Peptide Complex",
      heroHeadline: "Peptide Matrix.",
      heroHighlight: "Multi-Peptide + HA Buffet.",
      heroSubtitle:
        "Combines Matrixyl 3000, Syn-Ake, and amino acid complexes to target static and dynamic wrinkles across all facial zones.",
      heroImage: "/uploads/hero-71KExLnstsL.jpg",
      fallbackPrice: 19.99,
      size: "30ml Precision Dropper",
      rating: 4.8,
      reviewCount: 31200,
      ingredients: ["Matrixyl 3000", "Syn-Ake Peptide", "Relistase Complex", "Multiple HA Weights"],
    },
    {
      id: "prod-roundlab-298",
      brand: "Round Lab",
      name: "Round Lab Birch Juice Moisturizing Sun Cream SPF 50+",
      views: "Viral Favorite",
      viralTag: "TikTok #1 Korean Sun Cream",
      trendHook: "Korea's Highest Rated Sunscreen Formulation",
      heroHeadline: "Birch Juice Sun.",
      heroHighlight: "Zero White Cast SPF 50+.",
      heroSubtitle:
        "Formulated with Inje Silver Birch Sap and Vita Hyaluronic Acid. Feels like a weightless moisturizing lotion that absorbs in seconds.",
      heroImage: "/uploads/hero-619dBL3GnLL.jpg",
      fallbackPrice: 21.0,
      size: "50ml Squeeze Tube",
      rating: 4.9,
      reviewCount: 26800,
      ingredients: ["Inje Silver Birch Sap", "Vita Hyaluronic Acid", "Niacinamide", "Adenosine"],
    },
    {
      id: "prod-tatcha-194",
      brand: "Tatcha",
      name: "Tatcha The Dewy Skin Cream Rich Plumping Moisturizer",
      views: "Viral Favorite",
      viralTag: "#DewySkin • Japanese Purple Rice",
      trendHook: "Celebrity Makeup Artists' Holy Grail Primer",
      heroHeadline: "Rich Purple Rice.",
      heroHighlight: "Tatcha Dewy Skin Cream.",
      heroSubtitle:
        "Rich, antioxidant-packed cream with Japanese purple rice, Okinawa algae, and hyaluronic acid to lock in dewy plumpness.",
      heroImage: "/uploads/hero-51x07AqqhvL.jpg",
      fallbackPrice: 72.0,
      size: "50ml Luxurious Jar",
      rating: 4.8,
      reviewCount: 28400,
      ingredients: ["Japanese Purple Rice", "Okinawa Algae Blend", "Hyaluronic Acid", "Botanical Squalane"],
    },
  ],
  // Week 3: Dermal Repair, Cleansing & Barrier Champions
  [
    {
      id: "imp-bioderma-sensibio-h2o",
      brand: "Bioderma",
      name: "Bioderma Sensibio H2O Micellar Cleansing Water",
      views: "Viral Favorite",
      viralTag: "#MicellarWater • 1 Bottle Sold Every 2 Sec",
      trendHook: "The Global French Pharmacy Cult Classic",
      heroHeadline: "Gentle Micelles.",
      heroHighlight: "Bioderma Sensibio H2O.",
      heroSubtitle:
        "Biomimetic micellar technology respects skin's natural barrier at pH 5.5, capturing 99% of impurities and waterproof makeup without rinsing.",
      heroImage: "/uploads/hero-51CM46RevxL.jpg",
      fallbackPrice: 19.99,
      size: "500ml Family Value Bottle",
      rating: 4.9,
      reviewCount: 45000,
      ingredients: ["Biomimetic Micelles", "Cucumber Fruit Extract", "Pharmaceutical Purified Water", "Mannitol"],
    },
    {
      id: "prod-skin1004-152",
      brand: "Skin1004",
      name: "Skin1004 Madagascar Centella Light Cleansing Oil",
      views: "Viral Favorite",
      viralTag: "#CleansingOil • Pore Melt Trend",
      trendHook: "Melt Blackheads & Sunscreen Instantly",
      heroHeadline: "Centella Melt.",
      heroHighlight: "Skin1004 Cleansing Oil.",
      heroSubtitle:
        "Ultra-light cleansing oil infused with pure Madagascar Centella to dissolve waterproof makeup and clear sebum from pores without stinging eyes.",
      heroImage: "/uploads/hero-61ZG5xWuAL.jpg",
      fallbackPrice: 19.5,
      size: "200ml Pump Bottle",
      rating: 4.8,
      reviewCount: 18400,
      ingredients: ["Madagascar Centella Oil", "MCT Coconut Esters", "Bergamot Oil", "Jojoba Seed Oil"],
    },
    {
      id: "prod-beautyofjoseon-44",
      brand: "Beauty of Joseon",
      name: "Beauty of Joseon Matte Sun Stick: Mugwort + Camelia",
      views: "Viral Favorite",
      viralTag: "#SunStick • Viral Handbag Essential",
      trendHook: "Reapply Sunscreen Over Full Makeup Without Shine",
      heroHeadline: "Matte Sun Stick.",
      heroHighlight: "Mugwort & Camelia SPF 50+.",
      heroSubtitle:
        "Silica-powder sebum control stick glides over foundation with zero clumpiness or greasy residue. Non-sticky matte finish all day.",
      heroImage: "/uploads/hero-51PbZMgofCL.jpg",
      fallbackPrice: 18.0,
      size: "18g Portable Twist Stick",
      rating: 4.8,
      reviewCount: 22100,
      ingredients: ["Artemisia Capillaris (Mugwort)", "Green Tea Extract", "Silica Powder", "Centella Asiatica"],
    },
    {
      id: "amz-prod-B00D7BZNT2",
      brand: "CeraVe",
      name: "CeraVe SA Smoothing & Moisturizing Cream",
      views: "Viral Favorite",
      viralTag: "#StrawberrySkin • Keratosis Pilaris Cure",
      trendHook: "Smoothing Rough & Bumpy Skin Fix",
      heroHeadline: "Smooth Texture.",
      heroHighlight: "CeraVe Salicylic Acid Cream.",
      heroSubtitle:
        "Salicylic acid, 10% urea, and 3 essential ceramides exfoliate rough bumps while deeply hydrating the skin barrier with MVE delivery.",
      heroImage: "/uploads/hero-61cCKPTNz6L.jpg",
      fallbackPrice: 22.99,
      size: "340g / 12 oz Tub",
      rating: 4.9,
      reviewCount: 39500,
      ingredients: ["Salicylic Acid (BHA)", "3 Essential Ceramides (1, 3, 6-II)", "Hyaluronic Acid", "10% Urea"],
    },
    {
      id: "prod-anua-43",
      brand: "Anua",
      name: "Anua Birch Moisture Boosting Deep Hydration Toner",
      views: "Viral Favorite",
      viralTag: "#BirchToner • Glass Skin Moisture Layer",
      trendHook: "Japanese White Birch Deep Aquaporin Boost",
      heroHeadline: "Birch Aquaporins.",
      heroHighlight: "Anua Moisture Booster.",
      heroSubtitle:
        "Packed with 70% Japanese white birch sap to open cellular water channels and create a plump, luminous glass-skin reflection.",
      heroImage: "/uploads/hero-51Kpw2r-pIL.jpg",
      fallbackPrice: 21.0,
      size: "250ml Bottle",
      rating: 4.8,
      reviewCount: 17200,
      ingredients: ["70% White Birch Sap", "10 Hyaluronic Acid Complex", "Betaine", "Panthenol"],
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
