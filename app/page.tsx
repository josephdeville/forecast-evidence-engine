import { calls, opportunities, trailingWeeks } from "@/data";
import { AccuracyTable } from "@/components/AccuracyTable";
import { ExceptionsTable } from "@/components/ExceptionsTable";
import { FindingsList } from "@/components/FindingsList";
import { ForecastHero } from "@/components/ForecastHero";
import { StatCard } from "@/components/StatCard";
import { AS_OF_DATE } from "@/lib/constants";
import { dashboardModel } from "@/lib/evaluate";
import { formatPct, formatUsd, formatUsdCompact } from "@/lib/format";

export default function CroPage() {
  const model = dashboardModel(opportunities, calls, AS_OF_DATE);
  const { forecast, coverage, findings, exceptions, gateFailCount } = model;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          CRO view
        </p>
        <h1 className="mt-1 text-2xl font-medium tracking-tight">
          Commit is a claim. The conversation is the evidence.
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Salesforce says what the rep believes. The Gong-like record shows what
          actually happened. The evidence gate will not let a deal sit in Commit
          without recent, real conversation evidence. The gap below is the number
          the weekly forecast is wrong by if we trust the CRM alone.
        </p>
      </header>

      <ForecastHero forecast={forecast} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Pipeline coverage"
          value={`${coverage.coverage.toFixed(2)}x`}
          detail={`${formatUsdCompact(coverage.pipelineTotal)} open pipeline against a ${formatUsdCompact(coverage.quota)} synthetic quarterly quota.`}
        />
        <StatCard
          label="Gate failures"
          value={String(gateFailCount)}
          detail="Deals whose rep-called category is not supported by conversation evidence."
        />
        <StatCard
          label="Late-stage mix"
          value={formatPct(coverage.lateStageShare)}
          detail={`${formatUsd(coverage.lateStageAmount)} in Proposal, Negotiation, or Verbal Commit — a conversion proxy, not a historical win rate.`}
        />
        <StatCard
          label="Accuracy target"
          value="±5%"
          detail="The job asks for a ±5% commit accuracy target on a weekly CRO cadence. Trailing snapshots below are illustrative."
        />
      </section>

      <ExceptionsTable rows={exceptions} />

      <div className="grid gap-4 lg:grid-cols-2">
        <FindingsList findings={findings} />
        <AccuracyTable
          weeks={trailingWeeks}
          currentRep={forecast.repCalled.commit}
          currentEvidence={forecast.evidenceAdjusted.commit}
        />
      </div>
    </div>
  );
}
