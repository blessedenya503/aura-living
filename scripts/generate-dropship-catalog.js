const fs = require("fs");
const path = require("path");

const DB_FILE_PATH = path.join(__dirname, "..", "src", "data", "store-db.json");

// Curated high-resolution Unsplash beauty & skincare photography URLs
const SKINCARE_IMAGES = [
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1608248597359-001099e0fbfa?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1567928815104-b798b750c778?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1512290900672-1f55b9e075c3?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1629732047847-50219e9c5aef?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1000&auto=format&fit=crop"
];

// Existing base verified products to preserve
let existingDb = { products: [], orders: [], settings: {} };
if (fs.existsSync(DB_FILE_PATH)) {
  try {
    existingDb = JSON.parse(fs.readFileSync(DB_FILE_PATH, "utf-8"));
  } catch (err) {
    console.error("Error reading existing DB:", err);
  }
}

const baseProducts = (existingDb.products || []).slice(0, 26);

// Master Definition of Real Skincare Products from Amazon & Alibaba
const AMAZON_BRANDS_CATALOG = [
  {
    brand: "NIVEA",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00NIV",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "NIVEA Creme Classic Intensive Hydration Tin", basePrice: 8.99, baseCost: 3.1, size: "250ml", badge: "Iconic Heritage", ing: ["Eucerit®", "Panthenol (B5)", "Glycerin", "Lanolin Alcohol"] },
          { name: "NIVEA Soft Light Refreshing Moisturizing Cream", basePrice: 7.99, baseCost: 2.8, size: "200ml", badge: "Fast Absorbing", ing: ["Jojoba Oil", "Vitamin E", "Stearic Acid", "Glycerin"] },
          { name: "NIVEA Repair & Care 72H Deep Moisture Cream", basePrice: 11.99, baseCost: 4.2, size: "400ml", badge: "Dermatologist Tested", ing: ["Dexpanthenol", "Deep Moisture Serum", "Ceramide NP"] },
          { name: "NIVEA Cocoa Butter Body Cream 48H Hydration", basePrice: 9.99, baseCost: 3.4, size: "400ml", badge: "Radiant Skin", ing: ["Pure Cocoa Butter", "Vitamin E", "NIVEA Deep Moisture Serum"] },
          { name: "NIVEA Naturally Good Organic Aloe Day Cream", basePrice: 12.49, baseCost: 4.5, size: "50ml", badge: "99% Natural", ing: ["Bio Aloe Vera", "Jojoba Oil", "Almond Oil"] },
          { name: "NIVEA Men Maximum Hydration Protective Cream", basePrice: 8.49, baseCost: 3.0, size: "150ml", badge: "Men's Choice", ing: ["Aloe Vera", "Pro-Vitamin B5", "Vitamin E"] },
          { name: "NIVEA Sensitive Soothing Hydro Cream", basePrice: 10.99, baseCost: 3.8, size: "100ml", badge: "0% Alcohol", ing: ["Chamomile Extract", "Witch Hazel", "Vitamin E"] }
        ]
      },
      {
        cat: "Anti-Aging & Q10",
        items: [
          { name: "NIVEA Q10 Power Anti-Wrinkle Day Cream SPF 15", basePrice: 16.99, baseCost: 6.2, size: "50ml", badge: "Amazon Bestseller", ing: ["Pure Coenzyme Q10", "Creatine", "SPF 15 Filters", "Hyaluronic Acid"] },
          { name: "NIVEA Q10 Power Extra Nourishing Night Cream", basePrice: 17.99, baseCost: 6.5, size: "50ml", badge: "Cellular Renewal", ing: ["Dual Action Q10", "Organic Argan Oil", "Squalane"] },
          { name: "NIVEA Cellular Luminous630 Dark-Spot Advanced Serum", basePrice: 29.99, baseCost: 11.5, size: "30ml", badge: "Breakthrough Active", ing: ["Patented Luminous630®", "Hyaluronic Acid", "Vitamin E"] },
          { name: "NIVEA Cellular Luminous630 Anti-Spot Day Fluid SPF 50", basePrice: 26.99, baseCost: 9.8, size: "40ml", badge: "Max UV Protection", ing: ["Luminous630®", "SPF 50 UVA/UVB", "Cell-Activating HA"] },
          { name: "NIVEA Hyaluron Cellular Filler Tightening Day Cream", basePrice: 21.99, baseCost: 7.9, size: "50ml", badge: "Collagen Booster", ing: ["Micro Hyaluronic Acid", "Collagen Booster", "Creatine"] }
        ]
      },
      {
        cat: "Radiant Body Care",
        items: [
          { name: "NIVEA Radiant & Beauty Advanced Care 48H Cream", basePrice: 12.99, baseCost: 4.5, size: "400ml", badge: "Melanin Rich Care", ing: ["5 Natural Oils (Almond, Jojoba, Soybean, Avocado, Macadamia)", "Pure Glycerin"] },
          { name: "NIVEA Radiant & Beauty Even Glow Body Lotion", basePrice: 13.99, baseCost: 4.9, size: "400ml", badge: "95% Pure Pearl Extract", ing: ["Pearl Extract", "Vitamin C", "SPF 15 Filters"] },
          { name: "NIVEA Q10 Firming + Bronze Body Lotion", basePrice: 14.49, baseCost: 5.1, size: "400ml", badge: "Gradual Sun-Kissed", ing: ["Coenzyme Q10", "Gradual Glow Complex"] }
        ]
      },
      {
        cat: "Sunscreen & Daily Defense",
        items: [
          { name: "NIVEA Sun Protect & Moisture Sun Lotion SPF 50+", basePrice: 18.99, baseCost: 6.8, size: "200ml", badge: "Water Resistant", ing: ["Broad Spectrum SPF 50+", "Vitamin E", "Panthenol"] },
          { name: "NIVEA Sun UV Face Shine Control Cream SPF 50", basePrice: 16.49, baseCost: 5.9, size: "50ml", badge: "Matte Finish", ing: ["Licorice Extract", "Silica Microspheres", "UVA/UVB Filters"] }
        ]
      }
    ]
  },
  {
    brand: "CeraVe",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00CRV",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "CeraVe Moisturizing Cream with 3 Essential Ceramides", basePrice: 17.99, baseCost: 6.9, size: "453g / 16 oz", badge: "Amazon #1 Best Seller", ing: ["Ceramide NP", "Ceramide AP", "Ceramide EOP", "Hyaluronic Acid", "MVE Delivery"] },
          { name: "CeraVe Daily Moisturizing Lotion for Dry Skin", basePrice: 15.49, baseCost: 5.8, size: "355ml", badge: "Oil-Free", ing: ["Ceramides 1, 3, 6-II", "Hyaluronic Acid", "Glycerin"] },
          { name: "CeraVe SA Cream for Rough & Bumpy Skin", basePrice: 19.99, baseCost: 7.5, size: "340g", badge: "Salicylic & Urea", ing: ["Salicylic Acid", "Lactic Acid", "10% Urea", "Ceramides 1, 3, 6-II"] },
          { name: "CeraVe Healing Ointment for Cracked Dry Skin", basePrice: 18.49, baseCost: 6.8, size: "340g", badge: "National Eczema Seal", ing: ["46.5% Petrolatum", "Hyaluronic Acid", "Ceramides"] }
        ]
      },
      {
        cat: "Barrier Repair & Relief",
        items: [
          { name: "CeraVe PM Facial Moisturizing Lotion with Niacinamide", basePrice: 16.99, baseCost: 6.2, size: "89ml", badge: "Dermatologist Loved", ing: ["4% Niacinamide", "3 Essential Ceramides", "Hyaluronic Acid"] },
          { name: "CeraVe Skin Renewing Night Cream Peptides Complex", basePrice: 22.49, baseCost: 8.4, size: "48g", badge: "Biomimetic Peptides", ing: ["Biomimetic Peptides", "Niacinamide", "Ceramides"] }
        ]
      },
      {
        cat: "Active Serums & Toners",
        items: [
          { name: "CeraVe Resurfacing Retinol Serum Post-Acne Marks", basePrice: 21.99, baseCost: 7.9, size: "30ml", badge: "Encapsulated Retinol", ing: ["Encapsulated Retinol", "Licorice Root Extract", "Niacinamide", "Ceramides"] },
          { name: "CeraVe Skin Renewing Vitamin C Serum 10% Pure L-Ascorbic", basePrice: 24.99, baseCost: 9.2, size: "30ml", badge: "10% Pure Vit C", ing: ["10% L-Ascorbic Acid", "Vitamin B5", "Ceramides"] }
        ]
      },
      {
        cat: "Gentle Cleansers & Masks",
        items: [
          { name: "CeraVe Hydrating Facial Cleanser Non-Foaming", basePrice: 14.99, baseCost: 5.4, size: "473ml", badge: "Non-Stripping", ing: ["Ceramides", "Hyaluronic Acid", "Glycerin"] },
          { name: "CeraVe Renewing SA Cleanser Salicylic Acid Wash", basePrice: 15.99, baseCost: 5.8, size: "237ml", badge: "Pore Smoothing", ing: ["Salicylic Acid", "Niacinamide", "Gluconolactone", "Ceramides"] }
        ]
      }
    ]
  },
  {
    brand: "La Roche-Posay",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00LRP",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Barrier Repair & Relief",
        items: [
          { name: "La Roche-Posay Cicaplast Baume B5+ Ultra-Repairing Balm", basePrice: 22.99, baseCost: 8.5, size: "100ml", badge: "Cult Multi-Repair", ing: ["5% Panthenol", "Madecassoside", "Tribioma Prebiotics", "Shea Butter"] },
          { name: "La Roche-Posay Lipikar Balm AP+M Triple Repair Cream", basePrice: 24.99, baseCost: 9.2, size: "400ml", badge: "Microbiome Science", ing: ["Aqua Posae Filiformis", "Microresyl", "20% Shea Butter", "Niacinamide"] },
          { name: "La Roche-Posay Toleriane Dermallergo Soothing Cream", basePrice: 26.49, baseCost: 9.8, size: "40ml", badge: "Anti-Redness", ing: ["Sphingobioma", "Neurosensine", "Thermal Spring Water"] }
        ]
      },
      {
        cat: "Sunscreen & Daily Defense",
        items: [
          { name: "La Roche-Posay Anthelios UVMune 400 Invisible Fluid SPF 50+", basePrice: 27.99, baseCost: 10.4, size: "50ml", badge: "Mexoryl 400 Tech", ing: ["Mexoryl 400", "Netlock Technology", "Vitamin E", "Thermal Spring Water"] },
          { name: "La Roche-Posay Anthelios Melt-In Milk Sunscreen SPF 60", basePrice: 29.99, baseCost: 11.2, size: "150ml", badge: "Consumer Reports #1", ing: ["Cell-Ox Shield®", "Senna Alata Extract", "Antioxidants"] }
        ]
      },
      {
        cat: "Active Serums & Toners",
        items: [
          { name: "La Roche-Posay Hyalu B5 Pure Hyaluronic Acid Serum", basePrice: 38.99, baseCost: 14.5, size: "30ml", badge: "Dual HA Plumping", ing: ["High & Low Mol. Hyaluronic Acid", "5% Vitamin B5", "Madecassoside"] },
          { name: "La Roche-Posay Effaclar Duo+ M Anti-Blemish Treatment", basePrice: 23.99, baseCost: 8.9, size: "40ml", badge: "Visible in 8 Hours", ing: ["Phylobioma Active", "Niacinamide", "Procerad", "Salicylic Acid"] },
          { name: "La Roche-Posay Pure Vitamin C10 Radiance Serum", basePrice: 42.00, baseCost: 15.8, size: "30ml", badge: "10% Pure Vitamin C", ing: ["10% Pure L-Ascorbic Acid", "Salicylic Acid", "Neurosensine"] }
        ]
      }
    ]
  },
  {
    brand: "The Ordinary",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00ORD",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Active Serums & Toners",
        items: [
          { name: "The Ordinary Niacinamide 10% + Zinc 1% Oil Control Serum", basePrice: 10.99, baseCost: 3.8, size: "60ml", badge: "World #1 Serum", ing: ["10% Pure Niacinamide", "1% Zinc PCA", "Tamarind Seed Gum"] },
          { name: "The Ordinary Hyaluronic Acid 2% + B5 Hydration Support", basePrice: 11.49, baseCost: 4.0, size: "60ml", badge: "Multi-Depth Hydration", ing: ["Low, Med, High HA Molecules", "Next-Gen HA Crosspolymer", "Pro-Vit B5"] },
          { name: "The Ordinary Caffeine Solution 5% + EGCG Eye Serum", basePrice: 11.99, baseCost: 4.2, size: "30ml", badge: "Dark Circles & Puffiness", ing: ["5% High-Solubility Caffeine", "Epigallocatechin Gallatyl Glucoside"] },
          { name: "The Ordinary Glycolic Acid 7% Exfoliating Toner", basePrice: 14.99, baseCost: 5.2, size: "240ml", badge: "AHA Surface Radiance", ing: ["7% Glycolic Acid", "Tasmanian Pepperberry", "Aloe Vera", "Ginseng Root"] },
          { name: "The Ordinary Multi-Peptide + Copper Peptides 1% Serum", basePrice: 32.00, baseCost: 11.9, size: "30ml", badge: "Age-Support Buffet", ing: ["1% Copper Tripeptide-1", "Matrixyl 3000", "Argirelox", "SYN-AKE"] }
        ]
      },
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "The Ordinary Natural Moisturizing Factors + HA Cream", basePrice: 12.99, baseCost: 4.5, size: "100ml", badge: "Skin-Identical NMF", ing: ["11 Amino Acids", "Phospholipids", "Alpha/Beta/Gamma Fatty Acids", "Hyaluronic Acid"] },
          { name: "The Ordinary Natural Moisturizing Factors + PhytoCeramides", basePrice: 19.99, baseCost: 7.2, size: "100ml", badge: "Rich Barrier Glaze", ing: ["PhytoCeramides", "Skin-Identical Lipids", "4x Moisturizing Emollients"] }
        ]
      }
    ]
  },
  {
    brand: "Eucerin",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00EUC",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Barrier Repair & Relief",
        items: [
          { name: "Eucerin Advanced Repair Cream Very Dry Skin", basePrice: 16.99, baseCost: 6.2, size: "454g", badge: "Ceramide-3 + NMF", ing: ["Ceramide-3", "Natural Moisturizing Factors (NMF)", "Lactic Acid"] },
          { name: "Eucerin Roughness Relief Cream with Urea", basePrice: 17.99, baseCost: 6.5, size: "454g", badge: "Urea Exfoliation", ing: ["Urea 10%", "Ceramide-3", "Sunflower Seed Oil"] },
          { name: "Eucerin Aquaphor Healing Ointment Advanced Therapy", basePrice: 16.49, baseCost: 5.9, size: "396g", badge: "#1 Pediatrician Recommended", ing: ["41% Petrolatum", "Panthenol", "Glycerin", "Bisabolol"] },
          { name: "Eucerin Q10 Anti-Wrinkle Face Cream Sensitive Skin", basePrice: 14.99, baseCost: 5.4, size: "48g", badge: "Fragrance-Free", ing: ["Coenzyme Q10", "Vitamin E", "Beta-Carotene"] }
        ]
      }
    ]
  },
  {
    brand: "Beauty of Joseon",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00BOJ",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Sunscreen & Daily Defense",
        items: [
          { name: "Beauty of Joseon Relief Sun Rice + Probiotics SPF50+ PA++++", basePrice: 18.00, baseCost: 6.5, size: "50ml", badge: "Global Viral Sunscreen", ing: ["30% Rice Extract", "Grain Fermented Probiotics", "Niacinamide"] },
          { name: "Beauty of Joseon Dynasty Cream Royal Hydration", basePrice: 22.00, baseCost: 8.0, size: "50ml", badge: "Hanbang Formula", ing: ["Rice Bran Water", "Ginseng Root Water", "2% Niacinamide", "Squalane"] },
          { name: "Beauty of Joseon Glow Serum Propolis + Niacinamide", basePrice: 17.00, baseCost: 6.2, size: "30ml", badge: "Honey Glow Active", ing: ["60% Propolis Extract", "2% Niacinamide", "0.5% BHA"] },
          { name: "Beauty of Joseon Revive Eye Serum Ginseng + Retinal", basePrice: 19.00, baseCost: 7.0, size: "30ml", badge: "Liposome Retinal", ing: ["10% Ginseng Root Extract", "2% Retinal Liposome", "Niacinamide"] }
        ]
      }
    ]
  },
  {
    brand: "COSRX",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00CSX",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Active Serums & Toners",
        items: [
          { name: "COSRX Advanced Snail 96 Mucin Power Essence", basePrice: 19.99, baseCost: 7.2, size: "100ml", badge: "Amazon #1 Beauty Item", ing: ["96.3% Snail Secretion Filtrate", "Sodium Hyaluronate", "Allantoin", "Panthenol"] },
          { name: "COSRX Advanced Snail 92 All in One Cream", basePrice: 21.00, baseCost: 7.8, size: "100g", badge: "Deep Plumping", ing: ["92% Snail Secretion Filtrate", "Betaine", "Caprylic Triglyceride"] },
          { name: "COSRX Low pH Good Morning Gel Cleanser", basePrice: 13.00, baseCost: 4.8, size: "150ml", badge: "Skin-Balanced pH 5.5", ing: ["Tea Tree Leaf Oil", "0.5% BHA (Betaine Salicylate)", "Styrax Japonicus Extract"] }
        ]
      }
    ]
  },
  {
    brand: "Paula's Choice",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00PLC",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Active Serums & Toners",
        items: [
          { name: "Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant", basePrice: 35.00, baseCost: 13.5, size: "118ml", badge: "Amazon Best Seller", ing: ["2% Salicylic Acid (BHA)", "Green Tea Extract", "Methylpropanediol"] },
          { name: "Paula's Choice Resist Barrier Repair Advanced Moisturizer", basePrice: 39.00, baseCost: 14.8, size: "50ml", badge: "5 Skin-Identical Ceramides", ing: ["Ceramides AP, EOP, NP", "Palmitoyl Tripeptide-1", "Watermelon Seed Oil"] }
        ]
      }
    ]
  },
  {
    brand: "Drunk Elephant",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00DKE",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "Drunk Elephant Protini Polypeptide Cream", basePrice: 68.00, baseCost: 26.5, size: "50ml", badge: "9 Signal Peptides", ing: ["9 Signal Peptide Complex", "Pygmy Waterlily Stem Cell", "Soybean Folic Acid"] },
          { name: "Drunk Elephant Lala Retro Whipped Cream with Ceramides", basePrice: 64.00, baseCost: 24.8, size: "50ml", badge: "Whipped Rescue", ing: ["6 Rare African Oils", "Plant-Derived Ceramides", "Sodium Hyaluronate Crosspolymer"] }
        ]
      }
    ]
  },
  {
    brand: "Tatcha",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00TTC",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "Tatcha The Dewy Skin Cream Rich Plumping Moisturizer", basePrice: 72.00, baseCost: 28.0, size: "50ml", badge: "Japanese Purple Rice", ing: ["Japanese Purple Rice", "Okinawa Algae", "Hyaluronic Acid", "Hadasei-3™"] },
          { name: "Tatcha The Water Cream Oil-Free Pore-Refining Hydration", basePrice: 70.00, baseCost: 27.2, size: "50ml", badge: "Japanese Wild Rose", ing: ["Japanese Wild Rose", "Japanese Leopard Lily", "Hadasei-3™ Complex"] }
        ]
      }
    ]
  },
  {
    brand: "Bioderma",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00BDM",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Barrier Repair & Relief",
        items: [
          { name: "Bioderma Sensibio H2O Micellar Cleansing Water", basePrice: 18.99, baseCost: 6.9, size: "500ml", badge: "French Pharmacy Legend", ing: ["Micellar Fatty Acid Esters", "Cucumis Sativus (Cucumber)", "Mannitol", "Xylitol"] },
          { name: "Bioderma Atoderm Intensive Baume Ultra-Soothing Emollient", basePrice: 27.99, baseCost: 10.2, size: "500ml", badge: "Anti-Itch Skin Barrier", ing: ["Lipigenium™ Complex", "Skin Barrier Therapy™", "PEA Anti-Pruritus"] }
        ]
      }
    ]
  },
  {
    brand: "Avène",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00AVN",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Barrier Repair & Relief",
        items: [
          { name: "Avène Cicalfate+ Restorative Protective Cream", basePrice: 28.00, baseCost: 10.5, size: "100ml", badge: "Postbiotic Repair", ing: ["C+-Restore™", "Copper-Zinc Sulfate Complex", "45% Avène Thermal Spring Water"] },
          { name: "Avène Thermal Spring Water Soothing Facial Spray", basePrice: 19.00, baseCost: 6.8, size: "300ml", badge: "Clinical Heritage", ing: ["100% Pure Avène Thermal Spring Water", "Optimal Calcium/Magnesium Ratio"] },
          { name: "Avène Hydrance Aqua-Gel 3-in-1 Daily Hydration", basePrice: 38.00, baseCost: 14.2, size: "50ml", badge: "Cohederm™ Complex", ing: ["Cohederm™", "Pre-Tocopheryl", "Dextran Sulfate"] }
        ]
      }
    ]
  },
  {
    brand: "Skin1004",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00SK4",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Sunscreen & Daily Defense",
        items: [
          { name: "Skin1004 Madagascar Centella Hyalu-Cica Water-Fit Sun Serum", basePrice: 19.50, baseCost: 6.8, size: "50ml", badge: "SPF 50+ PA++++", ing: ["Pure Centella Asiatica", "Hyaluronic Acid", "Niacinamide", "Betula Platyphylla Juice"] },
          { name: "Skin1004 Madagascar Centella Soothing Cream 72% Centella", basePrice: 21.00, baseCost: 7.5, size: "75ml", badge: "Instant Barrier Calm", ing: ["72% Centella Asiatica", "4 Botanical Ceramides", "Trehalose"] }
        ]
      }
    ]
  },
  {
    brand: "Anua",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00ANU",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Active Serums & Toners",
        items: [
          { name: "Anua Heartleaf 77% Soothing Toner Balance & Calm", basePrice: 22.00, baseCost: 7.9, size: "250ml", badge: "Viral K-Beauty Hero", ing: ["77% Houttuynia Cordata Extract", "Centella Asiatica", "Chamomilla Flower Extract"] },
          { name: "Anua Niacinamide 10% + TXA 4% Dark Spot Correcting Serum", basePrice: 24.00, baseCost: 8.8, size: "30ml", badge: "Hyperpigmentation Eraser", ing: ["10% Niacinamide", "4% Tranexamic Acid", "2% Alpha Arbutin", "Hyaluronic Acid"] }
        ]
      }
    ]
  },
  {
    brand: "Torriden",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00TRD",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "Torriden DIVE-IN Low Molecule Hyaluronic Acid Soothing Cream", basePrice: 23.00, baseCost: 8.2, size: "100ml", badge: "5D Complex HA", ing: ["5 Types Low-Mol. Hyaluronic Acid", "Panthenol", "Allantoin", "Malachite Extract"] }
        ]
      }
    ]
  },
  {
    brand: "Medicube",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00MDC",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Anti-Aging & Q10",
        items: [
          { name: "Medicube Triple Collagen Cream 4.0 Plumping Tightener", basePrice: 34.00, baseCost: 12.5, size: "50ml", badge: "Hydrolyzed Collagen", ing: ["Hydrolyzed Collagen", "Atelocollagen", "Soluble Collagen", "Peptides"] },
          { name: "Medicube Zero Pore One-Day Cream Exfoliation Firming", basePrice: 32.00, baseCost: 11.8, size: "50ml", badge: "Pore Refiner", ing: ["AHA, BHA, PHA Complex", "Anti-Sebum P", "Camellia Japonica Extract"] }
        ]
      }
    ]
  },
  {
    brand: "Neutrogena",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00NTG",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "Neutrogena Hydro Boost Water Gel Hyaluronic Plumping", basePrice: 17.99, baseCost: 6.4, size: "50ml", badge: "Oil-Free Lightweight", ing: ["Purified Hyaluronic Acid", "Olive Extract", "Glycerin"] },
          { name: "Neutrogena Rapid Wrinkle Repair Regenerating Cream", basePrice: 28.99, baseCost: 10.5, size: "48g", badge: "Accelerated Retinol SA", ing: ["Retinol SA", "Glucose Complex", "Hyaluronic Acid"] }
        ]
      }
    ]
  },
  {
    brand: "Cetaphil",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00CTP",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "Cetaphil Moisturizing Cream for Very Dry Sensitive Skin", basePrice: 16.49, baseCost: 5.9, size: "566g / 20 oz", badge: "48H Hydration", ing: ["Niacinamide (Vit B3)", "Panthenol (Pro-Vit B5)", "Hydrating Glycerin", "Sweet Almond Oil"] }
        ]
      }
    ]
  },
  {
    brand: "Laneige",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00LNG",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "Laneige Water Bank Blue Hyaluronic Cream Moisturizer", basePrice: 40.00, baseCost: 15.0, size: "50ml", badge: "Micro-Sized HA", ing: ["Blue Hyaluronic Acid", "Ceramides", "Probiotics", "Beta-Glucan"] },
          { name: "Laneige Lip Sleeping Mask Intensive Hydration Berry", basePrice: 24.00, baseCost: 8.9, size: "20g", badge: "Cult Overnight Hero", ing: ["Berry Fruit Complex", "Vitamin C", "Coconut Oil", "Shea Butter"] }
        ]
      }
    ]
  },
  {
    brand: "RoC Skincare",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00ROC",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Anti-Aging & Q10",
        items: [
          { name: "RoC Retinol Correxion Deep Wrinkle Night Cream", basePrice: 24.99, baseCost: 8.9, size: "30ml", badge: "Clinical Retinol", ing: ["Pure RoC Retinol", "Mineral Complex", "Glycolic Acid", "Squalane"] },
          { name: "RoC Multi Correxion 5-in-1 Daily Moisturizer SPF 30", basePrice: 27.49, baseCost: 9.8, size: "50ml", badge: "5-in-1 Defense", ing: ["Hexyl-R Complex™", "Vitamin E", "Broad Spectrum SPF 30"] }
        ]
      }
    ]
  },
  {
    brand: "Haruharu Wonder",
    source: "Amazon Prime Dropship",
    asinPrefix: "B00HHW",
    moq: 1,
    shippingDays: "2–4 Days (Amazon Prime Dropship)",
    categories: [
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "Haruharu Wonder Black Rice Hyaluronic Cream Deep Moisture", basePrice: 20.00, baseCost: 7.2, size: "50ml", badge: "Fermented Black Rice", ing: ["Fermented Korean Black Rice", "Hyaluronic Acid", "Evening Primrose Oil", "Lavender Oil"] },
          { name: "Haruharu Wonder Black Rice Moisture Airyfit Daily Sunscreen", basePrice: 18.50, baseCost: 6.4, size: "50ml", badge: "Chemical SPF 50+", ing: ["Black Rice Extract", "Ceramide NP", "Heartleaf Extract", "Niacinamide"] }
        ]
      }
    ]
  }
];

// Verified Alibaba Dropship & OEM/ODM Manufacturers
const ALIBABA_SUPPLIERS_CATALOG = [
  {
    supplierName: "Guangzhou Ausmetics Bio-Tech (Alibaba Verified OEM)",
    brandCode: "AUSM",
    source: "Alibaba Trade Assurance Dropship",
    moq: 1,
    shippingDays: "7–10 Days (Alibaba Air Express Dropship)",
    categories: [
      {
        cat: "Anti-Aging & Q10",
        items: [
          { name: "24K Gold Snail Peptide Firming Anti-Wrinkle Face Cream", basePrice: 26.99, baseCost: 4.8, size: "50g Glass Jar", badge: "Gold Infused", ing: ["24K Colloidal Nano-Gold", "Snail Secretion Filtrate", "Acetyl Hexapeptide-8", "Niacinamide"] },
          { name: "Caviar & Black Truffle Revitalizing Multi-Peptide Night Cream", basePrice: 29.99, baseCost: 5.4, size: "50ml Luxury Jar", badge: "Luxury Nutrition", ing: ["Beluga Caviar Extract", "French Black Truffle", "Palmitoyl Tripeptide-5", "Squalane"] },
          { name: "Micro-Encapsulated Retinol 1.0% Collagen Tightening Cream", basePrice: 24.50, baseCost: 4.2, size: "50ml Airless Pump", badge: "Slow-Release Retinol", ing: ["1.0% Encapsulated Retinol", "Hydrolyzed Marine Collagen", "Ceramide NP"] },
          { name: "Snake Venom Peptide Expression-Line Relaxing Gel Cream", basePrice: 27.00, baseCost: 4.9, size: "50ml Dropper", badge: "SYN-AKE Complex", ing: ["Dipeptide Diaminobutyroyl Benzylamide", "Hyaluronic Acid", "Adenosine"] }
        ]
      },
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "5-Tier Multi-Ceramide Lipid Barrier Repair Emulsion", basePrice: 22.99, baseCost: 3.9, size: "120ml Pump Bottle", badge: "Lipid Matrix Tech", ing: ["Ceramides 1, 2, 3, 4, 6-II", "Phytosphingosine", "Cholesterol", "Shea Butter"] },
          { name: "Deep Sea Glacier Water Intensive Gel Hydration Cream", basePrice: 19.99, baseCost: 3.2, size: "100ml Frosted Jar", badge: "48H Water-Lock", ing: ["Icelandic Glacier Water", "8D Hyaluronic Acid", "Spirulina Extract"] }
        ]
      }
    ]
  },
  {
    supplierName: "Yilong Bio-Cosmetics ODM (Alibaba Trade Assurance)",
    brandCode: "YILG",
    source: "Alibaba Trade Assurance Dropship",
    moq: 1,
    shippingDays: "7–10 Days (Alibaba Air Express Dropship)",
    categories: [
      {
        cat: "Radiant Body Care",
        items: [
          { name: "Glutathione & Kojic Acid Ultra-Radiance Body Butter", basePrice: 23.99, baseCost: 4.1, size: "350g Tub", badge: "Max Tone Radiance", ing: ["Pure Reduced Glutathione", "Kojic Acid Dipalmitate", "Alpha Arbutin", "Shea Butter"] },
          { name: "10% Niacinamide + 3% Tranexamic Acid Brightening Body Milk", basePrice: 21.99, baseCost: 3.8, size: "400ml Pump", badge: "Even Tone Matrix", ing: ["10% Niacinamide", "3% Tranexamic Acid", "Licorice Extract", "Vitamin C"] },
          { name: "Moroccan Argan & Organic Rose Water Silken Body Cream", basePrice: 19.99, baseCost: 3.4, size: "300ml Pump", badge: "Cold-Pressed Argan", ing: ["Pure Argania Spinosa Oil", "Damascena Rose Distillate", "Vitamin E"] }
        ]
      },
      {
        cat: "Active Serums & Toners",
        items: [
          { name: "Triple Active Arbutin & Vitamin C Radiance Booster Ampoule", basePrice: 22.50, baseCost: 3.6, size: "50ml Amber Glass", badge: "Anti-Pigment", ing: ["Alpha Arbutin 2%", "3-O-Ethyl Ascorbic Acid", "Niacinamide 5%", "Hyaluronic Acid"] }
        ]
      }
    ]
  },
  {
    supplierName: "Shinva Beauty Technologies (Alibaba Verified)",
    brandCode: "SHNV",
    source: "Alibaba Trade Assurance Dropship",
    moq: 1,
    shippingDays: "7–10 Days (Alibaba Air Express Dropship)",
    categories: [
      {
        cat: "Barrier Repair & Relief",
        items: [
          { name: "Centella Asiatica 95% Pure Cica Soothing Recovery Cream", basePrice: 21.50, baseCost: 3.5, size: "80ml Aluminum Tube", badge: "Clinical Centella", ing: ["95% Madagascar Centella Extract", "Asiaticoside", "Madecassic Acid", "Panthenol 5%"] },
          { name: "Copper Tripeptide-1 Cellular Recovery Firming Cream", basePrice: 28.50, baseCost: 5.1, size: "50ml Frosted Jar", badge: "Peptide Complex", ing: ["Copper Tripeptide-1", "Blue Tansy Oil", "Hyaluronic Acid", "Squalane"] },
          { name: "Bifida Ferment Lysate Skin Barrier Longevity Night Balm", basePrice: 25.00, baseCost: 4.4, size: "50ml Glass Jar", badge: "Microbiome Defense", ing: ["Bifida Ferment Filtrate", "Lactobacillus Lysate", "Ceramide NP"] }
        ]
      },
      {
        cat: "Moisturizing Creams",
        items: [
          { name: "8D Micro-Molecular Hyaluronic Acid Deep Moisture Gel Cream", basePrice: 20.99, baseCost: 3.3, size: "100ml Acrylic Jar", badge: "8-Layer Hydration", ing: ["8 Molecular Weights of Hyaluronic Acid", "Hydrolyzed Sodium Hyaluronate", "Polyglutamic Acid"] }
        ]
      }
    ]
  },
  {
    supplierName: "Ningbo Aomei Cosmetics (Alibaba Gold Supplier)",
    brandCode: "AOME",
    source: "Alibaba Trade Assurance Dropship",
    moq: 1,
    shippingDays: "7–10 Days (Alibaba Air Express Dropship)",
    categories: [
      {
        cat: "Gentle Cleansers & Masks",
        items: [
          { name: "Fermented Rice Bran & Galactomyces Nourishing Sleeping Pack", basePrice: 22.00, baseCost: 3.7, size: "100g Jar", badge: "Korean Glass Skin", ing: ["Fermented Rice Water", "Galactomyces Ferment Filtrate", "Niacinamide", "Ceramides"] },
          { name: "Green Tea & Salicylic Acid Deep Pore Clarifying Clay Mud Mask", basePrice: 18.99, baseCost: 2.9, size: "120g Tub", badge: "Blemish Detox", ing: ["French Kaolin Clay", "Organic Matcha Green Tea", "2% Salicylic Acid", "Tea Tree Extract"] },
          { name: "Volcanic Mineral Amino Acid Gentle Foam Cleanser", basePrice: 15.99, baseCost: 2.5, size: "150ml Tube", badge: "pH Balanced 5.5", ing: ["Jeju Volcanic Ash", "17 Amino Acids", "Centella Asiatica", "Chamomile"] }
        ]
      },
      {
        cat: "Barrier Repair & Relief",
        items: [
          { name: "Marine Collagen & Deep Sea Squalane Barrier Balm", basePrice: 23.50, baseCost: 3.9, size: "60g Jar", badge: "Marine Active", ing: ["Deep Sea Shark-Free Squalane", "Soluble Marine Collagen", "Kelp Ferment"] }
        ]
      }
    ]
  },
  {
    supplierName: "Hangzhou Meishen Skin Tech (Alibaba Verified)",
    brandCode: "MSHN",
    source: "Alibaba Trade Assurance Dropship",
    moq: 1,
    shippingDays: "7–10 Days (Alibaba Air Express Dropship)",
    categories: [
      {
        cat: "Active Serums & Toners",
        items: [
          { name: "Polyglutamic Acid (PGA) 5000x Moisture-Lock Ampoule", basePrice: 24.00, baseCost: 3.9, size: "60ml Dropper", badge: "5x More HA Power", ing: ["High Purity Polyglutamic Acid", "Beta-Glucan", "Provitamin B5"] },
          { name: "Bakuchiol 2.5% Botanical Retinol Youth Preserving Face Oil", basePrice: 26.50, baseCost: 4.5, size: "30ml Dropper", badge: "Plant Retinol", ing: ["2.5% Psoralea Corylifolia (Bakuchiol)", "Squalane", "Rosehip Seed Oil", "Marula Oil"] },
          { name: "Astaxanthin & Resveratrol Antioxidant Shield Serum", basePrice: 25.50, baseCost: 4.2, size: "30ml Pump", badge: "6000x Vit C Potency", ing: ["Haematococcus Pluvialis Astaxanthin", "Pure Resveratrol", "Ferulic Acid", "Vitamin E"] }
        ]
      }
    ]
  },
  {
    supplierName: "Zhongshan Bell Cosmetics (Alibaba Verified)",
    brandCode: "BELL",
    source: "Alibaba Trade Assurance Dropship",
    moq: 1,
    shippingDays: "7–10 Days (Alibaba Air Express Dropship)",
    categories: [
      {
        cat: "Barrier Repair & Relief",
        items: [
          { name: "Colloidal Oatmeal 2% Intensive Eczema Relief Therapy Cream", basePrice: 19.99, baseCost: 3.2, size: "250g Jar", badge: "Dermatologist Relief", ing: ["2% Colloidal Oatmeal", "Ceramide-3", "Shea Butter", "Glycerin"] },
          { name: "Urea 20% + Salicylic Acid 2% Intensive Heel & Elbow Callus Cream", basePrice: 17.99, baseCost: 2.8, size: "150g Jar", badge: "Cracked Heel Rescue", ing: ["20% Medical Grade Urea", "2% Salicylic Acid", "Tea Tree Oil", "Aloe Vera"] },
          { name: "Honey Propolis & Royal Jelly Multi-Barrier Sleeping Ointment", basePrice: 21.99, baseCost: 3.6, size: "80g Jar", badge: "Nourishing Shield", ing: ["80% Honey Extract", "Propolis Cera", "Royal Jelly", "Ceramides"] }
        ]
      },
      {
        cat: "Sunscreen & Daily Defense",
        items: [
          { name: "SPF 50+ Invisible Water-Gel Essence Sun Protection", basePrice: 18.50, baseCost: 2.9, size: "60ml Tube", badge: "No White Cast", ing: ["Uvinul A Plus", "Tinosorb S", "Centella Asiatica", "Hyaluronic Acid"] }
        ]
      }
    ]
  },
  {
    supplierName: "Guandong Bio-Active Lab (Alibaba Verified OEM)",
    brandCode: "GDAO",
    source: "Alibaba Trade Assurance Dropship",
    moq: 1,
    shippingDays: "7–10 Days (Alibaba Air Express Dropship)",
    categories: [
      {
        cat: "Barrier Repair & Relief",
        items: [
          { name: "Mugwort & Heartleaf Calming Recovery Gel Cream", basePrice: 20.50, baseCost: 3.3, size: "100ml Jar", badge: "Cica & Mugwort", ing: ["Artemisia Princeps (Mugwort)", "Houttuynia Cordata", "Ceramide NP", "Panthenol"] },
          { name: "Azelaic Acid 10% + Zinc PCA Anti-Redness Blemish Cream", basePrice: 22.00, baseCost: 3.6, size: "50ml Tube", badge: "Pore Clearing", ing: ["10% Pure Azelaic Acid", "Zinc PCA", "Niacinamide", "Centella Asiatica"] }
        ]
      },
      {
        cat: "Anti-Aging & Q10",
        items: [
          { name: "Astaxanthin 6000x Antioxidant Defense Night Cream", basePrice: 26.00, baseCost: 4.4, size: "50ml Jar", badge: "Super Antioxidant", ing: ["Natural Astaxanthin", "Coenzyme Q10", "Squalane", "Vitamin E"] },
          { name: "Pure Squalane 100% Plant-Derived Barrier Cream", basePrice: 21.00, baseCost: 3.4, size: "80ml Tube", badge: "Plant Squalane", ing: ["100% Olive Squalane", "Jojoba Esters", "Ceramide Complex"] }
        ]
      }
    ]
  }
];

// Variation templates to expand entries realistically into 3,000+ dropshipping catalog items
const SKIN_TYPES = [
  "All Skin Types",
  "Dry to Extremely Dry Skin",
  "Sensitive & Reactive Skin",
  "Combination to Oily Skin",
  "Acne-Prone & Blemish-Prone Skin",
  "Mature & Aging Skin",
  "Compromised Barrier & Eczema-Prone",
  "Dull & Uneven Complexion"
];

const PACK_SIZES = [
  { label: "Standard Size", factor: 1.0, sizeStr: "Single Jar / Bottle" },
  { label: "Value Duo Pack (Save 15%)", factor: 1.85, sizeStr: "2-Pack Bundle" },
  { label: "Jumbo Family Size", factor: 1.45, sizeStr: "Value Refill Edition" },
  { label: "Travel & Trial Edition", factor: 0.65, sizeStr: "50ml Travel Size" }
];

const FORMULATION_ACCENTS = [
  { suffix: "Fragrance-Free Clinical Edition", tag: "Tested on sensitive skin, 0% fragrance, 0% parabens", priceMod: 1.05 },
  { suffix: "Ultra-Rich Barrier Repair Formula", tag: "Enhanced lipid replenishment with 3 essential skin ceramides", priceMod: 1.1 },
  { suffix: "Lightweight Daily Defense Edition", tag: "Non-greasy, fast-absorbing weightless moisture for all-day comfort", priceMod: 1.0 },
  { suffix: "Deep Night Cellular Recovery", tag: "Time-release moisture and active cell repair while you sleep", priceMod: 1.15 },
  { suffix: "Double Hydration Infusion", tag: "Concentrated hyaluronic acid complex with 48-hour continuous moisture", priceMod: 1.08 },
  { suffix: "Gentle Barrier Calm Edition", tag: "Calming botanical infusion for irritated, red, or compromised skin", priceMod: 1.04 },
  { suffix: "Maximum Strength Active Formula", tag: "High-potency clinical concentration for accelerated visible results", priceMod: 1.2 }
];

console.log("Generating 3,000+ realistic dropshipping skincare items...");

const generatedProducts = [...baseProducts];
let idCounter = 100;

// Helper to make variant items
function makeVariants(baseName, basePrice) {
  return [
    { name: "Standard Size", colorHex: "#002B7F", inStock: true },
    { name: "Duo Value Pack (2 Units)", colorHex: "#2563EB", inStock: true },
    { name: "Jumbo Spa Jar", colorHex: "#0D9488", inStock: true }
  ];
}

// Helper to generate reviews
function makeReviews(name, rating, count) {
  return [
    {
      id: `rev-${Math.random().toString(36).substring(2, 9)}`,
      author: "Verified Skincare Buyer",
      verified: true,
      rating: Math.min(5, Math.max(4, Math.round(rating))),
      date: "3 days ago",
      title: "Noticeable improvement in barrier hydration within 48 hours",
      comment: `Extremely impressed with the texture and absorption of ${name}. Does not pill under makeup or feel greasy.`,
      helpfulCount: Math.floor(Math.random() * 30) + 4
    },
    {
      id: `rev-${Math.random().toString(36).substring(2, 9)}`,
      author: "Dermatology Specialist",
      verified: true,
      rating: 5,
      date: "1 week ago",
      title: "Clean ingredient profile and genuine formulation",
      comment: "Solid active ingredients with excellent skin tolerance. Highly recommended for daily barrier maintenance.",
      helpfulCount: Math.floor(Math.random() * 50) + 12
    }
  ];
}

// 1. Generate Amazon Dropship Skincare Entries (~1,550 items)
for (const brandConfig of AMAZON_BRANDS_CATALOG) {
  for (const catConfig of brandConfig.categories) {
    for (const item of catConfig.items) {
      for (let f = 0; f < FORMULATION_ACCENTS.length; f++) {
        for (let s = 0; s < PACK_SIZES.length; s++) {
          idCounter++;
          const accent = FORMULATION_ACCENTS[f];
          const pack = PACK_SIZES[s];

          const prodName = s === 0 && f === 0 
            ? `${brandConfig.brand} ${item.name}`
            : `${brandConfig.brand} ${item.name} (${accent.suffix} - ${pack.label})`;

          const price = parseFloat(((item.basePrice * accent.priceMod * pack.factor) + (Math.random() * 0.5 - 0.25)).toFixed(2));
          const compareAtPrice = parseFloat((price * (1.28 + Math.random() * 0.2)).toFixed(2));
          const supplierCost = parseFloat(((item.baseCost * accent.priceMod * pack.factor * 0.95)).toFixed(2));
          const rating = parseFloat((4.6 + Math.random() * 0.38).toFixed(1));
          const reviewCount = Math.floor(Math.random() * 8500) + 120;
          const imgIdx = (idCounter % SKINCARE_IMAGES.length);
          const asinNumber = String(idCounter).padStart(5, "0");
          const sku = `AMZ-${brandConfig.brand.substring(0, 3).toUpperCase()}-${brandConfig.asinPrefix}${asinNumber}`;

          const skinType = SKIN_TYPES[(idCounter + f + s) % SKIN_TYPES.length];

          generatedProducts.push({
            id: `prod-amz-${idCounter}`,
            sku: sku,
            brand: brandConfig.brand,
            name: prodName,
            tagline: `${item.badge || "Verified Bestseller"} • ${accent.tag}`,
            size: `${item.size} (${pack.sizeStr})`,
            skinType: skinType,
            category: catConfig.cat,
            price: price,
            compareAtPrice: compareAtPrice,
            supplierCost: supplierCost,
            rating: Math.min(5, rating),
            reviewCount: reviewCount,
            soldCountText: `Over ${Math.floor(reviewCount * 1.5)}+ units dropshipped`,
            badge: item.badge || "Amazon Choice",
            shortDescription: `${prodName} delivers verified active dermatological efficacy. Specially formulated for ${skinType.toLowerCase()}.`,
            keyIngredients: item.ing,
            benefits: [
              "Clinically verified 48H continuous deep barrier moisture",
              "Soothes dryness, redness, and micro-flaking rapidly",
              "Non-comedogenic, cruelty-free, and dermatologist approved"
            ],
            image: SKINCARE_IMAGES[imgIdx],
            gallery: [
              SKINCARE_IMAGES[imgIdx],
              SKINCARE_IMAGES[(imgIdx + 1) % SKINCARE_IMAGES.length],
              SKINCARE_IMAGES[(imgIdx + 2) % SKINCARE_IMAGES.length]
            ],
            variants: makeVariants(prodName, price),
            stockLeft: Math.floor(Math.random() * 350) + 25,
            reviews: makeReviews(prodName, rating, reviewCount),
            faqs: [
              { question: "Is this product genuine and freshly manufactured?", answer: "Yes. All units are sourced through authenticated European and Amazon FBA fulfillment channels, batch-tested, and climate-controlled." },
              { question: "How long does dropship delivery take?", answer: `${brandConfig.shippingDays}. Tracking numbers are generated within 12 hours of order placement.` }
            ],
            supplierSource: brandConfig.source,
            supplierMoq: brandConfig.moq,
            shippingDays: brandConfig.shippingDays
          });
        }
      }
    }
  }
}

// 2. Generate Alibaba Verified Dropship & OEM/ODM Entries (~1,550 items)
for (const supplierConfig of ALIBABA_SUPPLIERS_CATALOG) {
  for (const catConfig of supplierConfig.categories) {
    for (const item of catConfig.items) {
      for (let f = 0; f < FORMULATION_ACCENTS.length; f++) {
        for (let s = 0; s < PACK_SIZES.length; s++) {
          idCounter++;
          const accent = FORMULATION_ACCENTS[f];
          const pack = PACK_SIZES[s];

          const brandDisplayName = supplierConfig.supplierName.split(" ")[0] + " Lab";
          const prodName = s === 0 && f === 0
            ? `${item.name}`
            : `${item.name} (${accent.suffix} - ${pack.label})`;

          const price = parseFloat(((item.basePrice * accent.priceMod * pack.factor) + (Math.random() * 0.4 - 0.2)).toFixed(2));
          const compareAtPrice = parseFloat((price * (1.35 + Math.random() * 0.25)).toFixed(2));
          const supplierCost = parseFloat(((item.baseCost * accent.priceMod * pack.factor)).toFixed(2));
          const rating = parseFloat((4.7 + Math.random() * 0.29).toFixed(1));
          const reviewCount = Math.floor(Math.random() * 4200) + 85;
          const imgIdx = (idCounter % SKINCARE_IMAGES.length);
          const babaNumber = String(idCounter).padStart(5, "0");
          const sku = `BABA-${supplierConfig.brandCode}-${babaNumber}`;

          const skinType = SKIN_TYPES[(idCounter + f + s + 3) % SKIN_TYPES.length];

          generatedProducts.push({
            id: `prod-baba-${idCounter}`,
            sku: sku,
            brand: brandDisplayName,
            name: prodName,
            tagline: `${item.badge || "Verified OEM"} • ${accent.tag}`,
            size: `${item.size} (${pack.sizeStr})`,
            skinType: skinType,
            category: catConfig.cat,
            price: price,
            compareAtPrice: compareAtPrice,
            supplierCost: supplierCost,
            rating: Math.min(5, rating),
            reviewCount: reviewCount,
            soldCountText: `Over ${Math.floor(reviewCount * 2.2)}+ units dropshipped`,
            badge: item.badge || "Alibaba Trade Assurance",
            shortDescription: `${prodName} manufactured by ${supplierConfig.supplierName}. Certified laboratory grade formulation for ${skinType.toLowerCase()}.`,
            keyIngredients: item.ing,
            benefits: [
              "Certified ISO22716 & GMP international cosmetic laboratory standard",
              "Direct factory air express dispatch with real-time tracking",
              "High margin dropship item with 70%+ gross profit yield"
            ],
            image: SKINCARE_IMAGES[imgIdx],
            gallery: [
              SKINCARE_IMAGES[imgIdx],
              SKINCARE_IMAGES[(imgIdx + 1) % SKINCARE_IMAGES.length],
              SKINCARE_IMAGES[(imgIdx + 3) % SKINCARE_IMAGES.length]
            ],
            variants: makeVariants(prodName, price),
            stockLeft: Math.floor(Math.random() * 800) + 100,
            reviews: makeReviews(prodName, rating, reviewCount),
            faqs: [
              { question: "What certification does this Alibaba OEM formula hold?", answer: "This formulation is produced under ISO22716, GMP, and European cosmetic safety compliance with full batch certificates of analysis." },
              { question: "What is the dropshipping fulfillment speed?", answer: `${supplierConfig.shippingDays}. Dispatched via Air Express directly to the customer's doorstep.` }
            ],
            supplierSource: supplierConfig.source,
            supplierMoq: supplierConfig.moq,
            shippingDays: supplierConfig.shippingDays
          });
        }
      }
    }
  }
}

console.log(`Total generated products: ${generatedProducts.length}`);

// Persist directly to store-db.json
const updatedDb = {
  ...existingDb,
  products: generatedProducts
};

fs.writeFileSync(DB_FILE_PATH, JSON.stringify(updatedDb, null, 2), "utf-8");
console.log(`Successfully written ${generatedProducts.length} dropshipping products to ${DB_FILE_PATH}!`);
