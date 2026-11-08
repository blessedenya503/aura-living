import { Product } from "@/data/products";

export interface UsageDetails {
  howToUse: string;
  precautions: string[];
}

export function getProductUsageDetails(product: Partial<Product>): UsageDetails {
  const n = (product.name || "").toLowerCase();
  const b = (product.brand || "").toLowerCase();
  const cat = (product.category || "").toLowerCase();
  const ingredients = (product.keyIngredients || []).join(" ").toLowerCase();

  // 1. Pimple Patches & Blemish Dots (e.g. COSRX Master Patch)
  if (n.includes("patch") || n.includes("pimple master") || n.includes("blemish dot")) {
    return {
      howToUse:
        "1. Thoroughly cleanse and completely dry the target blemish area (do NOT apply toners, oils, or moisturizers beforehand).\n" +
        "2. Select a patch size slightly larger than the active pimple and press firmly over the spot for 3–5 seconds.\n" +
        "3. Leave on for 6 to 8 hours or overnight. When the patch turns milky white with absorbed impurities, peel off gently from the edges and replace if needed.",
      precautions: [
        "Adhere only to clean, bone-dry skin; lotions prevent proper hydrocolloid adhesion.",
        "Single-use only. Do not reuse a patch once peeled from the skin.",
        "Designed for surface pustules and whiteheads; not suitable for deep cystic acne nodules.",
        "Store unopened blister sheets in a cool, dry place to prevent premature swelling.",
      ],
    };
  }

  // 2. Vitamin C & Brightening Serums (e.g. La Roche-Posay Pure Vitamin C10, COSRX Vit C 23)
  if (
    n.includes("vitamin c") ||
    n.includes("c10") ||
    n.includes("c23") ||
    n.includes("c-firma") ||
    n.includes("ascorbic") ||
    ingredients.includes("ascorbic acid")
  ) {
    return {
      howToUse:
        "1. Apply in the morning on thoroughly cleansed, dry skin.\n" +
        "2. Dispense 3 to 4 drops directly into the palms or onto the face (avoiding the immediate eye contour).\n" +
        "3. Gently massage and pat until completely absorbed. Allow 60 seconds before layering your daily moisturizer and always finish with broad-spectrum SPF 30+.",
      precautions: [
        "Pure L-Ascorbic Acid can cause slight tingling on initial use while tolerance builds; space application to alternate mornings if sensitive.",
        "Keep tightly capped away from direct sunlight, air, and heat to preserve antioxidant potency and prevent oxidation (darkening).",
        "Avoid pairing in the same morning routine with high-percentage Retinol, Glycolic Acid, or Benzoyl Peroxide.",
        "Always follow with daily broad-spectrum sunscreen; Vitamin C synergizes with SPF to neutralize UV free radicals.",
      ],
    };
  }

  // 3. Retinol & Anti-Aging Actives (e.g. CeraVe Resurfacing Retinol, The Ordinary Granactive Retinoid)
  if (
    n.includes("retinol") ||
    n.includes("retinoid") ||
    n.includes("anti-aging") ||
    n.includes("q10") ||
    cat.includes("Anti-Aging") ||
    ingredients.includes("retinol")
  ) {
    return {
      howToUse:
        "1. Use exclusively at night as part of your evening routine.\n" +
        "2. After cleansing, apply a pea-sized amount evenly across dry face and neck, avoiding the eye and lip borders.\n" +
        "3. Introduce gradually: use 2 nights per week for the first two weeks, progressing to every other night as your skin adapts. Always follow with a soothing barrier cream.",
      precautions: [
        "For nighttime use only. Retinol increases skin sensitivity to ultraviolet radiation.",
        "Daily daytime sunscreen application (SPF 30 or higher) is mandatory while using this product.",
        "Mild redness, peeling, or dryness can occur during initial cellular turnover (retinization phase).",
        "Do not use if pregnant, nursing, or using prescription topical acne medication without consulting a physician.",
      ],
    };
  }

  // 4. Salicylic Acid (BHA), AHA, Glycolic & Acne Treatments (e.g. Effaclar, Paula's Choice 2% BHA)
  if (
    n.includes("salicylic") ||
    n.includes("bha") ||
    n.includes("effaclar") ||
    n.includes("glycolic") ||
    n.includes("aha") ||
    n.includes("comedomed") ||
    n.includes("benzoyl") ||
    ingredients.includes("salicylic acid") ||
    ingredients.includes("benzoyl peroxide")
  ) {
    return {
      howToUse:
        "1. After gentle cleansing, apply a thin layer over target breakout zones or across entire face (avoiding eyes and lips).\n" +
        "2. For leave-on exfoliants, do not rinse off; allow 1–2 minutes to penetrate before layering hydrating serums.\n" +
        "3. Start with once-daily application (or every other day for sensitive skin) to maintain a healthy lipid barrier.",
      precautions: [
        "Do not apply to open cuts, eczema lesions, or sunburned skin.",
        "Can increase skin photosensitivity; use broad-spectrum SPF 30+ every morning.",
        "Avoid simultaneous physical scrubs or abrasive cleansing brushes that could compromise your acid mantle.",
        "Discontinue use if excessive burning, itching, or swelling occurs.",
      ],
    };
  }

  // 5. Sunscreens & SPF Defense (e.g. Beauty of Joseon Relief Sun, Anthelios UVMune 400)
  if (
    n.includes("sunscreen") ||
    n.includes("spf") ||
    n.includes("sun relief") ||
    n.includes("anthelios") ||
    n.includes("daily defense") ||
    cat.includes("Sunscreen")
  ) {
    return {
      howToUse:
        "1. Apply as the final step of your morning skincare routine, at least 15 minutes before direct sun exposure.\n" +
        "2. Dispense a full two-finger lengths of product to cover face, ears, and neck adequately.\n" +
        "3. Reapply generously every 2 hours during continuous outdoor activity, or immediately after towel drying, swimming, or excessive sweating.",
      precautions: [
        "For external cosmetic use only. Keep out of direct contact with eyes; rinse with water if contact occurs.",
        "No sunscreen offers 100% UV protection; avoid prolonged midday sun exposure even when using SPF.",
        "Store below 30°C (86°F) away from heat and direct sunlight to prevent filter degradation.",
        "Safe for daily application under makeup or layered over facial moisturizers.",
      ],
    };
  }

  // 6. Snail Mucin, Toners & Essences (e.g. COSRX Snail 96, Anua 77% Heartleaf)
  if (
    n.includes("snail") ||
    n.includes("essence") ||
    n.includes("toner") ||
    n.includes("heartleaf") ||
    n.includes("mucus") ||
    n.includes("ampoule") ||
    cat.includes("Active Serums & Toners")
  ) {
    return {
      howToUse:
        "1. After cleansing, dispense 2 to 3 pumps or drops into the palms of your clean hands.\n" +
        "2. Smooth and press gently over the face and neck until fully absorbed; do not wipe off.\n" +
        "3. Pat lightly with fingertips to facilitate dermal penetration. Follow immediately with your favorite moisturizer or night barrier cream while skin is still hydrated.",
      precautions: [
        "Suitable for both morning and evening application on all skin types including sensitive skin.",
        "If you have a known allergy to dust mites or snail products, conduct an inner-forearm patch test prior to first facial use.",
        "Store in a cool dry space; keep bottle closed to prevent moisture loss.",
        "Non-comedogenic formula; won't clog pores or trigger fungal acne.",
      ],
    };
  }

  // 7. Facial Cleansers & Washes (e.g. CeraVe Hydrating Cleanser, Low pH Good Morning)
  if (
    n.includes("cleanser") ||
    n.includes("wash") ||
    n.includes("foam") ||
    n.includes("micellar") ||
    cat.includes("Gentle Cleansers")
  ) {
    return {
      howToUse:
        "1. Splash face with lukewarm water. Pump a coin-sized amount into clean hands and work into a light lather.\n" +
        "2. Gently massage over damp face in circular motions for 60 seconds, paying attention to the T-zone and jawline.\n" +
        "3. Rinse thoroughly with lukewarm water and pat dry gently with a clean towel. Proceed immediately with your hydrating toner or essence while skin remains receptive.",
      precautions: [
        "Avoid using hot water, which strips natural sebum and disrupts the dermal acid mantle.",
        "Avoid aggressive scrubbing; let the surfactant emulsify impurities naturally.",
        "If lather enters the eyes, rinse immediately with clean water.",
        "Safe for daily morning and evening cleansing.",
      ],
    };
  }

  // 8. Barrier Creams, Baumes & Intensive Moisturizers (e.g. Cicaplast B5+, CeraVe Moisturizing Cream, Tatcha Dewy Skin)
  return {
    howToUse:
      "1. Warm a dime-to-nickel sized amount between fingertips.\n" +
      "2. Smooth gently over cleansed, toned face, neck, and dry targeted areas using gentle upward motions.\n" +
      "3. Use morning and night as the final moisturizing step to seal in active serums and support optimal stratum corneum barrier recovery.",
    precautions: [
      "For external topical dermatological use only.",
      "Store at room temperature away from freezing temperatures and direct sunlight.",
      "Patch testing behind the ear or on the inner arm 24 hours prior to initial full-face use is recommended for sensitive skin.",
      "Discontinue use if persistent irritation develops.",
    ],
  };
}
