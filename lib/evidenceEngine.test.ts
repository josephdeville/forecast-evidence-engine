import { describe, expect, it } from "vitest";
import { calls, opportunities } from "@/data";
import { AS_OF_DATE, SOURCE_WEIGHT } from "@/lib/constants";
import { dataQualityFindings } from "@/lib/dataQualityFindings";
import { economicBuyerEngaged } from "@/lib/economicBuyerEngaged";
import { evidenceFreshness } from "@/lib/evidenceFreshness";
import { evidenceGate } from "@/lib/evidenceGate";
import { forecast } from "@/lib/forecast";
import { meddiccScore } from "@/lib/meddiccScore";
import { multiThreadScore } from "@/lib/multiThreadScore";
import { absent, field, fullMeddicc, makeCall, makeOpp } from "@/lib/testFixtures";

const asOf = AS_OF_DATE;

function seed(id: string) {
  const opp = opportunities.find((item) => item.id === id);
  if (!opp) {
    throw new Error(`Missing seed opportunity ${id}`);
  }
  return {
    opp,
    calls: calls.filter((call) => call.opportunityId === id),
  };
}

describe("meddiccScore", () => {
  it("scores a fully call-corroborated deal at 100", () => {
    const result = meddiccScore(makeOpp({ meddicc: fullMeddicc("call") }), []);
    expect(result.score).toBe(100);
    expect(result.earned).toBe(8);
  });

  it("credits call evidence twice as much as CRM-only text", () => {
    const callOnly = meddiccScore(
      makeOpp({
        meddicc: {
          ...fullMeddicc("absent"),
          metrics: field("metric", "call"),
        },
      }),
      [],
    );
    const crmOnly = meddiccScore(
      makeOpp({
        meddicc: {
          ...fullMeddicc("absent"),
          metrics: field("metric", "crm"),
        },
      }),
      [],
    );
    expect(callOnly.earned).toBe(SOURCE_WEIGHT.call);
    expect(crmOnly.earned).toBe(SOURCE_WEIGHT.crm);
    expect(callOnly.earned).toBe(crmOnly.earned * 2);
    expect(callOnly.score).toBeGreaterThan(crmOnly.score);
  });

  it("gives absent fields zero", () => {
    const result = meddiccScore(
      makeOpp({
        meddicc: {
          metrics: absent(),
          economicBuyer: absent(),
          decisionCriteria: absent(),
          decisionProcess: absent(),
          paperProcess: absent(),
          identifiedPain: absent(),
          champion: absent(),
          competition: absent(),
        },
      }),
      [],
    );
    expect(result.score).toBe(0);
    expect(result.fields.every((item) => item.points === 0)).toBe(true);
  });
});

describe("evidenceFreshness", () => {
  it("ignores calls under 180 seconds", () => {
    const opp = makeOpp();
    const result = evidenceFreshness(
      opp,
      [
        makeCall({ id: "short", durationSeconds: 179, date: "2026-09-02" }),
        makeCall({ id: "long", durationSeconds: 180, date: "2026-08-20" }),
      ],
      asOf,
    );
    expect(result.lastMeaningfulCallId).toBe("long");
    expect(result.daysSinceLastMeaningfulCall).toBe(14);
    expect(result.ignoredShortCallCount).toBe(1);
  });

  it("ignores internal-only calls even when they are long", () => {
    const result = evidenceFreshness(
      makeOpp(),
      [
        makeCall({
          id: "internal",
          durationSeconds: 600,
          date: "2026-09-01",
          participants: [{ name: "Rep Test", role: "internal", seniority: "ic" }],
        }),
      ],
      asOf,
    );
    expect(result.daysSinceLastMeaningfulCall).toBeNull();
    expect(result.meaningfulCallCount).toBe(0);
  });

  it("returns null when there are no calls", () => {
    const result = evidenceFreshness(makeOpp(), [], asOf);
    expect(result.daysSinceLastMeaningfulCall).toBeNull();
    expect(result.lastMeaningfulCallId).toBeNull();
  });
});

describe("multiThreadScore", () => {
  it("counts distinct external participants and weights seniority", () => {
    const result = multiThreadScore(makeOpp(), [
      makeCall({
        id: "c1",
        participants: [
          { name: "Rep", role: "internal", seniority: "ic" },
          { name: "Alex Rivera", role: "external", seniority: "c-level" },
        ],
      }),
      makeCall({
        id: "c2",
        participants: [
          { name: "Alex Rivera", role: "external", seniority: "c-level" },
          { name: "Sam Lee", role: "external", seniority: "vp" },
        ],
      }),
    ]);
    expect(result.distinctExternalCount).toBe(2);
    expect(result.score).toBe(3 + 2.5);
  });

  it("does not double-count the same person across calls", () => {
    const result = multiThreadScore(makeOpp(), [
      makeCall({
        id: "c1",
        participants: [{ name: "Jordan Hale", role: "external", seniority: "vp" }],
      }),
      makeCall({
        id: "c2",
        participants: [{ name: "Jordan Hale", role: "external", seniority: "vp" }],
      }),
    ]);
    expect(result.distinctExternalCount).toBe(1);
    expect(result.participants[0]?.callIds).toEqual(["c1", "c2"]);
  });
});

describe("economicBuyerEngaged", () => {
  it("is true when the named buyer appears on a call", () => {
    const result = economicBuyerEngaged(makeOpp(), [makeCall()]);
    expect(result.engaged).toBe(true);
    expect(result.matchedParticipantName).toBe("Alex Rivera");
    expect(result.matchedCallId).toBe("call-test");
  });

  it("is false when the CRM names a buyer who never joins", () => {
    const opp = makeOpp({
      meddicc: {
        ...fullMeddicc("crm"),
        economicBuyer: field("Naomi Trent, CFO", "crm"),
      },
    });
    const result = economicBuyerEngaged(opp, [makeCall()]);
    expect(result.engaged).toBe(false);
    expect(result.namedInCrm).toBe("Naomi Trent");
    expect(result.matchedCallId).toBeNull();
  });
});

describe("evidenceGate", () => {
  it("allows Commit when evidence is fresh, the buyer was on a call, and MEDDICC clears the floor", () => {
    const gate = evidenceGate(makeOpp(), [makeCall()], asOf);
    expect(gate.allowedCategory).toBe("Commit");
    expect(gate.passed).toBe(true);
    expect(gate.violations).toHaveLength(0);
  });

  it("demotes Commit when the last meaningful call is older than 14 days", () => {
    const gate = evidenceGate(
      makeOpp(),
      [makeCall({ date: "2026-08-01", durationSeconds: 600 })],
      asOf,
    );
    expect(gate.allowedCategory).not.toBe("Commit");
    expect(gate.violations.some((item) => item.code === "stale_evidence")).toBe(
      true,
    );
    expect(gate.violations[0]?.evidence.detail).toMatch(/call-test/);
  });

  it("demotes Commit when no economic buyer has been on a call", () => {
    const opp = makeOpp({
      meddicc: {
        ...fullMeddicc("call"),
        economicBuyer: field("Naomi Trent, CFO", "crm"),
      },
    });
    const gate = evidenceGate(opp, [makeCall()], asOf);
    expect(gate.allowedCategory).not.toBe("Commit");
    expect(
      gate.violations.some((item) => item.code === "economic_buyer_absent"),
    ).toBe(true);
    expect(gate.violations.find((item) => item.code === "economic_buyer_absent")?.reason).toMatch(
      /Naomi Trent/,
    );
  });

  it("demotes Commit when MEDDICC is below the floor", () => {
    const opp = makeOpp({
      meddicc: {
        ...fullMeddicc("absent"),
        economicBuyer: field("Alex Rivera, CFO", "call"),
      },
    });
    const gate = evidenceGate(opp, [makeCall()], asOf);
    expect(gate.allowedCategory).not.toBe("Commit");
    expect(
      gate.violations.some((item) => item.code === "meddicc_below_floor"),
    ).toBe(true);
  });

  it("never promotes a Pipeline deal to Commit even with strong evidence", () => {
    const gate = evidenceGate(
      makeOpp({ repForecastCategory: "Pipeline" }),
      [makeCall()],
      asOf,
    );
    expect(gate.allowedCategory).toBe("Pipeline");
    expect(gate.highestSupported).toBe("Commit");
    expect(gate.passed).toBe(true);
  });

  it("demotes to Pipeline when there is no meaningful call at all", () => {
    const gate = evidenceGate(makeOpp(), [], asOf);
    expect(gate.allowedCategory).toBe("Pipeline");
    expect(
      gate.violations.some((item) => item.code === "no_meaningful_calls"),
    ).toBe(true);
  });
});

describe("forecast", () => {
  it("puts the Commit delta equal to the amount of demoted Commit deals", () => {
    const clean = makeOpp({ id: "clean", amount: 200_000 });
    const stale = makeOpp({ id: "stale", amount: 50_000 });
    const allCalls = [
      makeCall({ opportunityId: "clean" }),
      makeCall({
        id: "stale-call",
        opportunityId: "stale",
        date: "2026-07-01",
      }),
    ];
    const result = forecast([clean, stale], allCalls, asOf);
    expect(result.repCalled.commit).toBe(250_000);
    expect(result.evidenceAdjusted.commit).toBe(200_000);
    expect(result.commitDelta).toBe(-50_000);
    expect(result.commitDeltaPct).toBe(-20);
  });
});

describe("dataQualityFindings", () => {
  it("flags a competitor named on a call when CRM competition is empty", () => {
    const opp = makeOpp({
      meddicc: { ...fullMeddicc("call"), competition: absent() },
    });
    const findings = dataQualityFindings(
      [opp],
      [
        makeCall({
          summary: "They are also evaluating Voxora Replay.",
          riskPhrases: ["evaluating Voxora Replay"],
        }),
      ],
      asOf,
    );
    const hit = findings.find((item) => item.id === "competitor_on_call_blank_crm");
    expect(hit?.count).toBe(1);
    expect(hit?.example?.opportunityId).toBe("opp-test");
  });
});

describe("seeded conflict cases", () => {
  it("demotes the stale Northwind Logistics Commit (47 days since last meaningful call)", () => {
    const { opp, calls: related } = seed("opp-stale-commit");
    const freshness = evidenceFreshness(opp, related, asOf);
    const gate = evidenceGate(opp, related, asOf);
    expect(freshness.daysSinceLastMeaningfulCall).toBeGreaterThanOrEqual(40);
    expect(gate.allowedCategory).not.toBe("Commit");
    expect(gate.violations.some((item) => item.code === "stale_evidence")).toBe(
      true,
    );
  });

  it("demotes Helios Freight Commit because Naomi Trent never joins a call", () => {
    const { opp, calls: related } = seed("opp-no-eb-commit");
    const buyer = economicBuyerEngaged(opp, related);
    const gate = evidenceGate(opp, related, asOf);
    expect(buyer.namedInCrm).toBe("Naomi Trent");
    expect(buyer.engaged).toBe(false);
    expect(gate.allowedCategory).not.toBe("Commit");
    expect(
      gate.violations.some((item) => item.code === "economic_buyer_absent"),
    ).toBe(true);
  });

  it("finds Voxora on Meridian Health calls while CRM competition is empty", () => {
    const { opp, calls: related } = seed("opp-hidden-competitor");
    expect(opp.meddicc.competition.source).toBe("absent");
    const findings = dataQualityFindings([opp], related, asOf);
    const hit = findings.find((item) => item.id === "competitor_on_call_blank_crm");
    expect(hit?.count).toBe(1);
    expect(hit?.example?.detail).toMatch(/Voxora/i);
  });

  it("treats Atlas Retail as single-threaded (only Jordan Hale)", () => {
    const { opp, calls: related } = seed("opp-single-thread");
    const thread = multiThreadScore(opp, related);
    expect(thread.distinctExternalCount).toBe(1);
    expect(thread.participants[0]?.name).toBe("Jordan Hale");
  });

  it("demotes Quorum Legal Commit on a thin MEDDICC score", () => {
    const { opp, calls: related } = seed("opp-low-meddicc-commit");
    const score = meddiccScore(opp, related);
    const gate = evidenceGate(opp, related, asOf);
    expect(score.score).toBeLessThan(55);
    expect(gate.allowedCategory).not.toBe("Commit");
    expect(
      gate.violations.some((item) => item.code === "meddicc_below_floor"),
    ).toBe(true);
  });
});
