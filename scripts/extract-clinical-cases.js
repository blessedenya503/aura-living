const fs = require("fs");
const path = require("path");
const comp = path.join(__dirname, "..", "src", "components", "ClinicalBeforeAfterShowcase.tsx");
const lib = path.join(__dirname, "..", "src", "lib", "clinical-cases.ts");
const lines = fs.readFileSync(comp, "utf-8").split("\n");
// lines 19..131 (1-indexed): interface + const array
const block = lines.slice(18, 131).join("\n");
if (!block.startsWith("export interface ClinicalStudyCase") || !block.trimEnd().endsWith("];")) throw new Error("unexpected block");
const libSrc = block.replace("const CLINICAL_CASES: ClinicalStudyCase[]", "export const DEFAULT_CLINICAL_CASES: ClinicalStudyCase[]") + "\n";
fs.writeFileSync(lib, libSrc);
const rest = [...lines.slice(0, 18), ...lines.slice(132)].join("\n");
fs.writeFileSync(comp, rest);
console.log("moved", block.split("\n").length, "lines");
