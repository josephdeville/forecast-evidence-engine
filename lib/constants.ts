import type {
  ForecastCategory,
  MeddiccFieldKey,
  MeddiccSource,
  Seniority,
} from "@/data/types";

/** Frozen as-of date so freshness math is deterministic in the demo and in tests. */
export const AS_OF_DATE = "2026-09-03";

export const MEANINGFUL_CALL_MIN_SECONDS = 180;
export const COMMIT_MAX_STALE_DAYS = 14;
export const BEST_CASE_MAX_STALE_DAYS = 45;
export const MEDDICC_COMMIT_FLOOR = 55;
export const MEDDICC_BEST_CASE_FLOOR = 30;

/** Synthetic quarterly quota used only for the coverage ratio on the CRO view. */
export const QUARTERLY_QUOTA = 3_200_000;

export const MEDDICC_FIELD_KEYS: readonly MeddiccFieldKey[] = [
  "metrics",
  "economicBuyer",
  "decisionCriteria",
  "decisionProcess",
  "paperProcess",
  "identifiedPain",
  "champion",
  "competition",
] as const;

export const MEDDICC_FIELD_LABELS: Record<MeddiccFieldKey, string> = {
  metrics: "Metrics",
  economicBuyer: "Economic buyer",
  decisionCriteria: "Decision criteria",
  decisionProcess: "Decision process",
  paperProcess: "Paper process",
  identifiedPain: "Identified pain",
  champion: "Champion",
  competition: "Competition",
};

export const SOURCE_WEIGHT: Record<MeddiccSource, number> = {
  call: 1,
  crm: 0.5,
  absent: 0,
};

export const LATE_STAGES = [
  "Proposal",
  "Negotiation",
  "Verbal Commit",
] as const;

export function seniorityWeight(seniority: Seniority): number {
  switch (seniority) {
    case "ic":
      return 1;
    case "manager":
      return 1.5;
    case "director":
      return 2;
    case "vp":
      return 2.5;
    case "c-level":
      return 3;
    default: {
      const _exhaustive: never = seniority;
      return _exhaustive;
    }
  }
}

export function categoryRank(category: ForecastCategory): number {
  switch (category) {
    case "Pipeline":
      return 0;
    case "Best Case":
      return 1;
    case "Commit":
      return 2;
    default: {
      const _exhaustive: never = category;
      return _exhaustive;
    }
  }
}

export function lowerCategory(
  a: ForecastCategory,
  b: ForecastCategory,
): ForecastCategory {
  return categoryRank(a) <= categoryRank(b) ? a : b;
}
