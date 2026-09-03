/**
 * ILLUSTRATIVE SYNTHETIC DATA
 *
 * Every call record, transcript summary, participant, and risk phrase in
 * this file is fabricated for a work-sample demo. These are Gong-like
 * conversation records, not exports from Gong or any customer. None of
 * this is real Level AI, Cortex, Gong, or Salesforce data.
 */

import type { CallParticipant, CallRecord } from "./types";

function p(
  name: string,
  role: CallParticipant["role"],
  seniority: CallParticipant["seniority"],
): CallParticipant {
  return { name, role, seniority };
}

const priya = p("Priya Raman", "internal", "ic");
const marcus = p("Marcus Chen", "internal", "ic");
const elena = p("Elena Vasquez", "internal", "ic");
const theo = p("Theo Brooks", "internal", "ic");
const amira = p("Amira Soltani", "internal", "ic");
const devon = p("Devon Hale", "internal", "ic");
const samira = p("Samira Qureshi", "internal", "ic");
const kit = p("Kit Alvarez", "internal", "manager");

export const calls: CallRecord[] = [
  // --- opp-stale-commit: last meaningful external call 2026-07-18 (47 days) ---
  {
    id: "call-northwind-1",
    opportunityId: "opp-stale-commit",
    date: "2026-06-12",
    durationSeconds: 3120,
    participants: [
      priya,
      devon,
      p("Helena Voss", "external", "c-level"),
      p("Luis Ortega", "external", "vp"),
    ],
    title: "Northwind CFO discovery — QA cost and commit path",
    summary:
      "Helena Voss confirmed she owns the budget. Luis walked through the 4% sampling problem. They want a number in the forecast for a 30 Sep go-live.",
    riskPhrases: [],
  },
  {
    id: "call-northwind-2",
    opportunityId: "opp-stale-commit",
    date: "2026-07-01",
    durationSeconds: 2640,
    participants: [
      priya,
      p("Luis Ortega", "external", "vp"),
      p("Dana Little", "external", "director"),
    ],
    title: "Solution review with ops and QA",
    summary:
      "Luis restated the 28% QA-cost metric. Dana asked about TapeDeck contract overlap and a late look at HaloQA.",
    riskPhrases: ["late look at HaloQA"],
  },
  {
    id: "call-northwind-3",
    opportunityId: "opp-stale-commit",
    date: "2026-07-18",
    durationSeconds: 1980,
    participants: [
      priya,
      p("Helena Voss", "external", "c-level"),
      p("Luis Ortega", "external", "vp"),
    ],
    title: "Verbal commit with CFO — then silence",
    summary:
      "Helena said she was prepared to sign pending security. No follow-up conversation has been recorded since this call.",
    riskPhrases: [],
  },

  // --- opp-no-eb-commit: Naomi Trent (CFO) never appears ---
  {
    id: "call-helios-1",
    opportunityId: "opp-no-eb-commit",
    date: "2026-08-14",
    durationSeconds: 2460,
    participants: [
      marcus,
      devon,
      p("Chris Delgado", "external", "vp"),
      p("Mina Cho", "external", "director"),
    ],
    title: "Helios ops discovery — dispute cycle time",
    summary:
      "Chris described dispatchers unable to find the call that caused a claim. He named Naomi Trent as the CFO sponsor but said she has not joined yet.",
    riskPhrases: [],
  },
  {
    id: "call-helios-2",
    opportunityId: "opp-no-eb-commit",
    date: "2026-08-21",
    durationSeconds: 2100,
    participants: [
      marcus,
      p("Chris Delgado", "external", "vp"),
      p("Mina Cho", "external", "director"),
    ],
    title: "Working session on TMS integration",
    summary:
      "Chris and Mina reviewed TMS fields. Pinnacle Listen was mentioned as the other vendor in the bake-off. No finance attendee.",
    riskPhrases: [],
  },
  {
    id: "call-helios-3",
    opportunityId: "opp-no-eb-commit",
    date: "2026-08-28",
    durationSeconds: 1680,
    participants: [marcus, p("Chris Delgado", "external", "vp")],
    title: "Negotiation recap — still no CFO",
    summary:
      "Chris said pricing is in a good place and that he would 'get Naomi on the next one.' The next one has not happened.",
    riskPhrases: [],
  },

  // --- opp-hidden-competitor: Voxora named on calls, CRM competition blank ---
  {
    id: "call-meridian-1",
    opportunityId: "opp-hidden-competitor",
    date: "2026-08-11",
    durationSeconds: 2880,
    participants: [
      amira,
      samira,
      p("Dr. Anil Kapoor", "external", "c-level"),
      p("Maya Chen", "external", "director"),
    ],
    title: "Meridian COO discovery — nurse-line QA",
    summary:
      "Dr. Kapoor owns the budget. Maya described 6% sampling on the nurse line. They asked for a HIPAA architecture overview.",
    riskPhrases: [],
  },
  {
    id: "call-meridian-2",
    opportunityId: "opp-hidden-competitor",
    date: "2026-08-20",
    durationSeconds: 2340,
    participants: [
      amira,
      p("Maya Chen", "external", "director"),
      p("Owen Briggs", "external", "manager"),
    ],
    title: "Clinical ops working session",
    summary:
      "Maya said they are also evaluating Voxora Replay and asked for a side-by-side on after-call scoring versus live assist.",
    riskPhrases: ["evaluating Voxora Replay"],
  },
  {
    id: "call-meridian-3",
    opportunityId: "opp-hidden-competitor",
    date: "2026-08-27",
    durationSeconds: 1920,
    participants: [
      amira,
      p("Dr. Anil Kapoor", "external", "c-level"),
      p("Maya Chen", "external", "director"),
    ],
    title: "Proposal readout with COO",
    summary:
      "Kapoor liked the coverage number. Maya repeated that Voxora Replay is in the committee packet and legal has a 4-week BAA SLA.",
    riskPhrases: ["Voxora Replay is in the committee packet"],
  },

  // --- opp-single-thread: only Jordan Hale on the customer side ---
  {
    id: "call-atlas-1",
    opportunityId: "opp-single-thread",
    date: "2026-08-10",
    durationSeconds: 2220,
    participants: [elena, devon, p("Jordan Hale", "external", "vp")],
    title: "Atlas discovery with VP Customer Ops",
    summary:
      "Jordan walked through $1.1M of overtime and store-support calls that never get reviewed. He said finance rubber-stamps under $300k.",
    riskPhrases: [],
  },
  {
    id: "call-atlas-2",
    opportunityId: "opp-single-thread",
    date: "2026-08-19",
    durationSeconds: 1740,
    participants: [elena, p("Jordan Hale", "external", "vp")],
    title: "Demo recap — still only Jordan",
    summary:
      "Jordan confirmed Salesforce write-back is the decision criterion. No one from finance, IT, or the contact-center floor joined.",
    riskPhrases: [],
  },
  {
    id: "call-atlas-3",
    opportunityId: "opp-single-thread",
    date: "2026-08-26",
    durationSeconds: 960,
    participants: [elena, p("Jordan Hale", "external", "vp")],
    title: "Pricing check-in",
    summary:
      "Jordan said he would send the MSA to legal himself. Still the only external voice on the record.",
    riskPhrases: [],
  },
  {
    id: "call-atlas-4",
    opportunityId: "opp-single-thread",
    date: "2026-09-01",
    durationSeconds: 720,
    participants: [elena, kit, p("Jordan Hale", "external", "vp")],
    title: "Manager join — customer still single-threaded",
    summary:
      "Kit joined from our side. Jordan restated verbal commit. No second buyer has appeared on any call.",
    riskPhrases: [],
  },

  // --- opp-low-meddicc-commit: EB on a call, almost nothing else filled ---
  {
    id: "call-quorum-1",
    opportunityId: "opp-low-meddicc-commit",
    date: "2026-08-25",
    durationSeconds: 1500,
    participants: [theo, p("Ruth Okoye", "external", "c-level")],
    title: "Quorum intro with managing partner",
    summary:
      "Ruth said intake calls are not reviewed and that she can decide. No metrics, criteria, process, or competition were discussed.",
    riskPhrases: [],
  },
  {
    id: "call-quorum-2",
    opportunityId: "opp-low-meddicc-commit",
    date: "2026-09-01",
    durationSeconds: 540,
    participants: [theo, p("Ruth Okoye", "external", "c-level")],
    title: "Short follow-up — still thin",
    summary:
      "Ruth asked for a one-pager. Conversation stayed high-level. No paper process, no other attendees.",
    riskPhrases: [],
  },

  // --- opp-cobalt: clean, multi-threaded Commit ---
  {
    id: "call-cobalt-1",
    opportunityId: "opp-cobalt",
    date: "2026-08-06",
    durationSeconds: 3180,
    participants: [
      priya,
      devon,
      p("Owen Blake", "external", "c-level"),
      p("Imani Brooks", "external", "vp"),
    ],
    title: "Cobalt CRO discovery — forecast hygiene",
    summary:
      "Owen said the commit number moves 20% week to week. Imani mapped MEDDICC fields that never get corroborated.",
    riskPhrases: [],
  },
  {
    id: "call-cobalt-2",
    opportunityId: "opp-cobalt",
    date: "2026-08-18",
    durationSeconds: 2760,
    participants: [
      priya,
      p("Imani Brooks", "external", "vp"),
      p("Chris Lang", "external", "director"),
      p("Owen Blake", "external", "c-level"),
    ],
    title: "Scorecard working session",
    summary:
      "Chris walked manager scorecards. Owen confirmed he and the CFO will update the board on 18 Sep. Legal redlines were already in motion.",
    riskPhrases: [],
  },
  {
    id: "call-cobalt-3",
    opportunityId: "opp-cobalt",
    date: "2026-08-28",
    durationSeconds: 1440,
    participants: [
      priya,
      kit,
      p("Owen Blake", "external", "c-level"),
      p("Imani Brooks", "external", "vp"),
    ],
    title: "Verbal commit and paper close",
    summary:
      "Owen gave verbal commit. Imani confirmed legal redlines closed 28 Aug. Go-live targeted the following week.",
    riskPhrases: [],
  },

  // --- opp-pinecrest ---
  {
    id: "call-pinecrest-1",
    opportunityId: "opp-pinecrest",
    date: "2026-08-13",
    durationSeconds: 2520,
    participants: [
      elena,
      samira,
      p("Clare Nguyen", "external", "c-level"),
      p("Hector Ruiz", "external", "vp"),
    ],
    title: "Pinecrest exam-readiness discovery",
    summary:
      "Clare described the last exam flagging 9% sampling. Hector wants 100% collections-call coverage. HaloQA is the other name in the packet.",
    riskPhrases: [],
  },
  {
    id: "call-pinecrest-2",
    opportunityId: "opp-pinecrest",
    date: "2026-08-27",
    durationSeconds: 1980,
    participants: [
      elena,
      p("Clare Nguyen", "external", "c-level"),
      p("Hector Ruiz", "external", "vp"),
      p("Nina Brooks", "external", "director"),
    ],
    title: "Credit committee prep",
    summary:
      "Clare put the item on the 21 Sep credit committee. Nina confirmed the vendor-risk packet was submitted. On-prem option still a criterion.",
    riskPhrases: [],
  },

  // --- opp-harborline ---
  {
    id: "call-harborline-1",
    opportunityId: "opp-harborline",
    date: "2026-08-05",
    durationSeconds: 3060,
    participants: [
      amira,
      devon,
      p("Patricia Cho", "external", "c-level"),
      p("Benito Cruz", "external", "vp"),
    ],
    title: "Harborline CFO — claims leakage",
    summary:
      "Patricia quantified $2.4M leakage from FNOL calls that are never reviewed. Benito is the champion. TapeDeck contract ends 30 Sep.",
    riskPhrases: [],
  },
  {
    id: "call-harborline-2",
    opportunityId: "opp-harborline",
    date: "2026-08-19",
    durationSeconds: 2400,
    participants: [
      amira,
      p("Benito Cruz", "external", "vp"),
      p("Rina Patel", "external", "director"),
      p("Patricia Cho", "external", "c-level"),
    ],
    title: "Security and DPA close",
    summary:
      "Rina walked SOC2 and the DPA. Patricia said CIO security is the last gate and the order form is already in DocuSign.",
    riskPhrases: [],
  },
  {
    id: "call-harborline-3",
    opportunityId: "opp-harborline",
    date: "2026-09-01",
    durationSeconds: 780,
    participants: [amira, p("Patricia Cho", "external", "c-level")],
    title: "CFO signature check",
    summary:
      "Patricia confirmed she will sign this week once CIO replies. No new risks named.",
    riskPhrases: [],
  },

  // --- opp-champion-leaving ---
  {
    id: "call-redwood-1",
    opportunityId: "opp-champion-leaving",
    date: "2026-08-12",
    durationSeconds: 2640,
    participants: [
      marcus,
      p("Sanjay Mehta", "external", "c-level"),
      p("Lena Park", "external", "director"),
    ],
    title: "Redwood COO discovery",
    summary:
      "Sanjay owns the budget. Lena described member-service AHT and the lack of a view into why members churn after a call.",
    riskPhrases: [],
  },
  {
    id: "call-redwood-2",
    opportunityId: "opp-champion-leaving",
    date: "2026-08-22",
    durationSeconds: 2100,
    participants: [
      marcus,
      devon,
      p("Lena Park", "external", "director"),
      p("Chris Pell", "external", "manager"),
    ],
    title: "Member-experience working session",
    summary:
      "Lena and Chris mapped the core-system API. Pinnacle Listen is the other vendor. Legal has three open comments.",
    riskPhrases: [],
  },
  {
    id: "call-redwood-3",
    opportunityId: "opp-champion-leaving",
    date: "2026-09-02",
    durationSeconds: 1320,
    participants: [marcus, p("Lena Park", "external", "director")],
    title: "Champion transition risk",
    summary:
      "Lena said our champion is leaving at the end of the month and that Sanjay has not named a replacement owner for the evaluation.",
    riskPhrases: ["our champion is leaving"],
  },

  // --- opp-ironclad: five calls, well threaded ---
  {
    id: "call-ironclad-1",
    opportunityId: "opp-ironclad",
    date: "2026-07-28",
    durationSeconds: 3300,
    participants: [
      priya,
      devon,
      p("Greta Holm", "external", "c-level"),
      p("Noah Feldman", "external", "vp"),
    ],
    title: "Ironclad CFO/SVP discovery",
    summary:
      "Greta wants a 4-point win-rate lift on a $40M outbound motion. Noah described reps marking Commit with no buyer on a call.",
    riskPhrases: [],
  },
  {
    id: "call-ironclad-2",
    opportunityId: "opp-ironclad",
    date: "2026-08-08",
    durationSeconds: 2700,
    participants: [
      priya,
      p("Noah Feldman", "external", "vp"),
      p("Ivy Chen", "external", "director"),
      p("Marcus Cole", "external", "manager"),
    ],
    title: "RevOps design session",
    summary:
      "Ivy and Marcus walked MEDDICC capture and CRM hygiene. Internal data team is the build-vs-buy alternative.",
    riskPhrases: [],
  },
  {
    id: "call-ironclad-3",
    opportunityId: "opp-ironclad",
    date: "2026-08-19",
    durationSeconds: 1860,
    participants: [
      priya,
      kit,
      p("Greta Holm", "external", "c-level"),
      p("Noah Feldman", "external", "vp"),
    ],
    title: "Board socialization recap",
    summary:
      "Greta said the board already saw the number. MSA targeted for 1 Sep.",
    riskPhrases: [],
  },
  {
    id: "call-ironclad-4",
    opportunityId: "opp-ironclad",
    date: "2026-09-01",
    durationSeconds: 900,
    participants: [priya, p("Greta Holm", "external", "c-level")],
    title: "MSA executed",
    summary:
      "Greta confirmed the MSA executed 1 Sep. SOW is the last page. No new objections.",
    riskPhrases: [],
  },
  {
    id: "call-ironclad-5",
    opportunityId: "opp-ironclad",
    date: "2026-09-02",
    durationSeconds: 480,
    participants: [priya, p("Noah Feldman", "external", "vp")],
    title: "SOW check-in",
    summary:
      "Noah said legal is on the last SOW page and implementation kickoff is calendared.",
    riskPhrases: [],
  },

  // --- opp-asterisk ---
  {
    id: "call-asterisk-1",
    opportunityId: "opp-asterisk",
    date: "2026-08-07",
    durationSeconds: 2940,
    participants: [
      amira,
      samira,
      p("Marisol Vega", "external", "c-level"),
      p("Dr. Paul Ingram", "external", "c-level"),
    ],
    title: "Asterisk CFO/CMO discovery",
    summary:
      "Marisol owns budget. Paul wants front-desk no-shows from 18% to 11%. Voxora Replay is the competing packet.",
    riskPhrases: [],
  },
  {
    id: "call-asterisk-2",
    opportunityId: "opp-asterisk",
    date: "2026-08-21",
    durationSeconds: 2160,
    participants: [
      amira,
      p("Dr. Paul Ingram", "external", "c-level"),
      p("Elena Ruiz", "external", "director"),
      p("Marisol Vega", "external", "c-level"),
    ],
    title: "Physician council prep",
    summary:
      "Elena mapped the EHR connector. Council sits 23 Sep. BAA is in review. HIPAA architecture accepted.",
    riskPhrases: [],
  },
  {
    id: "call-asterisk-3",
    opportunityId: "opp-asterisk",
    date: "2026-09-01",
    durationSeconds: 1020,
    participants: [amira, p("Marisol Vega", "external", "c-level")],
    title: "CFO close plan",
    summary:
      "Marisol said she will sign after the council. No new commercial issues.",
    riskPhrases: [],
  },

  // --- opp-brightwell ---
  {
    id: "call-brightwell-1",
    opportunityId: "opp-brightwell",
    date: "2026-08-17",
    durationSeconds: 1800,
    participants: [
      theo,
      p("Ravi Sethi", "external", "director"),
      p("Kim Ball", "external", "manager"),
    ],
    title: "Brightwell contact-center discovery",
    summary:
      "Ravi said franchise calls are scored once a quarter. Tina Moreau (VP) was named but did not join. HaloQA is in the mix.",
    riskPhrases: [],
  },
  {
    id: "call-brightwell-2",
    opportunityId: "opp-brightwell",
    date: "2026-08-31",
    durationSeconds: 1320,
    participants: [theo, p("Ravi Sethi", "external", "director")],
    title: "Proposal follow-up",
    summary:
      "Ravi asked for a night-audit QA example. Still no VP on the call. Paper process not started.",
    riskPhrases: [],
  },

  // --- opp-budget-frozen ---
  {
    id: "call-cascade-1",
    opportunityId: "opp-budget-frozen",
    date: "2026-08-18",
    durationSeconds: 2040,
    participants: [
      elena,
      p("Nia Cole", "external", "director"),
      p("Jon Park", "external", "manager"),
    ],
    title: "Cascade EHS discovery",
    summary:
      "Nia described incident calls summarized from memory. Safety-hotline coverage is the metric. Walt Brennan (CFO) was named, not present.",
    riskPhrases: [],
  },
  {
    id: "call-cascade-2",
    opportunityId: "opp-budget-frozen",
    date: "2026-08-29",
    durationSeconds: 960,
    participants: [elena, p("Nia Cole", "external", "director")],
    title: "Budget hold",
    summary:
      "Nia said the budget got frozen in the August forecast lock and that Walt will not unlock spend until Q4.",
    riskPhrases: ["budget got frozen"],
  },

  // --- opp-security-review ---
  {
    id: "call-silverline-1",
    opportunityId: "opp-security-review",
    date: "2026-08-15",
    durationSeconds: 2580,
    participants: [
      marcus,
      devon,
      p("Asha Patel", "external", "vp"),
      p("Ken Ito", "external", "director"),
    ],
    title: "Silverline risk-desk discovery",
    summary:
      "Asha wants chargeback-call QA on every dispute. Ken flagged PCI and redact-on-ingest. Yusef Haddad (CISO) was named, not present.",
    riskPhrases: [],
  },
  {
    id: "call-silverline-2",
    opportunityId: "opp-security-review",
    date: "2026-08-26",
    durationSeconds: 1740,
    participants: [marcus, p("Asha Patel", "external", "vp")],
    title: "Security is the gate",
    summary:
      "Asha said we need to loop in security before commercial talks continue. The questionnaire has not been sent. Pinnacle Listen is also in security review.",
    riskPhrases: ["need to loop in security"],
  },

  // --- opp-larkspur ---
  {
    id: "call-larkspur-1",
    opportunityId: "opp-larkspur",
    date: "2026-08-20",
    durationSeconds: 1560,
    participants: [theo, p("Omar Diaz", "external", "manager")],
    title: "Larkspur MI-line intro",
    summary:
      "Omar said medical-info calls are sampled at 3%. Dr. Helen Cho was named as economic buyer and did not join.",
    riskPhrases: [],
  },
  {
    id: "call-larkspur-2",
    opportunityId: "opp-larkspur",
    date: "2026-09-01",
    durationSeconds: 840,
    participants: [theo, p("Omar Diaz", "external", "manager")],
    title: "Part 11 questions",
    summary:
      "Omar asked about 21 CFR Part 11 audit trail. Still no medical-affairs buyer on the record.",
    riskPhrases: [],
  },

  // --- opp-fairhaven ---
  {
    id: "call-fairhaven-1",
    opportunityId: "opp-fairhaven",
    date: "2026-08-14",
    durationSeconds: 2400,
    participants: [
      elena,
      p("Colin Ward", "external", "c-level"),
      p("June Alvarez", "external", "vp"),
    ],
    title: "Fairhaven CFO discovery",
    summary:
      "Colin quantified branch-to-call-center handoff errors. June is the champion. TapeDeck is the incumbent. BSA officer not yet in the room.",
    riskPhrases: [],
  },
  {
    id: "call-fairhaven-2",
    opportunityId: "opp-fairhaven",
    date: "2026-08-28",
    durationSeconds: 1680,
    participants: [
      elena,
      p("June Alvarez", "external", "vp"),
      p("Colin Ward", "external", "c-level"),
    ],
    title: "Vendor-management queue",
    summary:
      "Colin confirmed a six-week vendor-management queue. June asked for a BSA/AML flag demo. No new competitor named.",
    riskPhrases: [],
  },

  // --- opp-copperfield ---
  {
    id: "call-copperfield-1",
    opportunityId: "opp-copperfield",
    date: "2026-08-21",
    durationSeconds: 1380,
    participants: [theo, p("Dara Singh", "external", "vp")],
    title: "Copperfield intro",
    summary:
      "Dara described broker calls vanishing into voicemail. Price needs to stay under $200k. No metrics offered.",
    riskPhrases: [],
  },
  {
    id: "call-copperfield-2",
    opportunityId: "opp-copperfield",
    date: "2026-08-24",
    durationSeconds: 90,
    participants: [theo, p("Dara Singh", "external", "vp")],
    title: "Voicemail follow-up (too short to count)",
    summary:
      "Dara asked to reschedule. Call ended before any substance.",
    riskPhrases: [],
  },

  // --- opp-marlowe ---
  {
    id: "call-marlowe-1",
    opportunityId: "opp-marlowe",
    date: "2026-08-16",
    durationSeconds: 2460,
    participants: [
      elena,
      p("Edwin Marlowe", "external", "c-level"),
      p("Priya Shah", "external", "c-level"),
    ],
    title: "Marlowe Finch exam-readiness",
    summary:
      "Edwin and Priya described an SEC exam that asked for calls the firm could not produce. HaloQA is the other packet. Partners vote; Edwin breaks ties.",
    riskPhrases: [],
  },
  {
    id: "call-marlowe-2",
    opportunityId: "opp-marlowe",
    date: "2026-08-30",
    durationSeconds: 1620,
    participants: [
      elena,
      p("Priya Shah", "external", "c-level"),
      p("Edwin Marlowe", "external", "c-level"),
    ],
    title: "MSA with outside counsel",
    summary:
      "Priya said outside counsel has the MSA. Edwin wants WORM storage in the SOW. No new risks.",
    riskPhrases: [],
  },

  // --- opp-oakridge ---
  {
    id: "call-oakridge-1",
    opportunityId: "opp-oakridge",
    date: "2026-08-19",
    durationSeconds: 1200,
    participants: [theo, p("Kyle Ames", "external", "manager")],
    title: "Oakridge first conversation",
    summary:
      "Kyle said the plant-support line has no QA. He does not know who would own budget.",
    riskPhrases: [],
  },
  {
    id: "call-oakridge-2",
    opportunityId: "opp-oakridge",
    date: "2026-08-22",
    durationSeconds: 70,
    participants: [theo, p("Kyle Ames", "external", "manager")],
    title: "Scheduling ping (not meaningful)",
    summary: "Kyle confirmed a later working session and dropped.",
    riskPhrases: [],
  },

  // --- opp-vesper ---
  {
    id: "call-vesper-1",
    opportunityId: "opp-vesper",
    date: "2026-08-25",
    durationSeconds: 1080,
    participants: [theo, p("Lila Grant", "external", "ic")],
    title: "Vesper ad-ops intro",
    summary:
      "Lila said ad-ops escalations are tribal knowledge. No champion or buyer identified.",
    riskPhrases: [],
  },

  // --- opp-windmere ---
  {
    id: "call-windmere-1",
    opportunityId: "opp-windmere",
    date: "2026-08-12",
    durationSeconds: 1920,
    participants: [
      marcus,
      p("Tom Breen", "external", "director"),
      p("Ava Singh", "external", "manager"),
    ],
    title: "Windmere PUC-reporting discovery",
    summary:
      "Tom described a PUC request for outage calls they could not retrieve. Lydia Grant (CFO) named, not present. Pinnacle Listen is in the RFP.",
    riskPhrases: [],
  },
  {
    id: "call-windmere-2",
    opportunityId: "opp-windmere",
    date: "2026-08-26",
    durationSeconds: 1440,
    participants: [marcus, p("Tom Breen", "external", "director")],
    title: "Storm-surge volume",
    summary:
      "Tom walked peak volume. Still no CFO. On-prem remains a stated criterion.",
    riskPhrases: [],
  },

  // --- opp-stonebridge ---
  {
    id: "call-stonebridge-1",
    opportunityId: "opp-stonebridge",
    date: "2026-08-18",
    durationSeconds: 1260,
    participants: [elena, p("Dean Walsh", "external", "vp")],
    title: "Stonebridge enrollment intro",
    summary:
      "Dean said counselor calls are not reviewed. FERPA and SIS write-back are criteria. No second attendee.",
    riskPhrases: [],
  },
  {
    id: "call-stonebridge-2",
    opportunityId: "opp-stonebridge",
    date: "2026-08-20",
    durationSeconds: 55,
    participants: [elena, p("Dean Walsh", "external", "vp")],
    title: "Calendar ping (not meaningful)",
    summary: "Dean rescheduled. No substance.",
    riskPhrases: [],
  },

  // --- opp-nimbus ---
  {
    id: "call-nimbus-1",
    opportunityId: "opp-nimbus",
    date: "2026-08-13",
    durationSeconds: 2100,
    participants: [
      priya,
      p("Riley Cho", "external", "director"),
      p("Sam Patel", "external", "manager"),
    ],
    title: "Nimbus onboarding-call discovery",
    summary:
      "Riley said onboarding calls never reach the CSM. Chris Lang (VP CS) was named as buyer and did not join. Salesforce write-back is a criterion.",
    riskPhrases: [],
  },
  {
    id: "call-nimbus-2",
    opportunityId: "opp-nimbus",
    date: "2026-08-27",
    durationSeconds: 1500,
    participants: [priya, p("Riley Cho", "external", "director")],
    title: "Write-back demo recap",
    summary:
      "Riley liked the Salesforce write-back. Still no VP CS on a call. Process and paper are blank.",
    riskPhrases: [],
  },

  // --- opp-glacier ---
  {
    id: "call-glacier-1",
    opportunityId: "opp-glacier",
    date: "2026-08-28",
    durationSeconds: 720,
    participants: [theo, p("Sam Ortiz", "external", "manager")],
    title: "Glacier Peak first call",
    summary:
      "Sam asked for a one-pager. No pain, buyer, or criteria discussed in any depth.",
    riskPhrases: [],
  },

  // --- opp-twinrivers ---
  {
    id: "call-twinrivers-1",
    opportunityId: "opp-twinrivers",
    date: "2026-08-19",
    durationSeconds: 1320,
    participants: [elena, p("Patrice Bell", "external", "vp")],
    title: "Twin Rivers store-ops intro",
    summary:
      "Patrice said store-support QA is a spreadsheet. Union-call handling is a criterion. No competitor named.",
    riskPhrases: [],
  },
  {
    id: "call-twinrivers-2",
    opportunityId: "opp-twinrivers",
    date: "2026-08-24",
    durationSeconds: 110,
    participants: [elena, p("Patrice Bell", "external", "vp")],
    title: "Hold-music follow-up (not meaningful)",
    summary: "Call dropped during hold. No substance recorded.",
    riskPhrases: [],
  },
];
