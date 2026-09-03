import type { CallRecord, Opportunity } from "@/data/types";
import { COMMIT_MAX_STALE_DAYS } from "@/lib/constants";
import { economicBuyerEngaged } from "@/lib/economicBuyerEngaged";
import { evidenceFreshness } from "@/lib/evidenceFreshness";
import { multiThreadScore } from "@/lib/multiThreadScore";

export type FindingSeverity = "high" | "medium";

export interface DataQualityExample {
  opportunityId: string;
  accountName: string;
  detail: string;
}

export interface DataQualityFinding {
  id: string;
  title: string;
  count: number;
  severity: FindingSeverity;
  example: DataQualityExample | null;
}

const COMPETITOR_PATTERN =
  /\b(voxora(?:\s+replay)?|pinnacle(?:\s+listen)?|haloqa|tapedeck)\b/i;

function competitionBlank(opp: Opportunity): boolean {
  return (
    opp.meddicc.competition.source === "absent" ||
    opp.meddicc.competition.value.trim().length === 0
  );
}

function competitorMentioned(text: string): string | null {
  const match = text.match(COMPETITOR_PATTERN);
  return match ? match[0] : null;
}

function pushExample(
  examples: DataQualityExample[],
  opp: Opportunity,
  detail: string,
): void {
  examples.push({
    opportunityId: opp.id,
    accountName: opp.accountName,
    detail,
  });
}

function finding(
  id: string,
  title: string,
  examples: DataQualityExample[],
  severity: FindingSeverity,
): DataQualityFinding | null {
  if (examples.length === 0) {
    return null;
  }
  return {
    id,
    title,
    count: examples.length,
    severity,
    example: examples[0] ?? null,
  };
}

export function dataQualityFindings(
  opps: Opportunity[],
  calls: CallRecord[],
  asOf: string,
): DataQualityFinding[] {
  const competitorBlank: DataQualityExample[] = [];
  const singleThreaded: DataQualityExample[] = [];
  const ebNeverOnCall: DataQualityExample[] = [];
  const staleCommit: DataQualityExample[] = [];
  const championLeaving: DataQualityExample[] = [];
  const budgetFrozen: DataQualityExample[] = [];
  const securityLoop: DataQualityExample[] = [];

  for (const opp of opps) {
    const related = calls.filter((call) => call.opportunityId === opp.id);
    const thread = multiThreadScore(opp, related);
    const buyer = economicBuyerEngaged(opp, related);
    const freshness = evidenceFreshness(opp, related, asOf);

    if (competitionBlank(opp)) {
      for (const call of related) {
        const haystack = `${call.summary} ${call.riskPhrases.join(" ")}`;
        const named = competitorMentioned(haystack);
        if (named) {
          pushExample(
            competitorBlank,
            opp,
            `${call.id} names "${named}" but the CRM competition field is empty.`,
          );
          break;
        }
      }
    }

    if (thread.distinctExternalCount === 1 && opp.repForecastCategory !== "Pipeline") {
      const only = thread.participants[0];
      pushExample(
        singleThreaded,
        opp,
        `Only ${only?.name ?? "one external"} appears across ${thread.participants[0]?.callIds.length ?? 0} call(s).`,
      );
    }

    if (buyer.namedInCrm && !buyer.engaged) {
      pushExample(
        ebNeverOnCall,
        opp,
        `${buyer.namedInCrm} is named in CRM and does not appear on any call.`,
      );
    }

    if (
      opp.repForecastCategory === "Commit" &&
      (freshness.daysSinceLastMeaningfulCall === null ||
        freshness.daysSinceLastMeaningfulCall > COMMIT_MAX_STALE_DAYS)
    ) {
      const days =
        freshness.daysSinceLastMeaningfulCall === null
          ? "no meaningful call"
          : `${freshness.daysSinceLastMeaningfulCall} days since ${freshness.lastMeaningfulCallId}`;
      pushExample(staleCommit, opp, days);
    }

    for (const call of related) {
      const phrases = call.riskPhrases.map((phrase) => phrase.toLowerCase());
      if (phrases.some((phrase) => phrase.includes("champion is leaving"))) {
        pushExample(
          championLeaving,
          opp,
          `${call.id}: "${call.riskPhrases.find((phrase) => phrase.toLowerCase().includes("champion is leaving"))}"`,
        );
        break;
      }
    }

    for (const call of related) {
      if (
        call.riskPhrases.some((phrase) =>
          phrase.toLowerCase().includes("budget got frozen"),
        )
      ) {
        pushExample(
          budgetFrozen,
          opp,
          `${call.id}: budget freeze named on the call.`,
        );
        break;
      }
    }

    for (const call of related) {
      if (
        call.riskPhrases.some((phrase) =>
          phrase.toLowerCase().includes("loop in security"),
        )
      ) {
        pushExample(
          securityLoop,
          opp,
          `${call.id}: security has not been looped in.`,
        );
        break;
      }
    }
  }

  return [
    finding(
      "competitor_on_call_blank_crm",
      "Competitor named on a call but the CRM competition field is empty",
      competitorBlank,
      "high",
    ),
    finding(
      "stale_commit",
      "Commit deals with stale or missing conversation evidence",
      staleCommit,
      "high",
    ),
    finding(
      "eb_named_never_on_call",
      "Economic buyer named in CRM, never on a call",
      ebNeverOnCall,
      "high",
    ),
    finding(
      "single_threaded",
      "Non-pipeline deals that are single-threaded (one external voice)",
      singleThreaded,
      "medium",
    ),
    finding(
      "champion_leaving",
      "Champion-leaving language on a recorded call",
      championLeaving,
      "high",
    ),
    finding(
      "budget_frozen",
      "Budget-freeze language on a recorded call",
      budgetFrozen,
      "high",
    ),
    finding(
      "security_loop",
      "Security still needs to be looped in",
      securityLoop,
      "medium",
    ),
  ].filter((item): item is DataQualityFinding => item !== null);
}
