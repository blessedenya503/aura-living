import React from "react";
import { Tip, Kbd } from "@/components/ui/tips-panel";
import type { OrderItem } from "@/lib/store-db";

/**
 * Generates tailored clinical advisory tips for each ordered product item,
 * outlining vital usage rules and explicit dermatological/trichological contraindications
 * (e.g. what the product cannot do).
 */
export function getProductClinicalTips(item: OrderItem): Tip[] {
  const name = item.name.toLowerCase();
  const brand = item.brand || "AURA Laboratory";

  // Check product category/type
  const isHairCare = /shampoo|conditioner|hair|scalp|curl|headband|forming cream/i.test(name);
  const isFragrance = /cologne|perfume|fragrance|parfum/i.test(name);
  const isCleanser = /cleanser|wash|micellar|wipes|eraser/i.test(name);
  const isSunscreen = /spf|sunscreen|mineral/i.test(name);
  const isRetinolOrAcid = /retinol|salicylic|bha|aha|glycolic|azelaic|acid/i.test(name);

  if (isHairCare) {
    return [
      {
        id: `clinical-app-${item.productId}`,
        title: "Trichological Scalp Application",
        description: `Apply ${item.name} uniformly to hair lengths and follicular margins. Massage in circular motions for 90 seconds.`,
        action: "Mark Understood",
        doneLabel: "Protocol Verified",
        primary: true,
      },
      {
        id: `clinical-limit-${item.productId}`,
        title: "Medical Limitation & Contraindication",
        description: "Trichological contraindication: Formulated exclusively for keratinous hair fibers. Cannot provide trans-epidermal facial hydration or replace topical facial barrier lipids.",
        action: "Confirm Scope",
        doneLabel: "Limitation Acknowledged",
      },
      {
        id: `clinical-patch-${item.productId}`,
        title: "Pre-Usage Sensitivity Screen",
        description: (
          <>
            Perform an auricular patch test behind the ear for <Kbd>24H</Kbd> prior to comprehensive application.
          </>
        ),
        action: "Schedule Test",
        doneLabel: "Test Scheduled",
      },
      {
        id: `clinical-storage-${item.productId}`,
        title: "Cold-Stability Storage",
        description: "Store in ambient conditions (15°C–25°C) away from direct solar UV degradation to maintain active botanical emulsion stability.",
        action: "Acknowledge",
        doneLabel: "Storage Set",
      },
    ];
  }

  if (isFragrance) {
    return [
      {
        id: `clinical-app-${item.productId}`,
        title: "Olfactory Dispersion Protocol",
        description: `Atomize ${item.name} from a distance of 15–20cm onto hemodynamic pulse nodes (carotid arteries, inner wrists).`,
        action: "Mark Understood",
        doneLabel: "Protocol Verified",
        primary: true,
      },
      {
        id: `clinical-limit-${item.productId}`,
        title: "Medical Limitation & Contraindication",
        description: "Aesthetic olfactory compound: Contains concentrated aromatic compounds. Cannot treat dermatological conditions, eczema, or hydrate dermal layers.",
        action: "Confirm Scope",
        doneLabel: "Limitation Acknowledged",
      },
      {
        id: `clinical-avoid-${item.productId}`,
        title: "Mucosal & Ocular Protection",
        description: "Do not apply to excoriated, erythematous, or post-procedural epidermal surfaces. Avoid all mucosal contact.",
        action: "Understood",
        doneLabel: "Safety Checked",
      },
    ];
  }

  if (isSunscreen) {
    return [
      {
        id: `clinical-app-${item.productId}`,
        title: "Photoprotective Application Dosimetry",
        description: (
          <>
            Apply <Kbd>2mg/cm²</Kbd> (approximately 2 finger lengths) 15 minutes before UV exposure. Re-apply every 120 minutes.
          </>
        ),
        action: "Verify Dose",
        doneLabel: "Dosimetry Confirmed",
        primary: true,
      },
      {
        id: `clinical-limit-${item.productId}`,
        title: "Medical Limitation & Contraindication",
        description: "Photoprotective shield only: Blocks UVA/UVB radiation but cannot reverse structural photo-aging, remove deep dermal rhytids, or substitute for nocturnal lipid replenishment.",
        action: "Confirm Scope",
        doneLabel: "Limitation Acknowledged",
      },
      {
        id: `clinical-night-${item.productId}`,
        title: "Circadian Cleansing Protocol",
        description: "Must be thoroughly dissolved at night using double-cleansing or lipid emulsifiers to prevent comedogenesis.",
        action: "Acknowledge",
        doneLabel: "Routine Updated",
      },
    ];
  }

  if (isCleanser) {
    return [
      {
        id: `clinical-app-${item.productId}`,
        title: "Hydrolipidic Cleansing Protocol",
        description: `Emulsify with lukewarm water (32°C). Cleanse stratum corneum gently for 60 seconds without mechanical abrasiveness.`,
        action: "Mark Understood",
        doneLabel: "Protocol Verified",
        primary: true,
      },
      {
        id: `clinical-limit-${item.productId}`,
        title: "Medical Limitation & Contraindication",
        description: "Surfactant clearance only: Designed to solubilize sebum and particulate residue. Cannot act as a leave-on humectant, cure cystic inflammation, or replace occlusive moisturizers.",
        action: "Confirm Scope",
        doneLabel: "Limitation Acknowledged",
      },
      {
        id: `clinical-frequency-${item.productId}`,
        title: "Epithelial Barrier Preservation",
        description: "Limit usage to twice daily (AM/PM). Excessive surfactant exposure strips cutaneous ceramides and disrupts acid mantle pH.",
        action: "Acknowledge",
        doneLabel: "Frequency Set",
      },
    ];
  }

  if (isRetinolOrAcid) {
    return [
      {
        id: `clinical-app-${item.productId}`,
        title: "Keratolytic Retinization Schedule",
        description: (
          <>
            Introduce gradually: Use <Kbd>2x weekly</Kbd> on completely dry epidermis, buffering with ceramide barrier cream.
          </>
        ),
        action: "Mark Understood",
        doneLabel: "Protocol Verified",
        primary: true,
      },
      {
        id: `clinical-limit-${item.productId}`,
        title: "Medical Limitation & Contraindication",
        description: "Bioactive keratolytic: Promotes cellular desquamation and epidermal renewal. Cannot hydrate cutaneous tissue, cannot be used on damp or sunburnt skin, and must not be applied to eye contour.",
        action: "Confirm Scope",
        doneLabel: "Limitation Acknowledged",
      },
      {
        id: `clinical-spf-${item.productId}`,
        title: "Mandatory Photoprotection",
        description: "Accelerated cellular turnover heightens photosensitivity. Strict daily application of broad-spectrum SPF 30+ is mandatory.",
        action: "Commit to SPF",
        doneLabel: "SPF Confirmed",
      },
    ];
  }

  // Default Skincare / Moisturizing Creams / Serums
  return [
    {
      id: `clinical-app-${item.productId}`,
      title: "Trans-Epidermal Infusion Protocol",
      description: `Apply ${item.name} to slightly damp stratum corneum immediately post-cleansing to seal intra-cellular water molecules.`,
      action: "Mark Understood",
      doneLabel: "Protocol Verified",
      primary: true,
    },
    {
      id: `clinical-limit-${item.productId}`,
      title: "Medical Limitation & Contraindication",
      description: "Dermatological humectant/emollient: Formulated strictly for epidermal barrier hydration. Cannot penetrate follicular shafts for hair re-growth, cannot replace pharmaceutical corticosteroids, and does not alter sebaceous genetics.",
      action: "Confirm Scope",
      doneLabel: "Limitation Acknowledged",
    },
    {
      id: `clinical-pairing-${item.productId}`,
      title: "Biochemical Compatibility Check",
      description: "Compatible with physiological lipids (cholesterol, fatty acids, ceramides). Layer thinnest water-soluble formulations before dense occlusives.",
      action: "Review Compatibility",
      doneLabel: "Stack Verified",
    },
    {
      id: `clinical-expiration-${item.productId}`,
      title: "Batch Bioactivity Lifespan",
      description: (
        <>
          Optimal clinical bioactivity retained for <Kbd>12M</Kbd> post-unsealing. Store below 25°C in opaque packaging.
        </>
      ),
      action: "Acknowledge",
      doneLabel: "Logged to Record",
    },
  ];
}
