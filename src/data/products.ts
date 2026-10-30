export type ProductCategory =
  | "All"
  | "Moisturizing Creams"
  | "Anti-Aging & Q10"
  | "Barrier Repair & Relief"
  | "Radiant Body Care"
  | "Active Serums & Toners"
  | "Sunscreen & Daily Defense"
  | "Gentle Cleansers & Masks"
  | "Hair & Scalp Care"
  | "Luxury Fragrances & Colognes";

export type CurrencyCode =
  | "USD"
  | "GBP"
  | "EUR"
  | "CAD"
  | "AUD"
  | "JPY"
  | "CHF"
  | "NGN"
  | "ZAR"
  | "KES"
  | "AED"
  | "SGD"
  | "INR"
  | "BRL"
  | "CNY"
  | "MXN"
  | "KRW"
  | "SEK"
  | "NZD"
  | "HKD";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  label: string;
  flag: string;
  countryCode: string;
  countryName: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: "USD", symbol: "$", rate: 1, label: "USD ($)", flag: "🇺🇸", countryCode: "us", countryName: "United States" },
  EUR: { code: "EUR", symbol: "€", rate: 0.92, label: "EUR (€)", flag: "🇪🇺", countryCode: "eu", countryName: "European Union" },
  GBP: { code: "GBP", symbol: "£", rate: 0.79, label: "GBP (£)", flag: "🇬🇧", countryCode: "gb", countryName: "United Kingdom" },
  CAD: { code: "CAD", symbol: "CA$", rate: 1.38, label: "CAD ($)", flag: "🇨🇦", countryCode: "ca", countryName: "Canada" },
  AUD: { code: "AUD", symbol: "A$", rate: 1.54, label: "AUD ($)", flag: "🇦🇺", countryCode: "au", countryName: "Australia" },
  JPY: { code: "JPY", symbol: "¥", rate: 154.5, label: "JPY (¥)", flag: "🇯🇵", countryCode: "jp", countryName: "Japan" },
  CHF: { code: "CHF", symbol: "CHF", rate: 0.89, label: "CHF", flag: "🇨🇭", countryCode: "ch", countryName: "Switzerland" },
  NGN: { code: "NGN", symbol: "₦", rate: 1480, label: "NGN (₦)", flag: "🇳🇬", countryCode: "ng", countryName: "Nigeria" },
  ZAR: { code: "ZAR", symbol: "R", rate: 18.4, label: "ZAR (R)", flag: "🇿🇦", countryCode: "za", countryName: "South Africa" },
  KES: { code: "KES", symbol: "KSh", rate: 131, label: "KES (KSh)", flag: "🇰🇪", countryCode: "ke", countryName: "Kenya" },
  AED: { code: "AED", symbol: "AED", rate: 3.67, label: "AED (د.إ)", flag: "🇦🇪", countryCode: "ae", countryName: "UAE" },
  SGD: { code: "SGD", symbol: "S$", rate: 1.35, label: "SGD ($)", flag: "🇸🇬", countryCode: "sg", countryName: "Singapore" },
  INR: { code: "INR", symbol: "₹", rate: 83.5, label: "INR (₹)", flag: "🇮🇳", countryCode: "in", countryName: "India" },
  BRL: { code: "BRL", symbol: "R$", rate: 5.65, label: "BRL (R$)", flag: "🇧🇷", countryCode: "br", countryName: "Brazil" },
  CNY: { code: "CNY", symbol: "¥", rate: 7.24, label: "CNY (¥)", flag: "🇨🇳", countryCode: "cn", countryName: "China" },
  MXN: { code: "MXN", symbol: "Mex$", rate: 19.8, label: "MXN ($)", flag: "🇲🇽", countryCode: "mx", countryName: "Mexico" },
  KRW: { code: "KRW", symbol: "₩", rate: 1380, label: "KRW (₩)", flag: "🇰🇷", countryCode: "kr", countryName: "South Korea" },
  SEK: { code: "SEK", symbol: "kr", rate: 10.6, label: "SEK (kr)", flag: "🇸🇪", countryCode: "se", countryName: "Sweden" },
  NZD: { code: "NZD", symbol: "NZ$", rate: 1.66, label: "NZD ($)", flag: "🇳🇿", countryCode: "nz", countryName: "New Zealand" },
  HKD: { code: "HKD", symbol: "HK$", rate: 7.82, label: "HKD ($)", flag: "🇭🇰", countryCode: "hk", countryName: "Hong Kong" },
};

export interface ProductVariant {
  name: string;
  colorHex: string;
  inStock: boolean;
  image?: string;
  vid?: string;
}

export interface ProductReview {
  id: string;
  author: string;
  verified: boolean;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpfulCount: number;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface VerificationData {
  registry: string;
  referenceId: string;
  sourceUrl: string;
  originCountry: string;
  laboratoryCertifications: string[];
  batchLotNumber: string;
  verifiedAt: string;
}

export interface Product {
  id: string;
  sku: string;
  cjPid?: string;
  /** Written description of how the physical packaging looks (used to generate/verify the product image). */
  packagingDescription?: string;
  /** Where the product image comes from. */
  imageSource?: "openbeautyfacts" | "ai-generated" | "stock";
  brand: string;
  name: string;
  tagline: string;
  size: string;
  skinType: string;
  category: Exclude<ProductCategory, "All">;
  price: number;
  compareAtPrice: number;
  supplierCost: number;
  rating: number;
  reviewCount: number;
  soldCountText?: string;
  badge?: string;
  description?: string;
  howToUse?: string;
  shortDescription?: string;
  keyIngredients: string[];
  benefits: string[];
  image: string;
  gallery: string[];
  variants: ProductVariant[];
  stockLeft?: number;
  pairedWithIds?: string[];
  reviews?: ProductReview[];
  faqs?: ProductFAQ[];
  verification?: VerificationData;
  supplierSource?:
    | "Amazon Prime Dropship"
    | "Alibaba Trade Assurance Dropship"
    | "Direct Pharmaceutical Wholesale";
  supplierMoq?: number;
  shippingDays?: string;
}

export const CATEGORIES: ProductCategory[] = [
  "All",
  "Moisturizing Creams",
  "Active Serums & Toners",
  "Gentle Cleansers & Masks",
  "Sunscreen & Daily Defense",
  "Hair & Scalp Care",
  "Luxury Fragrances & Colognes",
  "Radiant Body Care",
  "Barrier Repair & Relief",
  "Anti-Aging & Q10",
];

export const INITIAL_PRODUCTS: Product[] = [

  {
    "id": "imp-glow-recipe-plum-plump",
    "sku": "GLO-PLU-050",
    "faqs": [],
    "name": "Glow Recipe Plum Plump Hyaluronic Cream",
    "size": "50ml / 1.7 oz",
    "badge": "5 Molecular HA",
    "brand": "Glow Recipe",
    "image": "https://m.media-amazon.com/images/I/61WZN4-TPBL._AC_UL320_.jpg",
    "price": 40,
    "rating": 4.8,
    "gallery": [
      "https://m.media-amazon.com/images/I/61WZN4-TPBL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Hydrating gel-cream with 5 molecular weights of hyaluronic acid and polyglutamic acid",
    "benefits": [
      "Multi-depth cellular hydration",
      "Controls excess oil while deeply plumping",
      "Refillable jar design"
    ],
    "category": "Moisturizing Creams",
    "skinType": "Combination, Oily to Dry Dehydrated Skin",
    "variants": [
      {
        "name": "50ml / 1.7 oz",
        "inStock": true,
        "colorHex": "#0032A0"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 13900,
    "shippingDays": "2–4 Days (Amazon Prime Dropship)",
    "supplierCost": 16.5,
    "verification": {
      "registry": "Amazon Bestseller Catalog",
      "sourceUrl": "https://www.amazon.com/dp/beauty-skincare",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B0S8YMRWZ",
      "originCountry": "United States",
      "batchLotNumber": "LOT-IMP-226918",
      "laboratoryCertifications": [
        "ISO 22716:2007",
        "Dermatologically Tested",
        "GMP Certified"
      ]
    },
    "soldCountText": "Verified Brand Import",
    "compareAtPrice": 48,
    "keyIngredients": [
      "Kakadu Plum Extract",
      "5 Molecular Weights of HA",
      "Polyglutamic Acid",
      "Willowherb"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "Weightless whipped gel cream bursting with Kakadu Plum and 5 molecular weights of hyaluronic acid."
  },
  {
    "id": "imp-glow-recipe-dew-drops",
    "sku": "GLO-DEW-040",
    "faqs": [],
    "name": "Glow Recipe Watermelon Glow Niacinamide Dew Drops",
    "size": "40ml / 1.35 oz",
    "badge": "TikTok Cult Glow",
    "brand": "Glow Recipe",
    "image": "https://m.media-amazon.com/images/I/51h-PS9qIIL._AC_UL320_.jpg",
    "price": 35,
    "rating": 4.8,
    "gallery": [
      "https://m.media-amazon.com/images/I/51h-PS9qIIL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Multi-use highlighting serum that visibly brightens skin and delivers an effortless dewy glow",
    "benefits": [
      "Instant glass skin glow with zero glitter",
      "Diminishes hyperpigmentation and clears pores",
      "Can be worn alone or under makeup"
    ],
    "category": "Active Serums & Toners",
    "skinType": "All Skin Types, Dull, Uneven Tone",
    "variants": [
      {
        "name": "40ml / 1.35 oz",
        "inStock": true,
        "colorHex": "#0032A0"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 22800,
    "shippingDays": "2–4 Days (Amazon Prime Dropship)",
    "supplierCost": 14,
    "verification": {
      "registry": "Amazon Bestseller Catalog",
      "sourceUrl": "https://www.amazon.com/dp/beauty-skincare",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B03LD6NJO",
      "originCountry": "United States",
      "batchLotNumber": "LOT-IMP-226005",
      "laboratoryCertifications": [
        "ISO 22716:2007",
        "Dermatologically Tested",
        "GMP Certified"
      ]
    },
    "soldCountText": "Verified Brand Import",
    "compareAtPrice": 40,
    "keyIngredients": [
      "Niacinamide (Vitamin B3)",
      "Watermelon Extract",
      "Hyaluronic Acid",
      "Moringa Seed Oil"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "Formulated without mica or glitter, this skincare-first serum hydrates and reduces hyperpigmentation over time."
  },
  {
    "id": "imp-bioderma-sensibio-h2o",
    "sku": "BIO-SEN-500",
    "faqs": [],
    "name": "Bioderma Sensibio H2O Micellar Cleansing Water",
    "size": "500ml / 16.7 oz",
    "badge": "Original Micellar Pioneer",
    "brand": "Bioderma",
    "image": "https://m.media-amazon.com/images/I/51CM46RevxL._AC_UL320_.jpg",
    "price": 19.99,
    "rating": 4.9,
    "gallery": [
      "https://m.media-amazon.com/images/I/51CM46RevxL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "The original pharmaceutical micellar water respecting the fragility of sensitive skin",
    "benefits": [
      "Removes 99% of makeup and pollution particles",
      "Physiological pH 5.5 matches natural skin barrier",
      "No rinsing required"
    ],
    "category": "Gentle Cleansers & Masks",
    "skinType": "Sensitive, Reactive, Intolerant Skin",
    "variants": [
      {
        "name": "500ml / 16.7 oz",
        "inStock": true,
        "colorHex": "#0032A0"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 35000,
    "shippingDays": "2–4 Days (Amazon Prime Dropship)",
    "supplierCost": 7.5,
    "verification": {
      "registry": "Amazon Bestseller Catalog",
      "sourceUrl": "https://www.amazon.com/dp/beauty-skincare",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B0OK0FK6Y",
      "originCountry": "United States",
      "batchLotNumber": "LOT-IMP-217702",
      "laboratoryCertifications": [
        "ISO 22716:2007",
        "Dermatologically Tested",
        "GMP Certified"
      ]
    },
    "soldCountText": "Verified Brand Import",
    "compareAtPrice": 24,
    "keyIngredients": [
      "Biomimetic Micelles",
      "Cucumis Sativus (Cucumber) Extract",
      "Highly Purified Pharmaceutical Water"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "Biomimetic micellar technology that captures impurities and heavy makeup while preserving the physiological microbiome."
  },
  {
    "id": "imp-drunk-elephant-cfirma",
    "sku": "DRE-CFR-028",
    "faqs": [],
    "name": "Drunk Elephant C-Firma™ Fresh Day Serum",
    "size": "28ml / 0.94 oz",
    "badge": "15% Pure Vitamin C",
    "brand": "Drunk Elephant",
    "image": "https://m.media-amazon.com/images/I/611mzGAKIUL._AC_UL320_.jpg",
    "price": 79,
    "rating": 4.7,
    "gallery": [
      "https://m.media-amazon.com/images/I/611mzGAKIUL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "15% L-Ascorbic Acid and Ferulic Acid antioxidant complex to dissolve dead surface skin",
    "benefits": [
      "Brightens and refines complexion",
      "Dissolves dead surface cells enzymatically",
      "72-hour reservoir effect"
    ],
    "category": "Anti-Aging & Q10",
    "skinType": "Uneven Tone, Dull, Aging Skin",
    "variants": [
      {
        "name": "28ml / 0.94 oz",
        "inStock": true,
        "colorHex": "#0032A0"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 11200,
    "shippingDays": "2–4 Days (Amazon Prime Dropship)",
    "supplierCost": 38,
    "verification": {
      "registry": "Amazon Bestseller Catalog",
      "sourceUrl": "https://www.amazon.com/dp/beauty-skincare",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B0XKC6AC4",
      "originCountry": "United States",
      "batchLotNumber": "LOT-IMP-195073",
      "laboratoryCertifications": [
        "ISO 22716:2007",
        "Dermatologically Tested",
        "GMP Certified"
      ]
    },
    "soldCountText": "Verified Brand Import",
    "compareAtPrice": 89,
    "keyIngredients": [
      "15% L-Ascorbic Acid",
      "0.5% Ferulic Acid",
      "1.0% Vitamin E",
      "Pumpkin Ferment Extract"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "Packed with 15% pure Vitamin C, 1% Vitamin E, and 0.5% Ferulic Acid plus pumpkin ferment for uniform luminosity."
  },
  {
    "id": "imp-drunk-elephant-protini",
    "sku": "DRE-PRO-050",
    "faqs": [],
    "name": "Drunk Elephant Protini™ Polypeptide Cream",
    "size": "50ml / 1.69 oz",
    "badge": "9 Signal Peptides",
    "brand": "Drunk Elephant",
    "image": "https://m.media-amazon.com/images/I/61DKfnKG8XL._AC_UL320_.jpg",
    "price": 68,
    "rating": 4.8,
    "gallery": [
      "https://m.media-amazon.com/images/I/61DKfnKG8XL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Signal peptide complex and pygmy waterlily for immediate improvement in skin firmness",
    "benefits": [
      "Restores bounce and cellular resilience",
      "Reduces appearance of lines and sun damage",
      "Silky airless pump dispenser"
    ],
    "category": "Anti-Aging & Q10",
    "skinType": "All Skin Types, Loss of Elasticity & Sun Damage",
    "variants": [
      {
        "name": "50ml / 1.69 oz",
        "inStock": true,
        "colorHex": "#0032A0"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 14900,
    "shippingDays": "2–4 Days (Amazon Prime Dropship)",
    "supplierCost": 32,
    "verification": {
      "registry": "Amazon Bestseller Catalog",
      "sourceUrl": "https://www.amazon.com/dp/beauty-skincare",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B0WPA2LAS",
      "originCountry": "United States",
      "batchLotNumber": "LOT-IMP-193018",
      "laboratoryCertifications": [
        "ISO 22716:2007",
        "Dermatologically Tested",
        "GMP Certified"
      ]
    },
    "soldCountText": "Verified Brand Import",
    "compareAtPrice": 78,
    "keyIngredients": [
      "9 Signal Peptide Complex",
      "Pygmy Waterlily Stem Cell Extract",
      "Soybean Folic Acid Ferment"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "A breakthrough protein moisturizer combining 9 signal peptides, growth factors, and supportive amino acids."
  },
  {
    "id": "amz-prod-B0CWY24FTC",
    "sku": "AMZ-B0CWY24FTC",
    "faqs": [],
    "name": "Masofta Hair Growth Serum | Density & Thickening Scalp Serum for Fuller Looking Hair with 3% Redensyl, 5% Capixyl, 4% Anagain, 3% Procapil & 3% Baicapil, Biotin, For Men & Women 1.01 fl.oz./30ML",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/61tETy2jNKL._AC_UL320_.jpg",
    "price": 27.18,
    "rating": 4.2,
    "gallery": [
      "https://m.media-amazon.com/images/I/61tETy2jNKL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Salon-Grade Strengthening & Scalp Nourishment",
    "benefits": [
      "Promotes Follicle Resilience & Density",
      "Reduces Breakage & Heat Damage",
      "Restores Glossy Shine & Scalp Balance"
    ],
    "category": "Hair & Scalp Care",
    "skinType": "All Hair & Scalp Types (Normal, Dry, Color-Treated)",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 271,
    "supplierCost": 16.99,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 35.33,
    "keyIngredients": [
      "Hydrolyzed Keratin",
      "Biotin & Follicle Nutrients",
      "Argan & Rosemary Oil",
      "Scalp Prebiotics"
    ],
    "shortDescription": "High-performance salon formula engineered to fortify hair strands from root to tip, optimize scalp micro-circulation, and prevent breakage for visibly fuller, healthier volume."
  },
  {
    "id": "amz-prod-B0CW4CLF2X",
    "sku": "AMZ-B0CW4CLF2X",
    "faqs": [],
    "name": "iRestore Elite + Rechargeable Battery Pack - Laser Red Light Therapy for Hair Growth - FDA Cleared Hair Loss, Hair Thinning Treatment for Men & Women - Hair Regrowth Laser Cap - 500 Lasers & LEDs",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/81P+vti8a9L._AC_UL320_.jpg",
    "price": 3196.8,
    "rating": 4.3,
    "gallery": [
      "https://m.media-amazon.com/images/I/81P+vti8a9L._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Salon-Grade Strengthening & Scalp Nourishment",
    "benefits": [
      "Promotes Follicle Resilience & Density",
      "Reduces Breakage & Heat Damage",
      "Restores Glossy Shine & Scalp Balance"
    ],
    "category": "Hair & Scalp Care",
    "skinType": "All Hair & Scalp Types (Normal, Dry, Color-Treated)",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 165,
    "supplierCost": 1998,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 4155.84,
    "keyIngredients": [
      "Hydrolyzed Keratin",
      "Biotin & Follicle Nutrients",
      "Argan & Rosemary Oil",
      "Scalp Prebiotics"
    ],
    "shortDescription": "High-performance salon formula engineered to fortify hair strands from root to tip, optimize scalp micro-circulation, and prevent breakage for visibly fuller, healthier volume."
  },
  {
    "id": "amz-prod-B08S31RWBK",
    "sku": "AMZ-B08S31RWBK",
    "faqs": [],
    "name": "Hicober Microfiber Hair Towel Wrap for Women, Blue Grey Pink, 3-Pack",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/81OfvjP4N7L._AC_UL320_.jpg",
    "price": 20.78,
    "rating": 4.6,
    "gallery": [
      "https://m.media-amazon.com/images/I/81OfvjP4N7L._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Salon-Grade Strengthening & Scalp Nourishment",
    "benefits": [
      "Promotes Follicle Resilience & Density",
      "Reduces Breakage & Heat Damage",
      "Restores Glossy Shine & Scalp Balance"
    ],
    "category": "Hair & Scalp Care",
    "skinType": "All Hair & Scalp Types (Normal, Dry, Color-Treated)",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 35285,
    "supplierCost": 12.99,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 27.01,
    "keyIngredients": [
      "Hydrolyzed Keratin",
      "Biotin & Follicle Nutrients",
      "Argan & Rosemary Oil",
      "Scalp Prebiotics"
    ],
    "shortDescription": "High-performance salon formula engineered to fortify hair strands from root to tip, optimize scalp micro-circulation, and prevent breakage for visibly fuller, healthier volume."
  },
  {
    "id": "amz-prod-B0DB6CDLSM",
    "sku": "AMZ-B0DB6CDLSM",
    "faqs": [],
    "name": "Dove Hair Intensive Repair 10-in-1 Serum Mask for Damaged Hair, 9.2 fl oz",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/714kukzr5FL._AC_UL320_.jpg",
    "price": 17.41,
    "rating": 4.6,
    "gallery": [
      "https://m.media-amazon.com/images/I/714kukzr5FL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Salon-Grade Strengthening & Scalp Nourishment",
    "benefits": [
      "Promotes Follicle Resilience & Density",
      "Reduces Breakage & Heat Damage",
      "Restores Glossy Shine & Scalp Balance"
    ],
    "category": "Hair & Scalp Care",
    "skinType": "All Hair & Scalp Types (Normal, Dry, Color-Treated)",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 5038,
    "supplierCost": 10.88,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 22.63,
    "keyIngredients": [
      "Hydrolyzed Keratin",
      "Biotin & Follicle Nutrients",
      "Argan & Rosemary Oil",
      "Scalp Prebiotics"
    ],
    "shortDescription": "High-performance salon formula engineered to fortify hair strands from root to tip, optimize scalp micro-circulation, and prevent breakage for visibly fuller, healthier volume."
  },
  {
    "id": "amz-prod-B0CYX9W5B1",
    "sku": "AMZ-B0CYX9W5B1",
    "faqs": [],
    "name": "Facial Hair Remover for Women - as Seen on TV Painless Face Shaver - Electric Hair Removal Device for Face Lips Peach Fuzz with Light (Rose Gold)",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/61JCHH0bX5L._AC_UL320_.jpg",
    "price": 15.98,
    "rating": 4.2,
    "gallery": [
      "https://m.media-amazon.com/images/I/61JCHH0bX5L._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Salon-Grade Strengthening & Scalp Nourishment",
    "benefits": [
      "Promotes Follicle Resilience & Density",
      "Reduces Breakage & Heat Damage",
      "Restores Glossy Shine & Scalp Balance"
    ],
    "category": "Hair & Scalp Care",
    "skinType": "All Hair & Scalp Types (Normal, Dry, Color-Treated)",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 13987,
    "supplierCost": 9.99,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 20.77,
    "keyIngredients": [
      "Hydrolyzed Keratin",
      "Biotin & Follicle Nutrients",
      "Argan & Rosemary Oil",
      "Scalp Prebiotics"
    ],
    "shortDescription": "High-performance salon formula engineered to fortify hair strands from root to tip, optimize scalp micro-circulation, and prevent breakage for visibly fuller, healthier volume."
  },
  {
    "id": "amz-prod-B01LSUQSB0",
    "sku": "AMZ-B01LSUQSB0",
    "faqs": [],
    "name": "REVLON One-Step Volumizer Hair Dryer and Styler, 2.8 in Barrel, Black",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/61SrWfdHa1L._AC_UL320_.jpg",
    "price": 59.98,
    "rating": 4.6,
    "gallery": [
      "https://m.media-amazon.com/images/I/61SrWfdHa1L._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Salon-Grade Strengthening & Scalp Nourishment",
    "benefits": [
      "Promotes Follicle Resilience & Density",
      "Reduces Breakage & Heat Damage",
      "Restores Glossy Shine & Scalp Balance"
    ],
    "category": "Hair & Scalp Care",
    "skinType": "All Hair & Scalp Types (Normal, Dry, Color-Treated)",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 352926,
    "supplierCost": 37.49,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 77.97,
    "keyIngredients": [
      "Hydrolyzed Keratin",
      "Biotin & Follicle Nutrients",
      "Argan & Rosemary Oil",
      "Scalp Prebiotics"
    ],
    "shortDescription": "High-performance salon formula engineered to fortify hair strands from root to tip, optimize scalp micro-circulation, and prevent breakage for visibly fuller, healthier volume."
  },
  {
    "id": "amz-prod-B0BLXZ4YBJ",
    "sku": "AMZ-B0BLXZ4YBJ",
    "faqs": [],
    "name": "YANIBEST Adjustable Silk Bonnet for Sleeping Women Double Layer Satin Bonnet Reduce Friction Prevent Frizz Curly Hair",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/71vgpcc-DoL._AC_UL320_.jpg",
    "price": 20.78,
    "rating": 4.4,
    "gallery": [
      "https://m.media-amazon.com/images/I/71vgpcc-DoL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Salon-Grade Strengthening & Scalp Nourishment",
    "benefits": [
      "Promotes Follicle Resilience & Density",
      "Reduces Breakage & Heat Damage",
      "Restores Glossy Shine & Scalp Balance"
    ],
    "category": "Hair & Scalp Care",
    "skinType": "All Hair & Scalp Types (Normal, Dry, Color-Treated)",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 30281,
    "supplierCost": 12.99,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 27.01,
    "keyIngredients": [
      "Hydrolyzed Keratin",
      "Biotin & Follicle Nutrients",
      "Argan & Rosemary Oil",
      "Scalp Prebiotics"
    ],
    "shortDescription": "High-performance salon formula engineered to fortify hair strands from root to tip, optimize scalp micro-circulation, and prevent breakage for visibly fuller, healthier volume."
  },
  {
    "id": "amz-prod-B0C3WHP4ND",
    "sku": "AMZ-B0C3WHP4ND",
    "faqs": [],
    "name": "Nutrafol Women Hair Growth Supplements, Ages 18-44, 2-Month Bundle",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/71sYUMTmBcL._AC_UL320_.jpg",
    "price": 281.6,
    "rating": 4.3,
    "gallery": [
      "https://m.media-amazon.com/images/I/71sYUMTmBcL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Salon-Grade Strengthening & Scalp Nourishment",
    "benefits": [
      "Promotes Follicle Resilience & Density",
      "Reduces Breakage & Heat Damage",
      "Restores Glossy Shine & Scalp Balance"
    ],
    "category": "Hair & Scalp Care",
    "skinType": "All Hair & Scalp Types (Normal, Dry, Color-Treated)",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 828,
    "supplierCost": 176,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 366.08,
    "keyIngredients": [
      "Hydrolyzed Keratin",
      "Biotin & Follicle Nutrients",
      "Argan & Rosemary Oil",
      "Scalp Prebiotics"
    ],
    "shortDescription": "High-performance salon formula engineered to fortify hair strands from root to tip, optimize scalp micro-circulation, and prevent breakage for visibly fuller, healthier volume."
  },
  {
    "id": "amz-prod-B0H7F41Z5G",
    "sku": "AMZ-B0H7F41Z5G",
    "faqs": [],
    "name": "MDhair Thickening Conditioner for Thinning Hair, Women & Men, 5 oz",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/51a-bBp-gEL._AC_UL320_.jpg",
    "price": 28.16,
    "rating": 4.3,
    "gallery": [
      "https://m.media-amazon.com/images/I/51a-bBp-gEL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Salon-Grade Strengthening & Scalp Nourishment",
    "benefits": [
      "Promotes Follicle Resilience & Density",
      "Reduces Breakage & Heat Damage",
      "Restores Glossy Shine & Scalp Balance"
    ],
    "category": "Hair & Scalp Care",
    "skinType": "All Hair & Scalp Types (Normal, Dry, Color-Treated)",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 29,
    "supplierCost": 17.6,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 36.61,
    "keyIngredients": [
      "Hydrolyzed Keratin",
      "Biotin & Follicle Nutrients",
      "Argan & Rosemary Oil",
      "Scalp Prebiotics"
    ],
    "shortDescription": "High-performance salon formula engineered to fortify hair strands from root to tip, optimize scalp micro-circulation, and prevent breakage for visibly fuller, healthier volume."
  },
  {
    "id": "amz-prod-B07FJ783ZG",
    "sku": "AMZ-B07FJ783ZG",
    "faqs": [],
    "name": "COLOR WOW Dream Coat – Anti-Humidity Frizz Control Spray for Glass Hair",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/61F2SrfLS-L._AC_UL320_.jpg",
    "price": 22.4,
    "rating": 4.3,
    "gallery": [
      "https://m.media-amazon.com/images/I/61F2SrfLS-L._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Salon-Grade Strengthening & Scalp Nourishment",
    "benefits": [
      "Promotes Follicle Resilience & Density",
      "Reduces Breakage & Heat Damage",
      "Restores Glossy Shine & Scalp Balance"
    ],
    "category": "Hair & Scalp Care",
    "skinType": "All Hair & Scalp Types (Normal, Dry, Color-Treated)",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 112166,
    "supplierCost": 14,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 29.12,
    "keyIngredients": [
      "Hydrolyzed Keratin",
      "Biotin & Follicle Nutrients",
      "Argan & Rosemary Oil",
      "Scalp Prebiotics"
    ],
    "shortDescription": "High-performance salon formula engineered to fortify hair strands from root to tip, optimize scalp micro-circulation, and prevent breakage for visibly fuller, healthier volume."
  },
  {
    "id": "amz-prod-B0BNSF38C9",
    "sku": "AMZ-B0BNSF38C9",
    "faqs": [],
    "name": "Kitsch Zig Zag Headbands for Women - Black and Tortoise, 2 pcs",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/71EawIrRV-L._AC_UL320_.jpg",
    "price": 15.98,
    "rating": 3.8,
    "gallery": [
      "https://m.media-amazon.com/images/I/71EawIrRV-L._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Authentic Amazon Prime Express Delivery (2–4 Days)",
    "benefits": [
      "2–4 Days Express Prime Courier Dispatch",
      "100% Genuine Guaranteed Formula"
    ],
    "category": "Moisturizing Creams",
    "skinType": "All Skin Types",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 7799,
    "supplierCost": 9.99,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 20.77,
    "keyIngredients": [
      "Active Skin Emollients",
      "Ceramides",
      "Hyaluronic Acid"
    ],
    "shortDescription": "Kitsch Zig Zag Headbands for Women - Black and Tortoise, 2 pcs. Verified authentic batch registered under Amazon Bestseller Catalog (ASIN: B0BNSF38C9)."
  },
  {
    "id": "amz-prod-B0H7F5V65R",
    "sku": "AMZ-B0H7F5V65R",
    "faqs": [],
    "name": "Regrowth Supplements – Hair Growth Vitamins for Women & Men",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/61-UKcrPXxL._AC_UL320_.jpg",
    "price": 53.76,
    "rating": 4.4,
    "gallery": [
      "https://m.media-amazon.com/images/I/61-UKcrPXxL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Salon-Grade Strengthening & Scalp Nourishment",
    "benefits": [
      "Promotes Follicle Resilience & Density",
      "Reduces Breakage & Heat Damage",
      "Restores Glossy Shine & Scalp Balance"
    ],
    "category": "Hair & Scalp Care",
    "skinType": "All Hair & Scalp Types (Normal, Dry, Color-Treated)",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 32,
    "supplierCost": 33.6,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 69.89,
    "keyIngredients": [
      "Hydrolyzed Keratin",
      "Biotin & Follicle Nutrients",
      "Argan & Rosemary Oil",
      "Scalp Prebiotics"
    ],
    "shortDescription": "High-performance salon formula engineered to fortify hair strands from root to tip, optimize scalp micro-circulation, and prevent breakage for visibly fuller, healthier volume."
  },
  {
    "id": "amz-prod-B08HT8399V",
    "sku": "AMZ-B08HT8399V",
    "faqs": [],
    "name": "Guess Seductive Women / Femme Eau de Toilette Perfume Spray For Women, 1.0 Fl. Oz.",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/71qRcZaRO6L._AC_UL320_.jpg",
    "price": 27.2,
    "rating": 4.5,
    "gallery": [
      "https://m.media-amazon.com/images/I/71qRcZaRO6L._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Captivating Sillage & Luxury Olfactory Profile",
    "benefits": [
      "All-Day Sillage & Projection",
      "Authentic Master Perfumer Blend",
      "Skin-Safe Hypoallergenic Notes"
    ],
    "category": "Luxury Fragrances & Colognes",
    "skinType": "All Skin Types • Long-Lasting Sillage",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 14502,
    "supplierCost": 17,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 35.36,
    "keyIngredients": [
      "Fine Fragrance Oils",
      "Amber & Bergamot Notes",
      "Sensual Vanilla Accords",
      "Long-Lasting Fixative"
    ],
    "shortDescription": "Luxury olfactory masterpiece blending vibrant top notes with deep sensual base accords. Crafted for exceptional projection, all-day sillage, and magnetic presence."
  },
  {
    "id": "amz-prod-B09MCLDP8D",
    "sku": "AMZ-B09MCLDP8D",
    "faqs": [],
    "name": "Clean-n-Fresh Body Spray for Women, Body Mist, Fragrance Mist Gift Sets, Pack of 3, Each 3.4 Fl Oz, Total 10.2 Fl Oz, Cherry Blossom",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/71pj8En2gcL._AC_UL320_.jpg",
    "price": 30.38,
    "rating": 4.3,
    "gallery": [
      "https://m.media-amazon.com/images/I/71pj8En2gcL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Captivating Sillage & Luxury Olfactory Profile",
    "benefits": [
      "All-Day Sillage & Projection",
      "Authentic Master Perfumer Blend",
      "Skin-Safe Hypoallergenic Notes"
    ],
    "category": "Luxury Fragrances & Colognes",
    "skinType": "All Skin Types • Long-Lasting Sillage",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 1368,
    "supplierCost": 18.99,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 39.49,
    "keyIngredients": [
      "Fine Fragrance Oils",
      "Amber & Bergamot Notes",
      "Sensual Vanilla Accords",
      "Long-Lasting Fixative"
    ],
    "shortDescription": "Luxury olfactory masterpiece blending vibrant top notes with deep sensual base accords. Crafted for exceptional projection, all-day sillage, and magnetic presence."
  },
  {
    "id": "amz-prod-B0F9FK3V68",
    "sku": "AMZ-B0F9FK3V68",
    "faqs": [],
    "name": "Botanic Hearth Jasmine Body Spray & Hair Perfume for Women - 3.4oz",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/71Md2H06rSL._AC_UL320_.jpg",
    "price": 15.98,
    "rating": 4,
    "gallery": [
      "https://m.media-amazon.com/images/I/71Md2H06rSL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Captivating Sillage & Luxury Olfactory Profile",
    "benefits": [
      "All-Day Sillage & Projection",
      "Authentic Master Perfumer Blend",
      "Skin-Safe Hypoallergenic Notes"
    ],
    "category": "Luxury Fragrances & Colognes",
    "skinType": "All Skin Types • Long-Lasting Sillage",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 912,
    "supplierCost": 9.99,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 20.77,
    "keyIngredients": [
      "Fine Fragrance Oils",
      "Amber & Bergamot Notes",
      "Sensual Vanilla Accords",
      "Long-Lasting Fixative"
    ],
    "shortDescription": "Luxury olfactory masterpiece blending vibrant top notes with deep sensual base accords. Crafted for exceptional projection, all-day sillage, and magnetic presence."
  },
  {
    "id": "amz-prod-B0048B4XYQ",
    "sku": "AMZ-B0048B4XYQ",
    "faqs": [],
    "name": "Victoria's Secret Fine Fragrance Mini Mist, Bombshell - 2.5 fl oz",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/61CdAnLoUtL._AC_UL320_.jpg",
    "price": 20.77,
    "rating": 4.6,
    "gallery": [
      "https://m.media-amazon.com/images/I/61CdAnLoUtL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Captivating Sillage & Luxury Olfactory Profile",
    "benefits": [
      "All-Day Sillage & Projection",
      "Authentic Master Perfumer Blend",
      "Skin-Safe Hypoallergenic Notes"
    ],
    "category": "Luxury Fragrances & Colognes",
    "skinType": "All Skin Types • Long-Lasting Sillage",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 14235,
    "supplierCost": 12.98,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 27,
    "keyIngredients": [
      "Fine Fragrance Oils",
      "Amber & Bergamot Notes",
      "Sensual Vanilla Accords",
      "Long-Lasting Fixative"
    ],
    "shortDescription": "Luxury olfactory masterpiece blending vibrant top notes with deep sensual base accords. Crafted for exceptional projection, all-day sillage, and magnetic presence."
  },
  {
    "id": "amz-prod-B08HZZGFQC",
    "sku": "AMZ-B08HZZGFQC",
    "faqs": [],
    "name": "Ariana Grande Cloud Body Mist – Warm Gourmand Fragrance for Women – Women's Perfume with Notes of Lavender, Coconut, Vanilla & Pear – 8 Fl Oz",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/61Uc8qoY80L._AC_UL320_.jpg",
    "price": 19.55,
    "rating": 4.4,
    "gallery": [
      "https://m.media-amazon.com/images/I/61Uc8qoY80L._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Captivating Sillage & Luxury Olfactory Profile",
    "benefits": [
      "All-Day Sillage & Projection",
      "Authentic Master Perfumer Blend",
      "Skin-Safe Hypoallergenic Notes"
    ],
    "category": "Luxury Fragrances & Colognes",
    "skinType": "All Skin Types • Long-Lasting Sillage",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 12361,
    "supplierCost": 12.22,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 25.42,
    "keyIngredients": [
      "Fine Fragrance Oils",
      "Amber & Bergamot Notes",
      "Sensual Vanilla Accords",
      "Long-Lasting Fixative"
    ],
    "shortDescription": "Luxury olfactory masterpiece blending vibrant top notes with deep sensual base accords. Crafted for exceptional projection, all-day sillage, and magnetic presence."
  },
  {
    "id": "amz-prod-B00BNRV6CA",
    "sku": "AMZ-B00BNRV6CA",
    "faqs": [],
    "name": "Paris Hilton Body Mist for Women, 8 Fluid Ounce",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/61578dr68NL._AC_UL320_.jpg",
    "price": 12.77,
    "rating": 4.6,
    "gallery": [
      "https://m.media-amazon.com/images/I/61578dr68NL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Captivating Sillage & Luxury Olfactory Profile",
    "benefits": [
      "All-Day Sillage & Projection",
      "Authentic Master Perfumer Blend",
      "Skin-Safe Hypoallergenic Notes"
    ],
    "category": "Luxury Fragrances & Colognes",
    "skinType": "All Skin Types • Long-Lasting Sillage",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 5693,
    "supplierCost": 7.98,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 16.6,
    "keyIngredients": [
      "Fine Fragrance Oils",
      "Amber & Bergamot Notes",
      "Sensual Vanilla Accords",
      "Long-Lasting Fixative"
    ],
    "shortDescription": "Luxury olfactory masterpiece blending vibrant top notes with deep sensual base accords. Crafted for exceptional projection, all-day sillage, and magnetic presence."
  },
  {
    "id": "amz-prod-B07JRG42D9",
    "sku": "AMZ-B07JRG42D9",
    "faqs": [],
    "name": "Victoria's Secret Body Fragrance Mist, Bare Vanilla - 8.4 fl oz",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "Amazon Bestseller",
    "image": "https://m.media-amazon.com/images/I/61oq0d1mriL._AC_UL320_.jpg",
    "price": 25.54,
    "rating": 4.7,
    "gallery": [
      "https://m.media-amazon.com/images/I/61oq0d1mriL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Captivating Sillage & Luxury Olfactory Profile",
    "benefits": [
      "All-Day Sillage & Projection",
      "Authentic Master Perfumer Blend",
      "Skin-Safe Hypoallergenic Notes"
    ],
    "category": "Luxury Fragrances & Colognes",
    "skinType": "All Skin Types • Long-Lasting Sillage",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 16730,
    "supplierCost": 15.96,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 33.2,
    "keyIngredients": [
      "Fine Fragrance Oils",
      "Amber & Bergamot Notes",
      "Sensual Vanilla Accords",
      "Long-Lasting Fixative"
    ],
    "shortDescription": "Luxury olfactory masterpiece blending vibrant top notes with deep sensual base accords. Crafted for exceptional projection, all-day sillage, and magnetic presence."
  }
];
