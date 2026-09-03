import type { DealEvaluation } from "@/lib/evaluate";
import { COMMIT_MAX_STALE_DAYS, MEANINGFUL_CALL_MIN_SECONDS } from "@/lib/constants";
import { formatIsoDate } from "@/lib/dates";
import { formatDays } from "@/lib/format";

export interface Citation {
  kind: "call" | "field" | "absence";
  callId?: string;
  fieldKey?: string;
  label: string;
}

export interface ExplanationBlock {
  id: string;
  title: string;
  body: string;
  citations: Citation[];
}

export function explainDeal(evaluation: DealEvaluation): ExplanationBlock[] {
  const blocks: ExplanationBlock[] = [];
  const { opportunity, gate, freshness, economicBuyer, meddicc, multiThread } =
    evaluation;

  if (gate.passed && gate.claimedCategory === "Commit") {
    blocks.push({
      id: "verdict",
      title: "Gate result",
      body: `${opportunity.accountName} stays in Commit. Conversation evidence is fresh, the named economic buyer appears on a call, and the MEDDICC score clears the floor.`,
      citations: [],
    });
  } else if (gate.passed) {
    blocks.push({
      id: "verdict",
      title: "Gate result",
      body: `${opportunity.accountName} stays in ${gate.claimedCategory}. The evidence gate does not promote deals; it only demotes unsupported Commit and Best Case calls.`,
      citations: [],
    });
  } else {
    blocks.push({
      id: "verdict",
      title: "Gate result",
      body: `${opportunity.accountName} was called ${gate.claimedCategory} and is evidence-adjusted to ${gate.allowedCategory}. ${gate.violations.length} rule${gate.violations.length === 1 ? "" : "s"} failed.`,
      citations: gate.violations.map((violation) => ({
        kind: violation.evidence.callId
          ? ("call" as const)
          : violation.evidence.field
            ? ("field" as const)
            : ("absence" as const),
        callId: violation.evidence.callId,
        fieldKey: violation.evidence.field,
        label: violation.reason,
      })),
    });
  }

  for (const violation of gate.violations) {
    blocks.push({
      id: violation.code,
      title: violation.code.replaceAll("_", " "),
      body: `${violation.reason} ${violation.evidence.detail}`,
      citations: [
        {
          kind: violation.evidence.callId ? "call" : "absence",
          callId: violation.evidence.callId,
          fieldKey: violation.evidence.field,
          label: violation.evidence.detail,
        },
      ],
    });
  }

  const lastCallCitation: Citation[] = freshness.lastMeaningfulCallId
    ? [
        {
          kind: "call",
          callId: freshness.lastMeaningfulCallId,
          label: `${freshness.lastMeaningfulCallTitle} (${formatIsoDate(freshness.lastMeaningfulCallDate ?? "")})`,
        },
      ]
    : [
        {
          kind: "absence",
          label: "No meaningful external call on record",
        },
      ];

  blocks.push({
    id: "freshness",
    title: "Evidence freshness",
    body: freshness.daysSinceLastMeaningfulCall === null
      ? `There is no meaningful external call. Calls shorter than ${MEANINGFUL_CALL_MIN_SECONDS} seconds are ignored.`
      : `Last meaningful external call was ${formatDays(freshness.daysSinceLastMeaningfulCall)} ago. Commit requires a meaningful external call within ${COMMIT_MAX_STALE_DAYS} days. ${freshness.ignoredShortCallCount} short call(s) were ignored.`,
    citations: lastCallCitation,
  });

  blocks.push({
    id: "economic-buyer",
    title: "Economic buyer on a call",
    body: economicBuyer.engaged
      ? `${economicBuyer.namedInCrm} is named in CRM and appears on a call as ${economicBuyer.matchedParticipantName}.`
      : economicBuyer.namedInCrm
        ? `${economicBuyer.namedInCrm} is named in the CRM economic-buyer field and does not appear as a participant on any call.`
        : "No economic buyer is named in the CRM, and none has appeared on a call.",
    citations: economicBuyer.matchedCallId
      ? [
          {
            kind: "call",
            callId: economicBuyer.matchedCallId,
            fieldKey: "economicBuyer",
            label: `${economicBuyer.matchedParticipantName} on ${economicBuyer.matchedCallId}`,
          },
        ]
      : [
          {
            kind: "field",
            fieldKey: "economicBuyer",
            label: economicBuyer.namedInCrm
              ? `CRM names ${economicBuyer.namedInCrm}`
              : "CRM economic-buyer field is empty",
          },
        ],
  });

  const callFields = meddicc.fields.filter((item) => item.source === "call").length;
  const crmFields = meddicc.fields.filter((item) => item.source === "crm").length;
  const absentFields = meddicc.fields.filter((item) => item.source === "absent").length;

  blocks.push({
    id: "meddicc",
    title: "MEDDICC completeness",
    body: `Score ${meddicc.score} / 100 from ${meddicc.earned} of ${meddicc.possible} points. ${callFields} field(s) corroborated on a call (1.0 each), ${crmFields} CRM-only (0.5 each), ${absentFields} absent (0).`,
    citations: meddicc.fields.map((item) => ({
      kind: item.source === "absent" ? "absence" : "field",
      fieldKey: item.key,
      label: `${item.label}: ${item.source}${item.value ? ` — ${item.value}` : ""}`,
    })),
  });

  const names = multiThread.participants.map((item) => item.name).join(", ");
  blocks.push({
    id: "thread",
    title: "Multi-threading",
    body:
      multiThread.distinctExternalCount === 0
        ? "No external participants are on the conversation record."
        : `${multiThread.distinctExternalCount} distinct external participant(s) (seniority-weighted score ${multiThread.score}): ${names}.`,
    citations: multiThread.participants.map((item) => ({
      kind: "call" as const,
      callId: item.callIds[0],
      label: `${item.name} (${item.seniority}) on ${item.callIds.join(", ")}`,
    })),
  });

  return blocks;
}
