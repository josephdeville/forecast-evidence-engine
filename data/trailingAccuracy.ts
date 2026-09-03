/**
 * ILLUSTRATIVE SYNTHETIC DATA
 *
 * Fabricated trailing weekly snapshots so the CRO view can show the
 * ±5% accuracy idea. These are not real closed-won results from any
 * company. The pattern is intentional: the evidence-adjusted commit
 * stays near actuals; the rep-called commit does not.
 */

import type { TrailingWeek } from "./types";

export const trailingWeeks: TrailingWeek[] = [
  {
    weekEnding: "2026-08-13",
    label: "Week of Aug 10",
    repCalledCommit: 3_100_000,
    evidenceAdjustedCommit: 2_520_000,
    actualClosed: 2_480_000,
  },
  {
    weekEnding: "2026-08-20",
    label: "Week of Aug 17",
    repCalledCommit: 3_400_000,
    evidenceAdjustedCommit: 2_710_000,
    actualClosed: 2_800_000,
  },
  {
    weekEnding: "2026-08-27",
    label: "Week of Aug 24",
    repCalledCommit: 3_850_000,
    evidenceAdjustedCommit: 2_950_000,
    actualClosed: 2_880_000,
  },
];
