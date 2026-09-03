import type { CallRecord, Opportunity } from "@/data/types";
import {
  MEDDICC_FIELD_KEYS,
  MEDDICC_FIELD_LABELS,
  SOURCE_WEIGHT,
} from "@/lib/constants";

export interface MeddiccFieldScore {
  key: (typeof MEDDICC_FIELD_KEYS)[number];
  label: string;
  source: "crm" | "call" | "absent";
  value: string;
  weight: number;
  points: number;
}

export interface MeddiccScoreResult {
  /** 0–100. Call-corroborated fields count twice as much as CRM-only text. */
  score: number;
  earned: number;
  possible: number;
  fields: MeddiccFieldScore[];
}

export function meddiccScore(
  opp: Opportunity,
  calls: CallRecord[] = [],
): MeddiccScoreResult {
  void calls;
  const fields: MeddiccFieldScore[] = MEDDICC_FIELD_KEYS.map((key) => {
    const field = opp.meddicc[key];
    const weight = SOURCE_WEIGHT[field.source];
    return {
      key,
      label: MEDDICC_FIELD_LABELS[key],
      source: field.source,
      value: field.value,
      weight,
      points: weight,
    };
  });

  const earned = fields.reduce((sum, field) => sum + field.points, 0);
  const possible = MEDDICC_FIELD_KEYS.length * SOURCE_WEIGHT.call;
  const score = possible === 0 ? 0 : Math.round((earned / possible) * 1000) / 10;

  return { score, earned, possible, fields };
}
