import type { MeddiccSource } from "@/data/types";

const labels: Record<MeddiccSource, string> = {
  call: "Call evidence",
  crm: "CRM only",
  absent: "Absent",
};

const styles: Record<MeddiccSource, string> = {
  call: "bg-success/15 text-success",
  crm: "bg-warn/15 text-warn",
  absent: "bg-danger/15 text-danger",
};

export function SourceBadge({ source }: { source: MeddiccSource }) {
  return (
    <span
      className={`inline-flex rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide ${styles[source]}`}
    >
      {labels[source]}
    </span>
  );
}
