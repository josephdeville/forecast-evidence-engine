import type { ForecastCategory } from "@/data/types";

const styles: Record<ForecastCategory, string> = {
  Commit: "bg-success/15 text-success",
  "Best Case": "bg-gold/15 text-gold",
  Pipeline: "bg-surface-2 text-muted",
};

export function CategoryBadge({ category }: { category: ForecastCategory }) {
  return (
    <span
      className={`inline-flex rounded px-1.5 py-0.5 font-mono text-[11px] uppercase tracking-wide ${styles[category]}`}
    >
      {category}
    </span>
  );
}
