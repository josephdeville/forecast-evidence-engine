import type { CallRecord, CallParticipant, Opportunity, Seniority } from "@/data/types";
import { seniorityWeight } from "@/lib/constants";
import { callsForOpportunity } from "@/lib/evidenceFreshness";
import { namesMatch } from "@/lib/names";

export interface ExternalParticipantScore {
  name: string;
  seniority: Seniority;
  weight: number;
  callIds: string[];
}

export interface MultiThreadScoreResult {
  /** Sum of seniority weights across distinct external participants. */
  score: number;
  distinctExternalCount: number;
  participants: ExternalParticipantScore[];
}

function higherSeniority(a: Seniority, b: Seniority): Seniority {
  return seniorityWeight(a) >= seniorityWeight(b) ? a : b;
}

function findExisting(
  list: ExternalParticipantScore[],
  name: string,
): ExternalParticipantScore | undefined {
  return list.find((entry) => namesMatch(entry.name, name));
}

export function multiThreadScore(
  opp: Opportunity,
  calls: CallRecord[],
): MultiThreadScoreResult {
  const related = callsForOpportunity(opp, calls);
  const participants: ExternalParticipantScore[] = [];

  for (const call of related) {
    const externals = call.participants.filter(
      (participant): participant is CallParticipant =>
        participant.role === "external",
    );
    for (const participant of externals) {
      const existing = findExisting(participants, participant.name);
      if (existing) {
        existing.seniority = higherSeniority(existing.seniority, participant.seniority);
        existing.weight = seniorityWeight(existing.seniority);
        if (!existing.callIds.includes(call.id)) {
          existing.callIds.push(call.id);
        }
      } else {
        participants.push({
          name: participant.name,
          seniority: participant.seniority,
          weight: seniorityWeight(participant.seniority),
          callIds: [call.id],
        });
      }
    }
  }

  participants.sort((a, b) => b.weight - a.weight || a.name.localeCompare(b.name));

  return {
    score: participants.reduce((sum, entry) => sum + entry.weight, 0),
    distinctExternalCount: participants.length,
    participants,
  };
}
