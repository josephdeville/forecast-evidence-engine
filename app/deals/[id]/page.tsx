import Link from "next/link";
import { notFound } from "next/navigation";
import { calls, opportunities } from "@/data";
import { CallTimeline } from "@/components/CallTimeline";
import { CategoryBadge } from "@/components/CategoryBadge";
import { GatePanel } from "@/components/GatePanel";
import { MeddiccGrid } from "@/components/MeddiccGrid";
import { AS_OF_DATE } from "@/lib/constants";
import { formatIsoDate } from "@/lib/dates";
import { evaluateDeal } from "@/lib/evaluate";
import { explainDeal } from "@/lib/explain";
import { formatDays, formatUsd } from "@/lib/format";

export function generateStaticParams() {
  return opportunities.map((opp) => ({ id: opp.id }));
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opp = opportunities.find((item) => item.id === id);
  if (!opp) {
    notFound();
  }

  const related = calls.filter((call) => call.opportunityId === opp.id);
  const evaluation = evaluateDeal(opp, related, AS_OF_DATE);
  const blocks = explainDeal(evaluation);

  return (
    <div className="space-y-6">
      <p className="text-xs text-muted">
        <Link href="/deals" className="hover:text-foreground">
          All deals
        </Link>
        <span className="mx-2">/</span>
        {opp.accountName}
      </p>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            {opp.segment} · {opp.stage} · close {formatIsoDate(opp.closeDate)}
          </p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight">{opp.accountName}</h1>
          <p className="mt-2 text-sm text-muted">
            {opp.ownerName} · {opp.id}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl tabular">{formatUsd(opp.amount)}</p>
          <div className="mt-2 flex justify-end gap-2">
            <CategoryBadge category={opp.repForecastCategory} />
            <CategoryBadge category={evaluation.evidenceAdjustedCategory} />
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <article className="border border-border bg-surface p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted">MEDDICC</p>
          <p className="mt-1 font-mono text-xl tabular">
            {evaluation.meddicc.score.toFixed(1)}
          </p>
          <p className="mt-1 text-xs text-muted">
            {evaluation.meddicc.earned} of {evaluation.meddicc.possible} points
          </p>
        </article>
        <article className="border border-border bg-surface p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            Days since last meaningful call
          </p>
          <p className="mt-1 font-mono text-xl tabular">
            {formatDays(evaluation.freshness.daysSinceLastMeaningfulCall)}
          </p>
          <p className="mt-1 text-xs text-muted">
            {evaluation.freshness.lastMeaningfulCallId
              ? evaluation.freshness.lastMeaningfulCallId
              : "No meaningful external call"}
          </p>
        </article>
        <article className="border border-border bg-surface p-4">
          <p className="text-[11px] uppercase tracking-wide text-muted">
            External voices
          </p>
          <p className="mt-1 font-mono text-xl tabular">
            {evaluation.multiThread.distinctExternalCount}
          </p>
          <p className="mt-1 text-xs text-muted">
            Economic buyer on a call: {evaluation.economicBuyer.engaged ? "yes" : "no"}
          </p>
        </article>
      </section>

      <GatePanel gate={evaluation.gate} blocks={blocks} />
      <MeddiccGrid meddicc={evaluation.meddicc} />
      <CallTimeline calls={related} />
    </div>
  );
}
