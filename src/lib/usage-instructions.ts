import { Product } from "@/data/products";

export function getCategorySpecificHowToUse(product: Partial<Product>): string {
  if (product.howToUse && product.howToUse.trim()) {
    return product.howToUse;
  }

  const category = product.category || "";
  const name = (product.name || "").toLowerCase();

  // 1. Serums, Essences & Ampoules
  if (
    category.includes("Serum") ||
    category.includes("Toner") ||
    name.includes("serum") ||
    name.includes("essence") ||
    name.includes("ampoule")
  ) {
    if (name.includes("toner")) {
      return (
        "How to Use (Daily Clarifying & Hydrating Step):\n\n" +
        "1. After facial cleansing, dispense 3–5 drops directly onto palms or saturate a soft cotton pad.\n" +
        "2. Gently sweep or press across face, neck, and décolletage until fully absorbed.\n" +
        "3. Pat lightly with fingertips to promote circulation. Follow immediately with your serum and barrier moisturizer."
      );
    }
    return (
      "How to Use (Targeted Active Serum Step):\n\n" +
      "1. Apply 2–3 drops onto cleansed, slightly damp skin after toning.\n" +
      "2. Smooth evenly over the entire face and neck, avoiding the immediate eye contours.\n" +
      "3. Press gently with fingertips to optimize dermal absorption. Allow 30–60 seconds before layering your daily moisturizer."
    );
  }

  // 2. Sunscreens & Daily Defense
  if (
    category.includes("Sunscreen") ||
    name.includes("sunscreen") ||
    name.includes("spf") ||
    name.includes("sun relief") ||
    name.includes("daily defense")
  ) {
    return (
      "How to Use (UV & Environmental Protection Step):\n\n" +
      "1. Apply generously as the final step of your morning skincare routine, at least 15 minutes before sun exposure.\n" +
      "2. Use approximately two finger lengths for adequate face and neck coverage.\n" +
      "3. Reapply every 2 hours during continuous outdoor activity, swimming, or excessive perspiration."
    );
  }

  // 3. Cleansers & Masks
  if (
    category.includes("Cleanser") ||
    category.includes("Mask") ||
    name.includes("cleanser") ||
    name.includes("wash") ||
    name.includes("foam") ||
    name.includes("mask")
  ) {
    if (name.includes("mask")) {
      return (
        "How to Use (Intensive Recovery Mask):\n\n" +
        "1. Smooth an even layer over thoroughly cleansed, dry skin.\n" +
        "2. Leave on for 10–15 minutes (or as an overnight sleeping treatment if indicated).\n" +
        "3. Rinse with lukewarm water or pat remaining essence gently into the skin. Use 2–3 times weekly."
      );
    }
    return (
      "How to Use (Gentle Cleansing Step):\n\n" +
      "1. Wet face with lukewarm water. Dispense a dime-sized amount onto clean hands.\n" +
      "2. Massage into skin in gentle circular motions for 60 seconds to break down impurities and surface sebum.\n" +
      "3. Rinse thoroughly and pat dry with a soft, clean towel. Follow with toner or serum while skin remains damp."
    );
  }

  // 4. Barrier Repair, Q10, Anti-Aging & Moisturizing Creams
  return (
    "How to Use (Moisture & Barrier Sealing Step):\n\n" +
    "1. Warm a nickel-sized amount between fingertips.\n" +
    "2. Gently press and smooth upwards over cleansed face, neck, and dry target zones.\n" +
    "3. Use morning and night to lock in hydration and reinforce the natural epidermal barrier."
  );
}
