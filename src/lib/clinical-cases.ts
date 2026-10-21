export interface ClinicalStudyCase {
  id: string;
  title: string;
  indication: string;
  duration: string;
  beforeImg: string;
  afterImg: string;
  beforeTitle: string;
  beforeCondition: string;
  afterTitle: string;
  afterResult: string;
  metrics: {
    label: string;
    value: string;
    detail: string;
  }[];
  dermatologistQuote: string;
}

export const DEFAULT_CLINICAL_CASES: ClinicalStudyCase[] = [
  {
    id: "case-barrier-repair",
    title: "Compromised Moisture Barrier & Acute Erythema",
    indication: "Barrier Repair & Occlusive Slugging",
    duration: "14 Days Clinical Trial",
    beforeImg:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop",
    afterImg:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop",
    beforeTitle: "Day 0: Baseline Compromised Barrier",
    beforeCondition:
      "Micro-fissuring of lipid stratum corneum, elevated transepidermal water loss (TEWL), visible flare redness and stinging.",
    afterTitle: "Day 14: Restored Multilamellar Matrix",
    afterResult:
      "98% stratum corneum barrier closure, calmed dermal inflammation, balanced acid mantle with glass-like lipid sheen.",
    metrics: [
      { label: "Barrier Hydration", value: "+89%", detail: "Corneometer CM 825" },
      { label: "TEWL Reduction", value: "-46%", detail: "Tewameter TM 300" },
      { label: "Erythema / Redness", value: "-52%", detail: "Chromameter CR-400" },
    ],
    dermatologistQuote:
      "Instrumental evaluation confirmed full barrier reconstruction within 14 consecutive nights of occlusive lipid replenishment.",
  },
  {
    id: "case-dark-spots",
    title: "Post-Inflammatory Hyperpigmentation & Melasma",
    indication: "Clinical Brightening & Spot Reduction",
    duration: "21 Days Clinical Trial",
    beforeImg:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    afterImg:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop",
    beforeTitle: "Day 0: Clustered Melanin Pigmentation",
    beforeCondition:
      "Localized melanin hyper-accumulation, uneven UV sun damage marks, dull texture around cheekbones and jawline.",
    afterTitle: "Day 21: Visible Spot Dispersion",
    afterResult:
      "Statistically significant reduction in localized melanin density; luminous, unified and radiant skin surface.",
    metrics: [
      { label: "Dark Spot Contrast", value: "-41%", detail: "VISIA-CR Imaging" },
      { label: "Skin Luminosity", value: "+64%", detail: "Glossymeter GL 200" },
      { label: "Tone Uniformity", value: "+73%", detail: "Clinical Assessment" },
    ],
    dermatologistQuote:
      "Targeted tyrosinase inhibition visibly degraded stubborn pigment clusters without rebound irritation or halo effect.",
  },
  {
    id: "case-collagen-bounce",
    title: "Fine Expression Creases & Loss of Dermal Elasticity",
    indication: "Anti-Wrinkle & Peptide Plumping",
    duration: "28 Days Clinical Trial",
    beforeImg:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=800&auto=format&fit=crop",
    afterImg:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop",
    beforeTitle: "Day 0: Micro-Creasing & Volume Depletion",
    beforeCondition:
      "Pronounced nasolabial micro-creasing, depleted glycosaminoglycans, lack of bounce and rough dry texture.",
    afterTitle: "Day 28: Visibly Plumped Collagen Architecture",
    afterResult:
      "Re-densified dermal matrix, sustained intercellular volume, smoothed fine expression lines with supple elastic rebound.",
    metrics: [
      { label: "Dermal Elasticity", value: "+58%", detail: "Cutometer MPA 580" },
      { label: "Wrinkle Depth", value: "-34%", detail: "PRIMOS 3D Topometry" },
      { label: "Smoothness Index", value: "+81%", detail: "Profilometry Scan" },
    ],
    dermatologistQuote:
      "Patients presented notable rebound firmness and sustained volumetric hydration across all facial treatment vectors.",
  },
  {
    id: "case-extreme-dryness",
    title: "Xerosis & Atopic Flaking Epidermal Breakdown",
    indication: "72H Deep Moisture Slugging",
    duration: "7 Days Rapid Recovery",
    beforeImg:
      "https://images.unsplash.com/photo-1512290900672-1f416caab8a2?q=80&w=800&auto=format&fit=crop",
    afterImg:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
    beforeTitle: "Day 0: Flaking Dry Stratum Corneum",
    beforeCondition:
      "Tight, painful xerosis with chalky surface flaking, broken moisture seal, and sensitivity to environmental cold.",
    afterTitle: "Day 7: Continuous 72H Deep Hydration Seal",
    afterResult:
      "Complete epidermal softening, smooth silky lipid barrier lock, zero peeling and restored comfort all day.",
    metrics: [
      { label: "Continuous Moisture", value: "72 Hours", detail: "Prolonged Slugging" },
      { label: "Roughness Desquamation", value: "-78%", detail: "D-Squame Disc Test" },
      { label: "Barrier Comfort", value: "100%", detail: "Patient Self-Appraisal" },
    ],
    dermatologistQuote:
      "Occlusive lipid restoration provided immediate symptom cessation and reinforced cell envelope cohesion within 48 hours.",
  },
];
