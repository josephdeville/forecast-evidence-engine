import type { CallRecord, ForecastCategory, Opportunity } from "@/data/types";
import {
  BEST_CASE_MAX_STALE_DAYS,
  COMMIT_MAX_STALE_DAYS,
  MEDDICC_BEST_CASE_FLOOR,
  MEDDICC_COMMIT_FLOOR,
  lowerCategory,
} from "@/lib/constants";
import { economicBuyerEngaged } from "@/lib/economicBuyerEngaged";
import { evidenceFreshness } from "@/lib/evidenceFreshness";
import { formatIsoDate } from "@/lib/dates";
import { meddiccScore } from "@/lib/meddiccScore";

export type GateViolationCode =
  | "no_meaningful_calls"
  | "stale_evidence"
  | "economic_buyer_absent"
  | "meddicc_below_floor";

export interface GateViolation {
  code: GateViolationCode;
  reason: string;
  evidence: {
    callId?: string;
    field?: string;
    detail: string;
  };
}

export interface EvidenceGateResult {
  claimedCategory: ForecastCategory;
  /** Highest category the evidence supports. Never above the rep's call. */
  allowedCategory: ForecastCategory;
  highestSupported: ForecastCategory;
  passed: boolean;
  violations: GateViolation[];
}

function commitViolations(
  opp: Opportunity,
  calls: CallRecord[],
  asOf: string,
): GateViolation[] {
  const freshness = evidenceFreshness(opp, calls, asOf);
  const buyer = economicBuyerEngaged(opp, calls);
  const meddicc = meddiccScore(opp, calls);
  const violations: GateViolation[] = [];

  if (freshness.meaningfulCallCount === 0) {
    violations.push({
      code: "no_meaningful_calls",
      reason:
        "No meaningful external call is on record. Calls under 3 minutes do not count.",
      evidence: {
        detail:
          freshness.ignoredShortCallCount > 0
            ? `${freshness.ignoredShortCallCount} short call(s) were ignored as not meaningful.`
            : "No conversation records are attached to this opportunity.",
      },
    });
  } else if (
    freshness.daysSinceLastMeaningfulCall !== null &&
    freshness.daysSinceLastMeaningfulCall > COMMIT_MAX_STALE_DAYS
  ) {
    const lastDate = freshness.lastMeaningfulCallDate
      ? formatIsoDate(freshness.lastMeaningfulCallDate)
      : "unknown date";
    violations.push({
      code: "stale_evidence",
      reason: `Last meaningful external call was ${freshness.daysSinceLastMeaningfulCall} days ago (Commit requires evidence within ${COMMIT_MAX_STALE_DAYS} days).`,
      evidence: {
        callId: freshness.lastMeaningfulCallId ?? undefined,
        detail: `Last meaningful call: ${freshness.lastMeaningfulCallTitle ?? "untitled"} (${freshness.lastMeaningfulCallId ?? "none"}) on ${lastDate}.`,
      },
    });
  }

  if (!buyer.engaged) {
    const named = buyer.namedInCrm;
    violations.push({
      code: "economic_buyer_absent",
      reason: named
        ? `No economic buyer has been on a call. CRM names ${named}, but that person does not appear on any conversation.`
        : "No economic buyer is named in the CRM, and none has appeared on a call.",
      evidence: {
        field: "economicBuyer",
        detail:
          buyer.callsReviewed.length === 0
            ? "No calls to review."
            : `Calls reviewed: ${buyer.callsReviewed.join(", ")}.`,
      },
    });
  }

  if (meddicc.score < MEDDICC_COMMIT_FLOOR) {
    violations.push({
      code: "meddicc_below_floor",
      reason: `MEDDICC score ${meddicc.score} is below the Commit floor of ${MEDDICC_COMMIT_FLOOR}. Call-corroborated fields count more than CRM-only text; absent fields count zero.`,
      evidence: {
        detail: `Earned ${meddicc.earned} of ${meddicc.possible} points across 8 fields.`,
      },
    });
  }

  return violations;
}

function highestSupportedCategory(
  opp: Opportunity,
  calls: CallRecord[],
  asOf: string,
  commitIssues: GateViolation[],
): ForecastCategory {
  if (commitIssues.length === 0) {
    return "Commit";
  }

  const freshness = evidenceFreshness(opp, calls, asOf);
  const meddicc = meddiccScore(opp, calls);
  const staleDays = freshness.daysSinceLastMeaningfulCall;
  const severelyStale =
    freshness.meaningfulCallCount === 0 ||
    (staleDays !== null && staleDays > BEST_CASE_MAX_STALE_DAYS);
  const severelyThin = meddicc.score < MEDDICC_BEST_CASE_FLOOR;

  if (severelyStale || severelyThin) {
    return "Pipeline";
  }
  return "Best Case";
}

export function evidenceGate(
  opp: Opportunity,
  calls: CallRecord[],
  asOf: string,
): EvidenceGateResult {
  const commitIssues = commitViolations(opp, calls, asOf);
  const highestSupported = highestSupportedCategory(
    opp,
    calls,
    asOf,
    commitIssues,
  );
  const allowedCategory = lowerCategory(
    opp.repForecastCategory,
    highestSupported,
  );
  const passed = allowedCategory === opp.repForecastCategory;

  const violations =
    opp.repForecastCategory === "Pipeline"
      ? []
      : opp.repForecastCategory === "Best Case" && highestSupported !== "Pipeline"
        ? []
        : commitIssues;

  return {
    claimedCategory: opp.repForecastCategory,
    allowedCategory,
    highestSupported,
    passed,
    violations,
  };
}
