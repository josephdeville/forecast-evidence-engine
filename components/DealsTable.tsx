"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ForecastCategory } from "@/data/types";
import { CategoryBadge } from "@/components/CategoryBadge";
import { formatDays, formatUsd } from "@/lib/format";

export interface DealTableRow {
  id: string;
  accountName: string;
  amount: number;
  stage: string;
  ownerName: string;
  segment: string;
  closeDate: string;
  repCategory: ForecastCategory;
  evidenceCategory: ForecastCategory;
  meddiccScore: number;
  daysSinceLastMeaningfulCall: number | null;
  gatePassed: boolean;
  violationSummary: string;
  distinctExternalCount: number;
}

type SortKey =
  | "accountName"
  | "amount"
  | "repCategory"
  | "evidenceCategory"
  | "meddiccScore"
  | "daysSinceLastMeaningfulCall"
  | "gatePassed";

function compare(a: DealTableRow, b: DealTableRow, key: SortKey): number {
  switch (key) {
    case "accountName":
      return a.accountName.localeCompare(b.accountName);
    case "amount":
      return a.amount - b.amount;
    case "repCategory":
      return a.repCategory.localeCompare(b.repCategory);
    case "evidenceCategory":
      return a.evidenceCategory.localeCompare(b.evidenceCategory);
    case "meddiccScore":
      return a.meddiccScore - b.meddiccScore;
    case "daysSinceLastMeaningfulCall": {
      const left = a.daysSinceLastMeaningfulCall ?? 10_000;
      const right = b.daysSinceLastMeaningfulCall ?? 10_000;
      return left - right;
    }
    case "gatePassed":
      return Number(a.gatePassed) - Number(b.gatePassed);
    default: {
      const _exhaustive: never = key;
      return _exhaustive;
    }
  }
}

function SortHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: "asc" | "desc";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted hover:text-foreground"
    >
      {label}
      <span className="font-mono text-[10px]">
        {active ? (dir === "asc" ? "↑" : "↓") : ""}
      </span>
    </button>
  );
}

export function DealsTable({ rows }: { rows: DealTableRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("amount");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [failingOnly, setFailingOnly] = useState(false);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setDir(key === "accountName" ? "asc" : "desc");
  }

  const visible = useMemo(() => {
    const filtered = failingOnly ? rows.filter((row) => !row.gatePassed) : rows;
    const sorted = [...filtered].sort((a, b) => compare(a, b, sortKey));
    if (dir === "desc") {
      sorted.reverse();
    }
    return sorted;
  }, [rows, sortKey, dir, failingOnly]);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs text-muted">
          {visible.length} deal{visible.length === 1 ? "" : "s"}
          {failingOnly ? " failing the gate" : ""}
        </p>
        <label className="flex items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={failingOnly}
            onChange={(event) => setFailingOnly(event.target.checked)}
            className="accent-gold"
          />
          Failing gate only
        </label>
      </div>
      <div className="overflow-x-auto border border-border bg-surface">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-border">
            <tr>
              <th className="px-4 py-2">
                <SortHeader
                  label="Account"
                  active={sortKey === "accountName"}
                  dir={dir}
                  onClick={() => toggleSort("accountName")}
                />
              </th>
              <th className="px-4 py-2">
                <SortHeader
                  label="Amount"
                  active={sortKey === "amount"}
                  dir={dir}
                  onClick={() => toggleSort("amount")}
                />
              </th>
              <th className="px-4 py-2">
                <SortHeader
                  label="Rep"
                  active={sortKey === "repCategory"}
                  dir={dir}
                  onClick={() => toggleSort("repCategory")}
                />
              </th>
              <th className="px-4 py-2">
                <SortHeader
                  label="Adjusted"
                  active={sortKey === "evidenceCategory"}
                  dir={dir}
                  onClick={() => toggleSort("evidenceCategory")}
                />
              </th>
              <th className="px-4 py-2">
                <SortHeader
                  label="MEDDICC"
                  active={sortKey === "meddiccScore"}
                  dir={dir}
                  onClick={() => toggleSort("meddiccScore")}
                />
              </th>
              <th className="px-4 py-2">
                <SortHeader
                  label="Last call"
                  active={sortKey === "daysSinceLastMeaningfulCall"}
                  dir={dir}
                  onClick={() => toggleSort("daysSinceLastMeaningfulCall")}
                />
              </th>
              <th className="px-4 py-2">
                <SortHeader
                  label="Gate"
                  active={sortKey === "gatePassed"}
                  dir={dir}
                  onClick={() => toggleSort("gatePassed")}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={row.id}
                className={`border-b border-border/70 last:border-0 ${
                  row.gatePassed ? "" : "bg-danger/10"
                }`}
              >
                <td className="px-4 py-3">
                  <Link href={`/deals/${row.id}`} className="font-medium hover:text-gold">
                    {row.accountName}
                  </Link>
                  <div className="text-xs text-muted">
                    {row.ownerName} · {row.segment} · {row.stage}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular">
                  {formatUsd(row.amount)}
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={row.repCategory} />
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={row.evidenceCategory} />
                </td>
                <td className="px-4 py-3 font-mono text-xs tabular">
                  {row.meddiccScore.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-xs">
                  {formatDays(row.daysSinceLastMeaningfulCall)}
                </td>
                <td className="px-4 py-3">
                  {row.gatePassed ? (
                    <span className="text-xs text-success">Pass</span>
                  ) : (
                    <span className="text-xs text-danger" title={row.violationSummary}>
                      Fail
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
