import type {
  CallRecord,
  MeddiccMap,
  Opportunity,
} from "@/data/types";
import type { MeddiccField, MeddiccSource } from "@/data/types";

function field(value: string, source: MeddiccSource): MeddiccField {
  return { value, source };
}

function absent(): MeddiccField {
  return { value: "", source: "absent" };
}

export function fullMeddicc(source: MeddiccSource = "call"): MeddiccMap {
  return {
    metrics: field("Cut cost 20%", source),
    economicBuyer: field("Alex Rivera, CFO", source),
    decisionCriteria: field("Security and price", source),
    decisionProcess: field("CFO then legal", source),
    paperProcess: field("MSA in legal", source),
    identifiedPain: field("No call record", source),
    champion: field("Sam Lee, VP Ops", source),
    competition: field("HaloQA", source),
  };
}

export function makeOpp(overrides: Partial<Opportunity> = {}): Opportunity {
  return {
    id: "opp-test",
    accountName: "Test Account",
    amount: 100_000,
    stage: "Negotiation",
    closeDate: "2026-09-30",
    ownerName: "Rep Test",
    segment: "Mid-Market",
    repForecastCategory: "Commit",
    meddicc: fullMeddicc("call"),
    ...overrides,
  };
}

export function makeCall(overrides: Partial<CallRecord> = {}): CallRecord {
  return {
    id: "call-test",
    opportunityId: "opp-test",
    date: "2026-08-28",
    durationSeconds: 600,
    participants: [
      { name: "Rep Test", role: "internal", seniority: "ic" },
      { name: "Alex Rivera", role: "external", seniority: "c-level" },
      { name: "Sam Lee", role: "external", seniority: "vp" },
    ],
    title: "Working session",
    summary: "Progressed the deal.",
    riskPhrases: [],
    ...overrides,
  };
}

export { absent, field };
