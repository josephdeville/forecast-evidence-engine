import type { CallRecord, Opportunity } from "@/data/types";
import { callsForOpportunity } from "@/lib/evidenceFreshness";
import { namesMatch, parseNamedPerson } from "@/lib/names";

export interface EconomicBuyerEngagedResult {
  engaged: boolean;
  namedInCrm: string | null;
  matchedParticipantName: string | null;
  matchedCallId: string | null;
  callsReviewed: string[];
}

export function economicBuyerEngaged(
  opp: Opportunity,
  calls: CallRecord[],
): EconomicBuyerEngagedResult {
  const namedInCrm = parseNamedPerson(opp.meddicc.economicBuyer.value);
  const related = callsForOpportunity(opp, calls);
  const callsReviewed = related.map((call) => call.id);

  if (!namedInCrm) {
    return {
      engaged: false,
      namedInCrm: null,
      matchedParticipantName: null,
      matchedCallId: null,
      callsReviewed,
    };
  }

  for (const call of related) {
    for (const participant of call.participants) {
      if (participant.role !== "external") {
        continue;
      }
      if (namesMatch(participant.name, namedInCrm)) {
        return {
          engaged: true,
          namedInCrm,
          matchedParticipantName: participant.name,
          matchedCallId: call.id,
          callsReviewed,
        };
      }
    }
  }

  return {
    engaged: false,
    namedInCrm,
    matchedParticipantName: null,
    matchedCallId: null,
    callsReviewed,
  };
}
