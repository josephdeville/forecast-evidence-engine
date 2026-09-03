import type { TrailingWeek } from "@/data/types";
import { formatSignedPct, formatUsdCompact } from "@/lib/format";

function variancePct(forecast: number, actual: number): number {
  return Math.round(((forecast - actual) / actual) * 1000) / 10;
}

export function AccuracyTable({
  weeks,
  currentRep,
  currentEvidence,
}: {
  weeks: TrailingWeek[];
  currentRep: number;
  currentEvidence: number;
}) {
  const rows: TrailingWeek[] = [
    ...weeks.filter((week) => week.actualClosed !== null),
    {
      weekEnding: "2026-09-03",
      label: "This week (in progress)",
      repCalledCommit: currentRep,
      evidenceAdjustedCommit: currentEvidence,
      actualClosed: null,
    },
  ];

  return (
    <section className="border border-border bg-surface">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Illustrative trailing accuracy
        </h2>
        <p className="mt-1 text-xs text-muted">
          Fabricated weekly snapshots to show the ±5% target. Not real closed-won history.
          Evidence-adjusted stays near actuals; the rep-called number does not.
        </p>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-[11px] uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">Week</th>
              <th className="px-4 py-2 font-medium">Rep-called</th>
              <th className="px-4 py-2 font-medium">Evidence-adjusted</th>
              <th className="px-4 py-2 font-medium">Actual</th>
              <th className="px-4 py-2 font-medium">Rep vs actual</th>
              <th className="px-4 py-2 font-medium">Evidence vs actual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((week) => {
              const repVar =
                week.actualClosed === null
                  ? null
                  : variancePct(week.repCalledCommit, week.actualClosed);
              const evVar =
                week.actualClosed === null
                  ? null
                  : variancePct(week.evidenceAdjustedCommit, week.actualClosed);
              const inBand = evVar !== null && Math.abs(evVar) <= 5;
              return (
                <tr key={week.weekEnding} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-3 text-xs">{week.label}</td>
                  <td className="px-4 py-3 font-mono text-xs tabular">
                    {formatUsdCompact(week.repCalledCommit)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs tabular">
                    {formatUsdCompact(week.evidenceAdjustedCommit)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs tabular">
                    {week.actualClosed === null ? "—" : formatUsdCompact(week.actualClosed)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs tabular text-danger">
                    {formatSignedPct(repVar)}
                  </td>
                  <td
                    className={`px-4 py-3 font-mono text-xs tabular ${
                      evVar === null ? "text-muted" : inBand ? "text-success" : "text-danger"
                    }`}
                  >
                    {formatSignedPct(evVar)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
