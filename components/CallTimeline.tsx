import type { CallRecord } from "@/data/types";
import { MEANINGFUL_CALL_MIN_SECONDS } from "@/lib/constants";
import { formatIsoDate } from "@/lib/dates";
import { formatDuration } from "@/lib/format";

export function CallTimeline({ calls }: { calls: CallRecord[] }) {
  const ordered = [...calls].sort((a, b) => a.date.localeCompare(b.date));

  if (ordered.length === 0) {
    return (
      <section className="border border-border bg-surface p-4">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Call timeline
        </h2>
        <p className="mt-2 text-sm text-muted">No conversation records on this opportunity.</p>
      </section>
    );
  }

  return (
    <section className="border border-border bg-surface">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Call timeline
        </h2>
        <p className="mt-1 text-xs text-muted">
          Calls under {MEANINGFUL_CALL_MIN_SECONDS / 60} minutes are not meaningful for freshness.
        </p>
      </header>
      <ol className="divide-y divide-border">
        {ordered.map((call) => {
          const meaningful =
            call.durationSeconds >= MEANINGFUL_CALL_MIN_SECONDS &&
            call.participants.some((participant) => participant.role === "external");
          const externals = call.participants.filter(
            (participant) => participant.role === "external",
          );
          return (
            <li id={call.id} key={call.id} className="scroll-mt-24 px-4 py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium">{call.title}</p>
                <p className="font-mono text-[11px] text-muted">
                  {formatIsoDate(call.date)} · {formatDuration(call.durationSeconds)} · {call.id}
                </p>
              </div>
              <p className="mt-1 text-xs text-muted">
                {meaningful ? "Meaningful" : "Not meaningful"} · External:{" "}
                {externals.length === 0
                  ? "none"
                  : externals
                      .map((participant) => `${participant.name} (${participant.seniority})`)
                      .join(", ")}
              </p>
              <p className="mt-2 text-sm leading-6 text-foreground/90">{call.summary}</p>
              {call.riskPhrases.length > 0 ? (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {call.riskPhrases.map((phrase) => (
                    <li
                      key={phrase}
                      className="rounded bg-danger/15 px-1.5 py-0.5 font-mono text-[11px] text-danger"
                    >
                      {phrase}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
