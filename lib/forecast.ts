import type { CallRecord, ForecastCategory, Opportunity } from "@/data/types";
import { evidenceGate } from "@/lib/evidenceGate";

export interface CategoryTotals {
  commit: number;
  bestCase: number;
  pipeline: number;
  commitCount: number;
  bestCaseCount: number;
  pipelineCount: number;
}

export interface ForecastResult {
  repCalled: CategoryTotals;
  evidenceAdjusted: CategoryTotals;
  /** Evidence-adjusted Commit minus rep-called Commit. Negative means the gate cut the number. */
  commitDelta: number;
  commitDeltaPct: number | null;
}

function emptyTotals(): CategoryTotals {
  return {
    commit: 0,
    bestCase: 0,
    pipeline: 0,
    commitCount: 0,
    bestCaseCount: 0,
    pipelineCount: 0,
  };
}

function addTo(totals: CategoryTotals, category: ForecastCategory, amount: number): void {
  switch (category) {
    case "Commit":
      totals.commit += amount;
      totals.commitCount += 1;
      break;
    case "Best Case":
      totals.bestCase += amount;
      totals.bestCaseCount += 1;
      break;
    case "Pipeline":
      totals.pipeline += amount;
      totals.pipelineCount += 1;
      break;
    default: {
      const _exhaustive: never = category;
      return _exhaustive;
    }
  }
}

export function forecast(
  opps: Opportunity[],
  calls: CallRecord[],
  asOf: string,
): ForecastResult {
  const repCalled = emptyTotals();
  const evidenceAdjusted = emptyTotals();

  for (const opp of opps) {
    addTo(repCalled, opp.repForecastCategory, opp.amount);
    const gate = evidenceGate(opp, calls, asOf);
    addTo(evidenceAdjusted, gate.allowedCategory, opp.amount);
  }

  const commitDelta = evidenceAdjusted.commit - repCalled.commit;
  const commitDeltaPct =
    repCalled.commit === 0
      ? null
      : Math.round((commitDelta / repCalled.commit) * 1000) / 10;

  return { repCalled, evidenceAdjusted, commitDelta, commitDeltaPct };
}
