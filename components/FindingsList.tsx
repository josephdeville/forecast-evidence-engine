import Link from "next/link";
import type { DataQualityFinding } from "@/lib/dataQualityFindings";

export function FindingsList({ findings }: { findings: DataQualityFinding[] }) {
  return (
    <section className="border border-border bg-surface">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          Data-quality findings
        </h2>
        <p className="mt-1 text-xs text-muted">
          CRM claims versus conversation evidence. Each finding traces to a deal.
        </p>
      </header>
      <ul className="divide-y divide-border">
        {findings.map((finding) => (
          <li key={finding.id} className="px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium">{finding.title}</p>
              <span className="font-mono text-xs text-gold tabular">
                {finding.count}
              </span>
            </div>
            {finding.example ? (
              <p className="mt-1 text-xs leading-5 text-muted">
                Example:{" "}
                <Link
                  href={`/deals/${finding.example.opportunityId}`}
                  className="text-foreground underline-offset-2 hover:underline"
                >
                  {finding.example.accountName}
                </Link>
                {" — "}
                {finding.example.detail}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
