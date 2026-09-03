import { calls, opportunities } from "@/data";
import { DealsTable, type DealTableRow } from "@/components/DealsTable";
import { AS_OF_DATE } from "@/lib/constants";
import { evaluateAll } from "@/lib/evaluate";

export default function DealsPage() {
  const evaluations = evaluateAll(opportunities, calls, AS_OF_DATE);
  const rows: DealTableRow[] = evaluations.map((evaluation) => ({
    id: evaluation.opportunity.id,
    accountName: evaluation.opportunity.accountName,
    amount: evaluation.opportunity.amount,
    stage: evaluation.opportunity.stage,
    ownerName: evaluation.opportunity.ownerName,
    segment: evaluation.opportunity.segment,
    closeDate: evaluation.opportunity.closeDate,
    repCategory: evaluation.opportunity.repForecastCategory,
    evidenceCategory: evaluation.evidenceAdjustedCategory,
    meddiccScore: evaluation.meddicc.score,
    daysSinceLastMeaningfulCall: evaluation.freshness.daysSinceLastMeaningfulCall,
    gatePassed: evaluation.gate.passed,
    violationSummary: evaluation.gate.violations.map((item) => item.reason).join(" "),
    distinctExternalCount: evaluation.multiThread.distinctExternalCount,
  }));

  return (
    <div className="space-y-4">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          All deals
        </p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight">
          Rep category versus evidence-adjusted category
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Failing rows are flagged. Sort any column. Open a deal to see the
          exact call or missing field behind the score.
        </p>
      </header>
      <DealsTable rows={rows} />
    </div>
  );
}
