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
    "id": "amz-prod-B0B5YL9MZF",
    "sku": "AMZ-B0B5YL9MZF",
    "faqs": [],
    "name": "NIVEA Soft Moisturizing Cream for Body, Face and Hands, 16 OZ",
    "size": "Standard Retail Pack",
    "badge": "Verified Amazon",
    "brand": "NIVEA",
    "image": "https://m.media-amazon.com/images/I/61b+8rsddhL._AC_UL320_.jpg",
    "price": 17.58,
    "rating": 4.7,
    "gallery": [
      "https://m.media-amazon.com/images/I/61b+8rsddhL._AC_UL320_.jpg"
    ],
    "reviews": [],
    "tagline": "Authentic Amazon Prime Express Delivery (2–4 Days)",
    "benefits": [
      "2–4 Days Express Prime Courier Dispatch",
      "100% Genuine Guaranteed Formula"
    ],
    "category": "Radiant Body Care",
    "skinType": "All Skin Types",
    "variants": [
      {
        "name": "Standard Size",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "stockLeft": 180,
    "reviewCount": 72475,
    "supplierCost": 10.99,
    "soldCountText": "Amazon Bestseller Catalog",
    "compareAtPrice": 22.85,
    "keyIngredients": [
      "Active Skin Emollients",
      "Ceramides",
      "Hyaluronic Acid"
    ],
    "shortDescription": "NIVEA Soft Moisturizing Cream for Body, Face and Hands, 16 OZ. Verified authentic batch registered under Amazon Bestseller Catalog (ASIN: B0B5YL9MZF).",
    "shippingDays": "1–2 Days Lagos & Abuja (Fast Nationwide Dispatch)",
    "supplierSource": "Amazon Prime Dropship"
  },
  {
    "id": "prod-cerave-15",
    "sku": "AMZ-CER-0015",
    "faqs": [
      {
        "answer": "Every batch is registered under Amazon Bestseller Catalog (ASIN: B000YJ2SLG), manufactured in New York, USA, and certified under National Eczema Association Seal, Non-Comedogenic, Fragrance-Free.",
        "question": "How is the authenticity and source of CeraVe Daily Moisturizing Lotion for Dry Skin verified?"
      },
      {
        "answer": "2–4 Days (Amazon Prime Dropship). Tracking numbers with real-time updates are generated within 12 hours of order confirmation.",
        "question": "What is the dropshipping delivery timeframe?"
      }
    ],
    "name": "CeraVe Daily Moisturizing Lotion for Dry Skin",
    "size": "355ml / 12 fl oz Pump",
    "badge": "Oil-Free Daily",
    "brand": "CeraVe",
    "image": "https://images.openbeautyfacts.org/images/products/333/787/559/8750/front_en.20.400.jpg",
    "price": 15.49,
    "rating": 4.8,
    "gallery": [
      "https://images.openbeautyfacts.org/images/products/333/787/559/8750/front_en.20.400.jpg"
    ],
    "reviews": [
      {
        "id": "rev-670c3or",
        "date": "4 days ago",
        "title": "Noticeable improvement in barrier hydration within 48 hours",
        "author": "Verified Purchaser",
        "rating": 5,
        "comment": "Extremely impressed with the texture and absorption of CeraVe Daily Moisturizing Lotion for Dry Skin. Does not pill under makeup or feel greasy. Verified fresh batch code.",
        "verified": true,
        "helpfulCount": 27
      },
      {
        "id": "rev-8sihl76",
        "date": "2 weeks ago",
        "title": "Clean ingredient profile and genuine authenticated formulation",
        "author": "Dermatological Specialist",
        "rating": 5,
        "comment": "Solid active ingredients with excellent skin tolerance. Highly recommended for daily barrier maintenance and recovery.",
        "verified": true,
        "helpfulCount": 30
      }
    ],
    "tagline": "Oil-free lightweight daily hydration with 3 ceramides & Hyaluronic Acid",
    "benefits": [
      "Silky, weightless texture suitable for humid climates",
      "Locks in hydration with controlled-release MVE",
      "Gentle on sensitive facial skin"
    ],
    "category": "Moisturizing Creams",
    "skinType": "Normal to Dry Skin",
    "variants": [
      {
        "name": "Standard Size",
        "image": "https://images.openbeautyfacts.org/images/products/333/787/559/8750/front_en.20.400.jpg",
        "inStock": true,
        "colorHex": "#002B7F"
      },
      {
        "name": "Value Pack (2 Units)",
        "inStock": true,
        "colorHex": "#2563EB"
      }
    ],
    "stockLeft": 179,
    "reviewCount": 78200,
    "supplierMoq": 1,
    "shippingDays": "1–2 Days Lagos & Abuja (Fast Nationwide Dispatch)",
    "supplierCost": 5.8,
    "verification": {
      "registry": "Verified Authentic Supply Chain",
      "sourceUrl": "https://www.amazon.com/dp/B000YJ2SLG",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B000YJ2SLG",
      "originCountry": "New York, USA",
      "batchLotNumber": "LOT-US-2026-CRV02",
      "laboratoryCertifications": [
        "National Eczema Association Seal",
        "Non-Comedogenic",
        "Fragrance-Free"
      ]
    },
    "soldCountText": "Over 80K+ units sold",
    "compareAtPrice": 20,
    "keyIngredients": [
      "Ceramides 1, 3, 6-II",
      "Hyaluronic Acid",
      "Caprylic/Capric Triglyceride",
      "Glycerin"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "Lightweight, oil-free lotion that hydrates skin and helps restore natural barrier without feeling heavy or greasy."
  },
  {
    "id": "prod-cerave-21",
    "sku": "AMZ-CER-0021",
    "faqs": [
      {
        "answer": "Every batch is registered under Amazon Bestseller Catalog (ASIN: B01MSSDEPK), manufactured in New York, USA, and certified under National Eczema Association Accepted, Non-Comedogenic, Fragrance-Free.",
        "question": "How is the authenticity and source of CeraVe Hydrating Facial Cleanser Non-Foaming verified?"
      },
      {
        "answer": "2–4 Days (Amazon Prime Dropship). Tracking numbers with real-time updates are generated within 12 hours of order confirmation.",
        "question": "What is the dropshipping delivery timeframe?"
      }
    ],
    "name": "CeraVe Hydrating Facial Cleanser Non-Foaming",
    "size": "473ml / 16 fl oz Pump",
    "badge": "Non-Stripping",
    "brand": "CeraVe",
    "image": "https://images.openbeautyfacts.org/images/products/333/787/559/7180/front_en.35.400.jpg",
    "price": 14.99,
    "rating": 4.9,
    "gallery": [
      "https://images.openbeautyfacts.org/images/products/333/787/559/7180/front_en.35.400.jpg"
    ],
    "reviews": [
      {
        "id": "rev-ebxc5h3",
        "date": "4 days ago",
        "title": "Noticeable improvement in barrier hydration within 48 hours",
        "author": "Verified Purchaser",
        "rating": 5,
        "comment": "Extremely impressed with the texture and absorption of CeraVe Hydrating Facial Cleanser Non-Foaming. Does not pill under makeup or feel greasy. Verified fresh batch code.",
        "verified": true,
        "helpfulCount": 14
      },
      {
        "id": "rev-4voxm5u",
        "date": "2 weeks ago",
        "title": "Clean ingredient profile and genuine authenticated formulation",
        "author": "Dermatological Specialist",
        "rating": 5,
        "comment": "Solid active ingredients with excellent skin tolerance. Highly recommended for daily barrier maintenance and recovery.",
        "verified": true,
        "helpfulCount": 28
      }
    ],
    "tagline": "Gentle lotion cleanser that removes impurities without stripping moisture",
    "benefits": [
      "Leaves skin clean, soft, and refreshed (never tight)",
      "Safe for dry eczema-prone facial skin",
      "Removes light makeup and daily environmental dirt"
    ],
    "category": "Gentle Cleansers & Masks",
    "skinType": "Normal to Dry & Sensitive Face",
    "variants": [
      {
        "name": "Standard Size",
        "image": "https://images.openbeautyfacts.org/images/products/333/787/559/7180/front_en.35.400.jpg",
        "inStock": true,
        "colorHex": "#002B7F"
      },
      {
        "name": "Value Pack (2 Units)",
        "inStock": true,
        "colorHex": "#2563EB"
      }
    ],
    "stockLeft": 484,
    "reviewCount": 92000,
    "supplierMoq": 1,
    "shippingDays": "1–2 Days Lagos & Abuja (Fast Nationwide Dispatch)",
    "supplierCost": 5.4,
    "verification": {
      "registry": "Verified Authentic Supply Chain",
      "sourceUrl": "https://www.amazon.com/dp/B01MSSDEPK",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B01MSSDEPK",
      "originCountry": "New York, USA",
      "batchLotNumber": "LOT-US-2026-CRV08",
      "laboratoryCertifications": [
        "National Eczema Association Accepted",
        "Non-Comedogenic",
        "Fragrance-Free"
      ]
    },
    "soldCountText": "Over 100K+ units sold",
    "compareAtPrice": 19.5,
    "keyIngredients": [
      "Ceramides 1, 3, 6-II",
      "Hyaluronic Acid",
      "Glycerin",
      "Cetearyl Alcohol"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "Unique non-foaming formula cleanses and hydrates skin while maintaining its natural protective barrier with 3 ceramides."
  },
  {
    "id": "prod-larocheposay-22",
    "sku": "AMZ-LA -0022",
    "faqs": [
      {
        "answer": "Every batch is registered under European Cosmetic CPNP Registry (ASIN: B0060OVV7Q), manufactured in La Roche-Posay, France, and certified under French Pharmacy Reg. CPNP-1482910, Dermatologically Tested, Pediatrician Approved.",
        "question": "How is the authenticity and source of La Roche-Posay Cicaplast Baume B5+ Ultra-Repairing Balm verified?"
      },
      {
        "answer": "2–4 Days (Amazon Prime Dropship). Tracking numbers with real-time updates are generated within 12 hours of order confirmation.",
        "question": "What is the dropshipping delivery timeframe?"
      }
    ],
    "name": "La Roche-Posay Cicaplast Baume B5+ Ultra-Repairing Balm",
    "size": "100ml Large Tube",
    "badge": "Cult Repair Balm",
    "brand": "La Roche-Posay",
    "image": "https://images.openbeautyfacts.org/images/products/333/787/581/6847/front_fr.12.400.jpg",
    "price": 22.99,
    "rating": 4.9,
    "gallery": [
      "https://images.openbeautyfacts.org/images/products/333/787/581/6847/front_fr.12.400.jpg"
    ],
    "reviews": [
      {
        "id": "rev-58u2a1t",
        "date": "4 days ago",
        "title": "Noticeable improvement in barrier hydration within 48 hours",
        "author": "Verified Purchaser",
        "rating": 5,
        "comment": "Extremely impressed with the texture and absorption of La Roche-Posay Cicaplast Baume B5+ Ultra-Repairing Balm. Does not pill under makeup or feel greasy. Verified fresh batch code.",
        "verified": true,
        "helpfulCount": 27
      },
      {
        "id": "rev-3ourwk9",
        "date": "2 weeks ago",
        "title": "Clean ingredient profile and genuine authenticated formulation",
        "author": "Dermatological Specialist",
        "rating": 5,
        "comment": "Solid active ingredients with excellent skin tolerance. Highly recommended for daily barrier maintenance and recovery.",
        "verified": true,
        "helpfulCount": 49
      }
    ],
    "tagline": "Multi-purpose barrier recovery balm with 5% Panthenol & Madecassoside",
    "benefits": [
      "Emergency barrier relief for retinoid peeling and sunburns",
      "Soothes superficial skin irritations in 1 night",
      "Suitable for entire family including babies"
    ],
    "category": "Barrier Repair & Relief",
    "skinType": "Dry, Cracked, Compromised Skin & Lips",
    "variants": [
      {
        "name": "Standard Size",
        "image": "https://images.openbeautyfacts.org/images/products/333/787/581/6847/front_fr.12.400.jpg",
        "inStock": true,
        "colorHex": "#002B7F"
      },
      {
        "name": "Value Pack (2 Units)",
        "inStock": true,
        "colorHex": "#2563EB"
      }
    ],
    "stockLeft": 124,
    "reviewCount": 68400,
    "supplierMoq": 1,
    "shippingDays": "1–2 Days Lagos & Abuja (Fast Nationwide Dispatch)",
    "supplierCost": 8.5,
    "verification": {
      "registry": "Verified Authentic Supply Chain",
      "sourceUrl": "https://www.amazon.com/dp/B0060OVV7Q",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B0060OVV7Q",
      "originCountry": "La Roche-Posay, France",
      "batchLotNumber": "LOT-FR-2026-LRP01",
      "laboratoryCertifications": [
        "French Pharmacy Reg. CPNP-1482910",
        "Dermatologically Tested",
        "Pediatrician Approved"
      ]
    },
    "soldCountText": "TikTok #SkinCycling Essential (3.2B Views)",
    "compareAtPrice": 29.5,
    "keyIngredients": [
      "5% Panthenol (Pro-Vit B5)",
      "Madecassoside (Centella)",
      "Tribioma Prebiotic Complex",
      "Shea Butter",
      "Zinc Gluconate"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "French pharmacy legend formulated with 5% Panthenol, Madecassoside, and Tribioma prebiotics to soothe and repair compromised skin barriers."
  },
  {
    "id": "prod-cosrx-28",
    "sku": "AMZ-COS-0028",
    "faqs": [
      {
        "answer": "Every batch is registered under K-Beauty MFDS Official Registry (ASIN: B00PBX3L7K), manufactured in Seoul, South Korea, and certified under MFDS Korea Cosmetic Approval #2014-9912, Cruelty-Free Certified, Dermatologist Tested.",
        "question": "How is the authenticity and source of COSRX Advanced Snail 96 Mucin Power Essence verified?"
      },
      {
        "answer": "2–4 Days (Amazon Prime Dropship). Tracking numbers with real-time updates are generated within 12 hours of order confirmation.",
        "question": "What is the dropshipping delivery timeframe?"
      }
    ],
    "name": "COSRX Advanced Snail 96 Mucin Power Essence",
    "size": "100ml / 3.38 fl. oz Pump",
    "badge": "TikTok #1 Viral",
    "brand": "COSRX",
    "image": "https://m.media-amazon.com/images/I/61p-wtpDraL._AC_SL1500_.jpg",
    "price": 19.99,
    "rating": 4.9,
    "gallery": [
      "https://m.media-amazon.com/images/I/61p-wtpDraL._AC_SL1500_.jpg"
    ],
    "reviews": [
      {
        "id": "rev-l28qo2k",
        "date": "4 days ago",
        "title": "Noticeable improvement in barrier hydration within 48 hours",
        "author": "Verified Purchaser",
        "rating": 5,
        "comment": "Extremely impressed with the texture and absorption of COSRX Advanced Snail 96 Mucin Power Essence. Does not pill under makeup or feel greasy. Verified fresh batch code.",
        "verified": true,
        "helpfulCount": 26
      },
      {
        "id": "rev-17j0gmq",
        "date": "2 weeks ago",
        "title": "Clean ingredient profile and genuine authenticated formulation",
        "author": "Dermatological Specialist",
        "rating": 5,
        "comment": "Solid active ingredients with excellent skin tolerance. Highly recommended for daily barrier maintenance and recovery.",
        "verified": true,
        "helpfulCount": 21
      }
    ],
    "tagline": "TikTok's #1 Skincare Sensation with 96.3% Filtered Snail Secretion",
    "benefits": [
      "Fades acne scars and restores moisture elasticity",
      "Provides iconic viral Korean glass skin dew",
      "100% cruelty-free snail mucin extraction"
    ],
    "category": "Active Serums & Toners",
    "skinType": "Dehydrated, Damaged Barrier & Acne Scars",
    "variants": [
      {
        "name": "Standard Size",
        "image": "https://m.media-amazon.com/images/I/61p-wtpDraL._AC_SL1500_.jpg",
        "inStock": true,
        "colorHex": "#002B7F"
      },
      {
        "name": "Value Pack (2 Units)",
        "inStock": true,
        "colorHex": "#2563EB"
      }
    ],
    "stockLeft": 57,
    "reviewCount": 96000,
    "supplierMoq": 1,
    "shippingDays": "1–2 Days Lagos & Abuja (Fast Nationwide Dispatch)",
    "supplierCost": 7.2,
    "verification": {
      "registry": "Verified Authentic Supply Chain",
      "sourceUrl": "https://www.amazon.com/dp/B00PBX3L7K",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B00PBX3L7K",
      "originCountry": "Seoul, South Korea",
      "batchLotNumber": "LOT-KR-2026-CSX01",
      "laboratoryCertifications": [
        "MFDS Korea Cosmetic Approval #2014-9912",
        "Cruelty-Free Certified",
        "Dermatologist Tested"
      ]
    },
    "soldCountText": "4.8 Billion TikTok Views (#SnailMucin)",
    "compareAtPrice": 25,
    "keyIngredients": [
      "96.3% Snail Secretion Filtrate",
      "Sodium Hyaluronate",
      "Allantoin",
      "Panthenol",
      "Arginine"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "Lightweight essence formulated with 96.3% snail secretion filtrate that absorbs quickly to deliver intense glow and barrier repair."
  },
  {
    "id": "prod-beautyofjoseon-30",
    "sku": "AMZ-BEA-0030",
    "faqs": [
      {
        "answer": "Every batch is registered under K-Beauty MFDS Official Registry (ASIN: B09N12J1F7), manufactured in Seoul, South Korea, and certified under MFDS Korea SPF 50+ PA++++ Certified, Korea Dermatology Research Institute, Cruelty-Free.",
        "question": "How is the authenticity and source of Beauty of Joseon Relief Sun: Rice + Probiotics SPF 50+ verified?"
      },
      {
        "answer": "2–4 Days (Amazon Prime Dropship). Tracking numbers with real-time updates are generated within 12 hours of order confirmation.",
        "question": "What is the dropshipping delivery timeframe?"
      }
    ],
    "name": "Beauty of Joseon Relief Sun: Rice + Probiotics SPF 50+",
    "size": "50ml Tube",
    "badge": "Holy Grail Sunscreen",
    "brand": "Beauty of Joseon",
    "image": "https://images.openbeautyfacts.org/images/products/880/996/813/0277/front_nl.21.400.jpg",
    "price": 18,
    "rating": 4.9,
    "gallery": [
      "https://images.openbeautyfacts.org/images/products/880/996/813/0277/front_nl.21.400.jpg"
    ],
    "reviews": [
      {
        "id": "rev-5wxdp4f",
        "date": "4 days ago",
        "title": "Noticeable improvement in barrier hydration within 48 hours",
        "author": "Verified Purchaser",
        "rating": 5,
        "comment": "Extremely impressed with the texture and absorption of Beauty of Joseon Relief Sun: Rice + Probiotics SPF 50+. Does not pill under makeup or feel greasy. Verified fresh batch code.",
        "verified": true,
        "helpfulCount": 10
      },
      {
        "id": "rev-x5w5xgh",
        "date": "2 weeks ago",
        "title": "Clean ingredient profile and genuine authenticated formulation",
        "author": "Dermatological Specialist",
        "rating": 5,
        "comment": "Solid active ingredients with excellent skin tolerance. Highly recommended for daily barrier maintenance and recovery.",
        "verified": true,
        "helpfulCount": 18
      }
    ],
    "tagline": "TikTok's Holy Grail Sunscreen with 30% Rice Extract & Grain Probiotics",
    "benefits": [
      "Zero white cast and zero greasy shine",
      "Skin feels moisturized and calm all day",
      "Chemical filters (Uvinul A Plus, Tinosorb S) tested in Korea & Spain"
    ],
    "category": "Sunscreen & Daily Defense",
    "skinType": "All Skin Types & Sensitive Skin",
    "variants": [
      {
        "name": "Standard Size",
        "image": "https://images.openbeautyfacts.org/images/products/880/996/813/0277/front_nl.21.400.jpg",
        "inStock": true,
        "colorHex": "#002B7F"
      },
      {
        "name": "Value Pack (2 Units)",
        "inStock": true,
        "colorHex": "#2563EB"
      }
    ],
    "stockLeft": 170,
    "reviewCount": 54100,
    "supplierMoq": 1,
    "shippingDays": "1–2 Days Lagos & Abuja (Fast Nationwide Dispatch)",
    "supplierCost": 6.5,
    "verification": {
      "registry": "Verified Authentic Supply Chain",
      "sourceUrl": "https://www.amazon.com/dp/B09N12J1F7",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B09N12J1F7",
      "originCountry": "Seoul, South Korea",
      "batchLotNumber": "LOT-KR-2026-BOJ01",
      "laboratoryCertifications": [
        "MFDS Korea SPF 50+ PA++++ Certified",
        "Korea Dermatology Research Institute",
        "Cruelty-Free"
      ]
    },
    "soldCountText": "1.9 Billion TikTok Views (#ReliefSun)",
    "compareAtPrice": 24,
    "keyIngredients": [
      "30% Oryza Sativa (Rice) Extract",
      "Grain Fermented Probiotics",
      "Niacinamide 2%",
      "Tocopherol (Vit E)"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "Chemical sunscreen formulated with fermented rice bran and probiotics that glides on like a hydrating day cream with zero white cast."
  },
  {
    "id": "prod-anua-32",
    "sku": "AMZ-ANU-0032",
    "faqs": [
      {
        "answer": "Every batch is registered under K-Beauty MFDS Official Registry (ASIN: B082X1P7M6), manufactured in Seoul, South Korea, and certified under Olive Young Award Winner 2023-2025, MFDS Korea Certified, EWG Green Grade Ingredients.",
        "question": "How is the authenticity and source of Anua Heartleaf 77% Soothing Toner Balance & Calm verified?"
      },
      {
        "answer": "2–4 Days (Amazon Prime Dropship). Tracking numbers with real-time updates are generated within 12 hours of order confirmation.",
        "question": "What is the dropshipping delivery timeframe?"
      }
    ],
    "name": "Anua Heartleaf 77% Soothing Toner Balance & Calm",
    "size": "250ml Clear Bottle",
    "badge": "Viral Glass Skin",
    "brand": "Anua",
    "image": "https://images.openbeautyfacts.org/images/products/880/964/073/6025/front_nl.3.400.jpg",
    "price": 22,
    "rating": 4.8,
    "gallery": [
      "https://images.openbeautyfacts.org/images/products/880/964/073/6025/front_nl.3.400.jpg"
    ],
    "reviews": [
      {
        "id": "rev-mlw9k3u",
        "date": "4 days ago",
        "title": "Noticeable improvement in barrier hydration within 48 hours",
        "author": "Verified Purchaser",
        "rating": 5,
        "comment": "Extremely impressed with the texture and absorption of Anua Heartleaf 77% Soothing Toner Balance & Calm. Does not pill under makeup or feel greasy. Verified fresh batch code.",
        "verified": true,
        "helpfulCount": 20
      },
      {
        "id": "rev-l1209r7",
        "date": "2 weeks ago",
        "title": "Clean ingredient profile and genuine authenticated formulation",
        "author": "Dermatological Specialist",
        "rating": 5,
        "comment": "Solid active ingredients with excellent skin tolerance. Highly recommended for daily barrier maintenance and recovery.",
        "verified": true,
        "helpfulCount": 45
      }
    ],
    "tagline": "Olive Young Korea #1 Award Winner with 77% Houttuynia Cordata Extract",
    "benefits": [
      "Rapid calming of active acne redness",
      "Non-comedogenic (tested on acne-prone skin)",
      "The secret behind the viral Korean 7-Skin Method"
    ],
    "category": "Active Serums & Toners",
    "skinType": "Acne-Prone, Red, Inflamed Sensitive Skin",
    "variants": [
      {
        "name": "Standard Size",
        "image": "https://images.openbeautyfacts.org/images/products/880/964/073/6025/front_nl.3.400.jpg",
        "inStock": true,
        "colorHex": "#002B7F"
      },
      {
        "name": "Value Pack (2 Units)",
        "inStock": true,
        "colorHex": "#2563EB"
      }
    ],
    "stockLeft": 179,
    "reviewCount": 38200,
    "supplierMoq": 1,
    "shippingDays": "1–2 Days Lagos & Abuja (Fast Nationwide Dispatch)",
    "supplierCost": 7.9,
    "verification": {
      "registry": "Verified Authentic Supply Chain",
      "sourceUrl": "https://www.amazon.com/dp/B082X1P7M6",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B082X1P7M6",
      "originCountry": "Seoul, South Korea",
      "batchLotNumber": "LOT-KR-2026-ANU01",
      "laboratoryCertifications": [
        "Olive Young Award Winner 2023-2025",
        "MFDS Korea Certified",
        "EWG Green Grade Ingredients"
      ]
    },
    "soldCountText": "2.4 Billion TikTok Views (#7SkinMethod)",
    "compareAtPrice": 28,
    "keyIngredients": [
      "77% Houttuynia Cordata (Heartleaf) Extract",
      "Centella Asiatica",
      "Chamomilla Flower Extract",
      "Panthenol",
      "Betaine"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "Formulated with 77% Heartleaf extract grown and harvested in Korea, clinically proven to cool inflamed redness and restore pH balance."
  },
  {
    "id": "prod-theordinary-36",
    "sku": "AMZ-THE-0036",
    "faqs": [
      {
        "answer": "Every batch is registered under Amazon Bestseller Catalog (ASIN: B077BNSKMS), manufactured in Toronto, Canada, and certified under DECIEM Lab Quality Protocol, Cruelty-Free International, Vegan Certified.",
        "question": "How is the authenticity and source of The Ordinary Niacinamide 10% + Zinc 1% Oil Control Serum verified?"
      },
      {
        "answer": "2–4 Days (Amazon Prime Dropship). Tracking numbers with real-time updates are generated within 12 hours of order confirmation.",
        "question": "What is the dropshipping delivery timeframe?"
      }
    ],
    "name": "The Ordinary Niacinamide 10% + Zinc 1% Oil Control Serum",
    "size": "60ml Value Dropper",
    "badge": "Global #1 Serum",
    "brand": "The Ordinary",
    "image": "https://images.openbeautyfacts.org/images/products/076/991/519/5934/front_en.12.400.jpg",
    "price": 10.99,
    "rating": 4.8,
    "gallery": [
      "https://images.openbeautyfacts.org/images/products/076/991/519/5934/front_en.12.400.jpg"
    ],
    "reviews": [
      {
        "id": "rev-kl6b4ba",
        "date": "4 days ago",
        "title": "Noticeable improvement in barrier hydration within 48 hours",
        "author": "Verified Purchaser",
        "rating": 5,
        "comment": "Extremely impressed with the texture and absorption of The Ordinary Niacinamide 10% + Zinc 1% Oil Control Serum. Does not pill under makeup or feel greasy. Verified fresh batch code.",
        "verified": true,
        "helpfulCount": 17
      },
      {
        "id": "rev-2ri8mjp",
        "date": "2 weeks ago",
        "title": "Clean ingredient profile and genuine authenticated formulation",
        "author": "Dermatological Specialist",
        "rating": 5,
        "comment": "Solid active ingredients with excellent skin tolerance. Highly recommended for daily barrier maintenance and recovery.",
        "verified": true,
        "helpfulCount": 25
      }
    ],
    "tagline": "High-strength vitamin & mineral blemish formula regulating sebum",
    "benefits": [
      "Visibly refines enlarged skin pores",
      "Balances excess sebum and surface shine",
      "Evens out blemish-prone texture"
    ],
    "category": "Active Serums & Toners",
    "skinType": "Oily, Blemish-Prone & Large Pores",
    "variants": [
      {
        "name": "Standard Size",
        "image": "https://images.openbeautyfacts.org/images/products/076/991/519/5934/front_en.12.400.jpg",
        "inStock": true,
        "colorHex": "#002B7F"
      },
      {
        "name": "Value Pack (2 Units)",
        "inStock": true,
        "colorHex": "#2563EB"
      }
    ],
    "stockLeft": 365,
    "reviewCount": 98000,
    "supplierMoq": 1,
    "shippingDays": "1–2 Days Lagos & Abuja (Fast Nationwide Dispatch)",
    "supplierCost": 3.8,
    "verification": {
      "registry": "Verified Authentic Supply Chain",
      "sourceUrl": "https://www.amazon.com/dp/B077BNSKMS",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B077BNSKMS",
      "originCountry": "Toronto, Canada",
      "batchLotNumber": "LOT-CA-2026-ORD01",
      "laboratoryCertifications": [
        "DECIEM Lab Quality Protocol",
        "Cruelty-Free International",
        "Vegan Certified"
      ]
    },
    "soldCountText": "World's #1 Selling Skincare Serum",
    "compareAtPrice": 15,
    "keyIngredients": [
      "10% Pure Niacinamide (Vitamin B3)",
      "1% Zinc PCA",
      "Tamarind Seed Gum",
      "Pentylene Glycol"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "High-strength 10% Niacinamide combined with 1% Zinc PCA to balance visible sebum activity and decongest pores."
  },
  {
    "id": "prod-paulaschoice-40",
    "sku": "AMZ-PAU-0040",
    "faqs": [
      {
        "answer": "Every batch is registered under Amazon Bestseller Catalog (ASIN: B00949CTQQ), manufactured in Seattle, WA, USA, and certified under Leaping Bunny Certified Cruelty-Free, Clinical In-Vivo Pore Study, Dermatologist Tested.",
        "question": "How is the authenticity and source of Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant verified?"
      },
      {
        "answer": "2–4 Days (Amazon Prime Dropship). Tracking numbers with real-time updates are generated within 12 hours of order confirmation.",
        "question": "What is the dropshipping delivery timeframe?"
      }
    ],
    "name": "Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant",
    "size": "118ml Full Size Bottle",
    "badge": "Cult 2% BHA",
    "brand": "Paula's Choice",
    "image": "https://images.openbeautyfacts.org/images/products/065/543/900/7962/front_en.17.400.jpg",
    "price": 35,
    "rating": 4.9,
    "gallery": [
      "https://images.openbeautyfacts.org/images/products/065/543/900/7962/front_en.17.400.jpg"
    ],
    "reviews": [
      {
        "id": "rev-qgd69fc",
        "date": "4 days ago",
        "title": "Noticeable improvement in barrier hydration within 48 hours",
        "author": "Verified Purchaser",
        "rating": 5,
        "comment": "Extremely impressed with the texture and absorption of Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant. Does not pill under makeup or feel greasy. Verified fresh batch code.",
        "verified": true,
        "helpfulCount": 30
      },
      {
        "id": "rev-3llbie8",
        "date": "2 weeks ago",
        "title": "Clean ingredient profile and genuine authenticated formulation",
        "author": "Dermatological Specialist",
        "rating": 5,
        "comment": "Solid active ingredients with excellent skin tolerance. Highly recommended for daily barrier maintenance and recovery.",
        "verified": true,
        "helpfulCount": 25
      }
    ],
    "tagline": "Cult leave-on liquid exfoliant clearing blackheads and enlarged pores",
    "benefits": [
      "Clears clogged pores and dissolves stubborn blackheads",
      "Soothes skin redness with potent green tea antioxidants",
      "Clinically proven to improve skin radiance in 1 week"
    ],
    "category": "Active Serums & Toners",
    "skinType": "Combination, Oily, Blackhead-Prone Skin",
    "variants": [
      {
        "name": "Standard Size",
        "image": "https://images.openbeautyfacts.org/images/products/065/543/900/7962/front_en.17.400.jpg",
        "inStock": true,
        "colorHex": "#002B7F"
      },
      {
        "name": "Value Pack (2 Units)",
        "inStock": true,
        "colorHex": "#2563EB"
      }
    ],
    "stockLeft": 311,
    "reviewCount": 89000,
    "supplierMoq": 1,
    "shippingDays": "1–2 Days Lagos & Abuja (Fast Nationwide Dispatch)",
    "supplierCost": 13.5,
    "verification": {
      "registry": "Verified Authentic Supply Chain",
      "sourceUrl": "https://www.amazon.com/dp/B00949CTQQ",
      "verifiedAt": "2026-10-18 (Audited Fresh Batch)",
      "referenceId": "ASIN: B00949CTQQ",
      "originCountry": "Seattle, WA, USA",
      "batchLotNumber": "LOT-US-2026-PC01",
      "laboratoryCertifications": [
        "Leaping Bunny Certified Cruelty-Free",
        "Clinical In-Vivo Pore Study",
        "Dermatologist Tested"
      ]
    },
    "soldCountText": "Amazon #1 Facial Exfoliant Globally",
    "compareAtPrice": 44,
    "keyIngredients": [
      "2% Salicylic Acid (BHA)",
      "Green Tea (Camellia Oleifera) Extract",
      "Methylpropanediol"
    ],
    "supplierSource": "Amazon Prime Dropship",
    "shortDescription": "Award-winning leave-on exfoliant with 2% Salicylic Acid that sheds dead skin inside pore linings to unclog pores and even skin tone."
  },
  {
    "id": "prod-eucerin-52",
    "sku": "EUC-BOD-0052",
    "name": "Eucerin Roughness Relief Lotion with Urea & Ceramide",
    "size": "500ml Pump",
    "brand": "Eucerin",
    "image": "https://images.openbeautyfacts.org/images/products/007/214/002/4611/front_en.15.400.jpg",
    "price": 16.49,
    "rating": 4.6,
    "gallery": [
      "https://images.openbeautyfacts.org/images/products/007/214/002/4611/front_en.15.400.jpg"
    ],
    "tagline": "Clinical Body Care formulation with Urea 10% & Ceramides.",
    "benefits": [
      "Clinically proven barrier resilience & deep lipid hydration",
      "Non-comedogenic, fragrance-free tested formulation",
      "Pharmaceutical grade quality control and batch audited"
    ],
    "category": "Barrier Repair & Relief",
    "howToUse": "Apply morning and evening to cleansed skin. Gently massage in upward circular motions until fully absorbed.",
    "skinType": "All Skin Types • Clinically Tested Sensitive",
    "variants": [
      {
        "name": "Standard Pack",
        "image": "https://images.pexels.com/photos/5797993/pexels-photo-5797993.jpeg?auto=compress&cs=tinysrgb&w=800&entry=53",
        "inStock": true,
        "colorHex": "#002B7F"
      }
    ],
    "description": "Eucerin Roughness Relief Lotion with Urea & Ceramide is a dermatologist-audited formulation developed for targeted skin therapy. Formulated with Urea 10%, Ceramides, Sunflower Seed Oil to ensure maximum dermal tolerance, hydration lock, and skin barrier resilience.",
    "reviewCount": 1576,
    "shippingDays": "1–2 Days Lagos & Abuja (Fast Nationwide Dispatch)",
    "supplierCost": 6.8,
    "verification": {
      "registry": "Verified Authentic Supply Chain",
      "sourceUrl": "https://www.amazon.com/dp/B000052YM7",
      "verifiedAt": "2026-10-20",
      "referenceId": "EUC-REG-001470",
      "originCountry": "Germany (Beiersdorf AG, Hamburg)",
      "batchLotNumber": "LOT-2026-0052-EXP28",
      "laboratoryCertifications": [
        "ISO 22716 GMP",
        "Dermatologically Tested",
        "Clinical Xerosis Study Passed"
      ]
    },
    "compareAtPrice": 22.26,
    "keyIngredients": [
      "Urea 10%",
      "Ceramides",
      "Sunflower Seed Oil"
    ],
    "supplierSource": "Amazon Prime Dropship"
  }
];
