import type { MeddiccScoreResult } from "@/lib/meddiccScore";
import { SourceBadge } from "@/components/SourceBadge";

export function MeddiccGrid({ meddicc }: { meddicc: MeddiccScoreResult }) {
  return (
    <section className="border border-border bg-surface">
      <header className="flex items-baseline justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            MEDDICC grid
          </h2>
          <p className="mt-1 text-xs text-muted">
            Call evidence counts 1.0, CRM-only 0.5, absent 0.
          </p>
        </div>
        <p className="font-mono text-sm tabular">
          {meddicc.score.toFixed(1)}
          <span className="text-muted"> / 100</span>
        </p>
      </header>
      <div className="grid gap-px bg-border sm:grid-cols-2">
        {meddicc.fields.map((field) => (
          <article key={field.key} className="bg-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-medium">{field.label}</h3>
              <SourceBadge source={field.source} />
            </div>
            <p className="mt-2 text-sm leading-6 text-foreground/90">
              {field.value.trim().length > 0 ? field.value : "No value recorded."}
            </p>
            <p className="mt-2 font-mono text-[11px] text-muted">
              {field.points} pt
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
