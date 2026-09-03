import type { ExplanationBlock } from "@/lib/explain";
import type { EvidenceGateResult } from "@/lib/evidenceGate";
import { CategoryBadge } from "@/components/CategoryBadge";

export function GatePanel({
  gate,
  blocks,
}: {
  gate: EvidenceGateResult;
  blocks: ExplanationBlock[];
}) {
  return (
    <section
      className={`border bg-surface ${
        gate.passed ? "border-border" : "border-danger/50"
      }`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Evidence gate
          </h2>
          <p className="mt-1 text-sm">
            {gate.passed ? "Passed — category stands." : "Failed — category demoted."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted">Rep</span>
          <CategoryBadge category={gate.claimedCategory} />
          <span className="text-muted">Adjusted</span>
          <CategoryBadge category={gate.allowedCategory} />
        </div>
      </header>
      <div className="divide-y divide-border">
        {blocks.map((block) => (
          <article key={block.id} className="px-4 py-4">
            <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
              {block.title}
            </h3>
            <p className="mt-2 text-sm leading-6">{block.body}</p>
            {block.citations.length > 0 ? (
              <ul className="mt-2 space-y-1">
                {block.citations.map((citation, index) => (
                  <li key={`${block.id}-${index}`} className="text-xs text-muted">
                    {citation.callId ? (
                      <>
                        Call{" "}
                        <a href={`#${citation.callId}`} className="text-gold hover:underline">
                          {citation.callId}
                        </a>
                        {" — "}
                        {citation.label}
                      </>
                    ) : (
                      citation.label
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
