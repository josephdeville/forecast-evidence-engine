import type { ForecastResult } from "@/lib/forecast";
import { formatSignedPct, formatUsd, formatUsdCompact } from "@/lib/format";

export function ForecastHero({ forecast }: { forecast: ForecastResult }) {
  const gapAbs = Math.abs(forecast.commitDelta);
  const cutCount =
    forecast.repCalled.commitCount - forecast.evidenceAdjusted.commitCount;

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <article className="border border-border bg-surface p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Rep-called Commit
        </p>
        <p className="mt-3 font-mono text-4xl tabular tracking-tight">
          {formatUsdCompact(forecast.repCalled.commit)}
        </p>
        <p className="mt-2 text-sm text-muted">
          {forecast.repCalled.commitCount} deals · {formatUsd(forecast.repCalled.commit)} as called by reps
        </p>
      </article>
      <article className="border border-border bg-surface p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Evidence-adjusted Commit
        </p>
        <p className="mt-3 font-mono text-4xl tabular tracking-tight">
          {formatUsdCompact(forecast.evidenceAdjusted.commit)}
        </p>
        <p className="mt-2 text-sm text-muted">
          {forecast.evidenceAdjusted.commitCount} deals that clear the evidence gate
        </p>
      </article>
      <article className="border border-danger/40 bg-danger/10 p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-danger">
          Gap
        </p>
        <p className="mt-3 font-mono text-4xl tabular tracking-tight text-danger">
          {formatUsdCompact(forecast.commitDelta)}
        </p>
        <p className="mt-2 text-sm text-foreground/80">
          {formatSignedPct(forecast.commitDeltaPct)} versus the rep-called number. {cutCount} Commit deal{cutCount === 1 ? "" : "s"} failed the gate ({formatUsd(gapAbs)}).
        </p>
      </article>
    </section>
  );
}
