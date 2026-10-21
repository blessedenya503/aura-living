import { NextResponse } from "next/server";
import { isRequestAdminAuthenticated } from "@/lib/admin-auth";
import { readStoreDb, writeStoreDb } from "@/lib/store-db";
import { DEFAULT_CLINICAL_CASES, type ClinicalStudyCase } from "@/lib/clinical-cases";

export const dynamic = "force-dynamic";

const str = (v: unknown, max = 600) => (typeof v === "string" ? v.slice(0, max) : "");

function sanitizeCase(raw: any, idx: number): ClinicalStudyCase {
  const metrics = Array.isArray(raw?.metrics) ? raw.metrics.slice(0, 3) : [];
  while (metrics.length < 3) metrics.push({ label: "", value: "", detail: "" });
  return {
    id: str(raw?.id, 80) || `case-${Date.now()}-${idx}`,
    title: str(raw?.title, 160),
    indication: str(raw?.indication, 160),
    duration: str(raw?.duration, 80),
    beforeImg: str(raw?.beforeImg, 2000),
    afterImg: str(raw?.afterImg, 2000),
    beforeTitle: str(raw?.beforeTitle, 160),
    beforeCondition: str(raw?.beforeCondition),
    afterTitle: str(raw?.afterTitle, 160),
    afterResult: str(raw?.afterResult),
    metrics: metrics.map((m: any) => ({
      label: str(m?.label, 60),
      value: str(m?.value, 30),
      detail: str(m?.detail, 80),
    })),
    dermatologistQuote: str(raw?.dermatologistQuote),
  };
}

export async function GET() {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = readStoreDb();
  const cases =
    Array.isArray(db.clinicalCases) && db.clinicalCases.length > 0
      ? db.clinicalCases
      : DEFAULT_CLINICAL_CASES;
  return NextResponse.json({ cases, isCustom: Array.isArray(db.clinicalCases) && db.clinicalCases.length > 0 });
}

export async function PUT(req: Request) {
  if (!(await isRequestAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const db = readStoreDb();

    if (body?.reset === true) {
      delete db.clinicalCases;
      writeStoreDb(db);
      return NextResponse.json({ success: true, cases: DEFAULT_CLINICAL_CASES });
    }

    if (!Array.isArray(body?.cases) || body.cases.length === 0 || body.cases.length > 12) {
      return NextResponse.json({ error: "Provide between 1 and 12 slides." }, { status: 400 });
    }
    const cases = body.cases.map(sanitizeCase);
    const bad = cases.findIndex((c: ClinicalStudyCase) => !c.beforeImg || !c.afterImg);
    if (bad !== -1) {
      return NextResponse.json(
        { error: `Slide ${bad + 1} needs both a before and an after image.` },
        { status: 400 }
      );
    }
    db.clinicalCases = cases;
    writeStoreDb(db);
    return NextResponse.json({ success: true, cases });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to save slides" }, { status: 500 });
  }
}
