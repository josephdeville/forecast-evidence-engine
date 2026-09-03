import Link from "next/link";
import type { ExceptionRow } from "@/lib/evaluate";
import { CategoryBadge } from "@/components/CategoryBadge";
import { formatUsd } from "@/lib/format";

export function ExceptionsTable({ rows }: { rows: ExceptionRow[] }) {
  return (
    <section className="border border-border bg-surface">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          This week&apos;s exceptions
        </h2>
        <p className="mt-1 text-xs text-muted">
          The deals a CRO should ask about on the weekly call. Self-serve — not a manual pull.
        </p>
      </header>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-border text-[11px] uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-2 font-medium">Account</th>
              <th className="px-4 py-2 font-medium">Amount</th>
              <th className="px-4 py-2 font-medium">Rep</th>
              <th className="px-4 py-2 font-medium">Adjusted</th>
              <th className="px-4 py-2 font-medium">Ask</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.opportunityId} className="border-b border-border/70 last:border-0">
                <td className="px-4 py-3">
                  <Link
                    href={`/deals/${row.opportunityId}`}
                    className="font-medium hover:text-gold"
                  >
                    {row.accountName}
                  </Link>
                  <div className="text-xs text-muted">{row.ownerName}</div>
                </td>
                <td className="px-4 py-3 font-mono tabular text-xs">
                  {formatUsd(row.amount)}
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={row.claimedCategory} />
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={row.allowedCategory} />
                </td>
                <td className="max-w-xl px-4 py-3 text-xs leading-5 text-muted">
                  {row.ask}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
