import type { CallRecord, ForecastCategory, Opportunity } from "@/data/types";
import { LATE_STAGES, QUARTERLY_QUOTA } from "@/lib/constants";
import type { DataQualityFinding } from "@/lib/dataQualityFindings";
import { dataQualityFindings } from "@/lib/dataQualityFindings";
import type { EconomicBuyerEngagedResult } from "@/lib/economicBuyerEngaged";
import { economicBuyerEngaged } from "@/lib/economicBuyerEngaged";
import type { EvidenceFreshnessResult } from "@/lib/evidenceFreshness";
import { evidenceFreshness, meaningfulCallsForOpportunity } from "@/lib/evidenceFreshness";
import type { EvidenceGateResult } from "@/lib/evidenceGate";
import { evidenceGate } from "@/lib/evidenceGate";
import type { ForecastResult } from "@/lib/forecast";
import { forecast } from "@/lib/forecast";
import type { MeddiccScoreResult } from "@/lib/meddiccScore";
import { meddiccScore } from "@/lib/meddiccScore";
import type { MultiThreadScoreResult } from "@/lib/multiThreadScore";
import { multiThreadScore } from "@/lib/multiThreadScore";

export interface DealEvaluation {
  opportunity: Opportunity;
  meddicc: MeddiccScoreResult;
  freshness: EvidenceFreshnessResult;
  multiThread: MultiThreadScoreResult;
  economicBuyer: EconomicBuyerEngagedResult;
  gate: EvidenceGateResult;
  evidenceAdjustedCategory: ForecastCategory;
}

export interface ExceptionRow {
  opportunityId: string;
  accountName: string;
  amount: number;
  ownerName: string;
  claimedCategory: ForecastCategory;
  allowedCategory: ForecastCategory;
  ask: string;
}

export interface CoverageSnapshot {
  pipelineTotal: number;
  quota: number;
  coverage: number;
  lateStageAmount: number;
  lateStageShare: number;
}

export function evaluateDeal(
  opp: Opportunity,
  calls: CallRecord[],
  asOf: string,
): DealEvaluation {
  const related = calls.filter((call) => call.opportunityId === opp.id);
  const gate = evidenceGate(opp, related, asOf);
  return {
    opportunity: opp,
    meddicc: meddiccScore(opp, related),
    freshness: evidenceFreshness(opp, related, asOf),
    multiThread: multiThreadScore(opp, related),
    economicBuyer: economicBuyerEngaged(opp, related),
    gate,
    evidenceAdjustedCategory: gate.allowedCategory,
  };
}

export function evaluateAll(
  opps: Opportunity[],
  calls: CallRecord[],
  asOf: string,
): DealEvaluation[] {
  return opps.map((opp) => evaluateDeal(opp, calls, asOf));
}

export function coverageSnapshot(opps: Opportunity[]): CoverageSnapshot {
  const pipelineTotal = opps.reduce((sum, opp) => sum + opp.amount, 0);
  const lateStageAmount = opps
    .filter((opp) => (LATE_STAGES as readonly string[]).includes(opp.stage))
    .reduce((sum, opp) => sum + opp.amount, 0);
  return {
    pipelineTotal,
    quota: QUARTERLY_QUOTA,
    coverage: pipelineTotal / QUARTERLY_QUOTA,
    lateStageAmount,
    lateStageShare: pipelineTotal === 0 ? 0 : lateStageAmount / pipelineTotal,
  };
}

function exceptionAsk(evaluation: DealEvaluation): string {
  const { gate, multiThread } = evaluation;
  if (gate.violations.length > 0) {
    return gate.violations[0].reason;
  }
  if (multiThread.distinctExternalCount <= 1) {
    return "Single-threaded: only one external voice is on the conversation record. Ask who else is in the buying group.";
  }
  return "Review this week.";
}

export function weeklyExceptions(
  evaluations: DealEvaluation[],
  findings: DataQualityFinding[],
): ExceptionRow[] {
  const byId = new Map<string, ExceptionRow>();

  for (const evaluation of evaluations) {
    const failing = !evaluation.gate.passed;
    const singleThreadCommit =
      evaluation.opportunity.repForecastCategory === "Commit" &&
      evaluation.multiThread.distinctExternalCount <= 1;
    if (!failing && !singleThreadCommit) {
      continue;
    }
    byId.set(evaluation.opportunity.id, {
      opportunityId: evaluation.opportunity.id,
      accountName: evaluation.opportunity.accountName,
      amount: evaluation.opportunity.amount,
      ownerName: evaluation.opportunity.ownerName,
      claimedCategory: evaluation.gate.claimedCategory,
      allowedCategory: evaluation.gate.allowedCategory,
      ask: exceptionAsk(evaluation),
    });
  }

  for (const finding of findings) {
    if (finding.severity !== "high" || !finding.example) {
      continue;
    }
    const evaluation = evaluations.find(
      (item) => item.opportunity.id === finding.example?.opportunityId,
    );
    if (!evaluation) {
      continue;
    }
    if (byId.has(evaluation.opportunity.id)) {
      continue;
    }
    byId.set(evaluation.opportunity.id, {
      opportunityId: evaluation.opportunity.id,
      accountName: evaluation.opportunity.accountName,
      amount: evaluation.opportunity.amount,
      ownerName: evaluation.opportunity.ownerName,
      claimedCategory: evaluation.gate.claimedCategory,
      allowedCategory: evaluation.gate.allowedCategory,
      ask: `${finding.title}. ${finding.example.detail}`,
    });
  }

  return [...byId.values()].sort((a, b) => b.amount - a.amount);
}

export function dashboardModel(
  opps: Opportunity[],
  calls: CallRecord[],
  asOf: string,
): {
  evaluations: DealEvaluation[];
  forecast: ForecastResult;
  coverage: CoverageSnapshot;
  findings: DataQualityFinding[];
  exceptions: ExceptionRow[];
  gateFailCount: number;
} {
  const evaluations = evaluateAll(opps, calls, asOf);
  const findings = dataQualityFindings(opps, calls, asOf);
  return {
    evaluations,
    forecast: forecast(opps, calls, asOf),
    coverage: coverageSnapshot(opps),
    findings,
    exceptions: weeklyExceptions(evaluations, findings),
    gateFailCount: evaluations.filter((item) => !item.gate.passed).length,
  };
}

export { meaningfulCallsForOpportunity };
