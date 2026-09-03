export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="border border-border bg-surface p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        {label}
      </p>
      <p className="mt-2 font-mono text-2xl tabular tracking-tight">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted">{detail}</p>
    </article>
  );
}
