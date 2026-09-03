export type ForecastCategory = "Commit" | "Best Case" | "Pipeline";

export type Segment = "Enterprise" | "Mid-Market";

export type Stage =
  | "Discovery"
  | "Qualification"
  | "Solution Review"
  | "Proposal"
  | "Negotiation"
  | "Verbal Commit";

export type MeddiccFieldKey =
  | "metrics"
  | "economicBuyer"
  | "decisionCriteria"
  | "decisionProcess"
  | "paperProcess"
  | "identifiedPain"
  | "champion"
  | "competition";

export type MeddiccSource = "crm" | "call" | "absent";

export interface MeddiccField {
  value: string;
  source: MeddiccSource;
}

export type MeddiccMap = Record<MeddiccFieldKey, MeddiccField>;

export interface Opportunity {
  id: string;
  accountName: string;
  amount: number;
  stage: Stage;
  closeDate: string;
  ownerName: string;
  segment: Segment;
  repForecastCategory: ForecastCategory;
  meddicc: MeddiccMap;
}

export type ParticipantRole = "internal" | "external";

export type Seniority = "ic" | "manager" | "director" | "vp" | "c-level";

export interface CallParticipant {
  name: string;
  role: ParticipantRole;
  seniority: Seniority;
}

export interface CallRecord {
  id: string;
  opportunityId: string;
  date: string;
  durationSeconds: number;
  participants: CallParticipant[];
  title: string;
  summary: string;
  riskPhrases: string[];
}

export interface TrailingWeek {
  weekEnding: string;
  label: string;
  repCalledCommit: number;
  evidenceAdjustedCommit: number;
  /** null for the in-progress week — actuals are not yet known */
  actualClosed: number | null;
}
