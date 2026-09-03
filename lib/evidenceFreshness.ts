import type { CallRecord, Opportunity } from "@/data/types";
import { MEANINGFUL_CALL_MIN_SECONDS } from "@/lib/constants";
import { daysBetween } from "@/lib/dates";

export function isMeaningfulExternalCall(call: CallRecord): boolean {
  if (call.durationSeconds < MEANINGFUL_CALL_MIN_SECONDS) {
    return false;
  }
  return call.participants.some((participant) => participant.role === "external");
}

export function callsForOpportunity(
  opp: Opportunity,
  calls: CallRecord[],
): CallRecord[] {
  return calls.filter((call) => call.opportunityId === opp.id);
}

export function meaningfulCallsForOpportunity(
  opp: Opportunity,
  calls: CallRecord[],
): CallRecord[] {
  return callsForOpportunity(opp, calls)
    .filter(isMeaningfulExternalCall)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export interface EvidenceFreshnessResult {
  daysSinceLastMeaningfulCall: number | null;
  lastMeaningfulCallId: string | null;
  lastMeaningfulCallDate: string | null;
  lastMeaningfulCallTitle: string | null;
  meaningfulCallCount: number;
  ignoredShortCallCount: number;
}

export function evidenceFreshness(
  opp: Opportunity,
  calls: CallRecord[],
  asOf: string,
): EvidenceFreshnessResult {
  const related = callsForOpportunity(opp, calls);
  const meaningful = meaningfulCallsForOpportunity(opp, calls);
  const last = meaningful[meaningful.length - 1];

  if (!last) {
    return {
      daysSinceLastMeaningfulCall: null,
      lastMeaningfulCallId: null,
      lastMeaningfulCallDate: null,
      lastMeaningfulCallTitle: null,
      meaningfulCallCount: 0,
      ignoredShortCallCount: related.length,
    };
  }

  return {
    daysSinceLastMeaningfulCall: daysBetween(asOf, last.date),
    lastMeaningfulCallId: last.id,
    lastMeaningfulCallDate: last.date,
    lastMeaningfulCallTitle: last.title,
    meaningfulCallCount: meaningful.length,
    ignoredShortCallCount: related.length - meaningful.length,
  };
}
