# Forecast Evidence Engine

**Illustrative synthetic data — not real Level AI or customer data.** Every opportunity, conversation, amount, and trailing-accuracy snapshot in this repo is fabricated for a work sample. There are no live calls to Gong, Salesforce, Level AI, or Cortex. Account names are invented.

---

A job-application artifact from **Joseph DeVille**, GTM Engineer, for the **Revenue Operations Architect — GTM Systems Builder** role at Level AI, reporting to CRO **James Manno**.

The job description asks, verbatim, for *“a simplified, high-accuracy forecast off two sources only — Gong + Salesforce — on a MEDDICC-based commit/best-case structure with a +/-5% accuracy target and a weekly CRO cadence.”* It also asks for a live executive dashboard (pipeline coverage, conversion, forecast accuracy) that is self-serve, not a weekly manual pull.

This app is that system, end to end, on synthetic data.

## Thesis

Enterprises have been making decisions off a thin sample of what actually happened. Applied to forecasting: **a deal’s CRM stage is a claim. The conversation record is the evidence. The forecast should only trust claims that have evidence behind them.**

Salesforce says what the rep believes. Gong shows what happened. Where those disagree, the forecast is wrong — and the dashboard says so loudly.

## How the gate works

A deal cannot sit in **Commit** unless all three are true:

1. **Fresh evidence.** A meaningful external call in the last 14 days. Calls under 180 seconds do not count.
2. **Economic buyer on a call.** Naming a CFO in Salesforce is not engagement. That person has to appear as a participant.
3. **MEDDICC floor.** Completeness score at or above 55 / 100. A field corroborated by a call counts 1.0; the same field as CRM-only text counts 0.5; absent counts 0.

If a claimed Commit fails those rules, it is demoted to Best Case — or to Pipeline if evidence is severely stale (over 45 days or no meaningful call) or the MEDDICC score is under 30. The gate **never promotes**. The rep’s conservatism is left alone; unsupported optimism is not.

The headline of the app is the delta: **rep-called Commit** versus **evidence-adjusted Commit**.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No database, no API keys, no env file.

```bash
npm test      # Vitest — evidence engine, including seeded conflict cases
npm run build # Production build
```

Deploys to Vercel with zero config.

## JD map

| Responsibility from the role | Where it lives |
| --- | --- |
| Forecast off Gong + Salesforce only | `data/calls.ts` (Gong-like), `data/opportunities.ts` (Salesforce-like), `lib/forecast.ts` |
| MEDDICC-based Commit / Best Case | `lib/meddiccScore.ts`, `lib/evidenceGate.ts` |
| ±5% accuracy target, weekly CRO cadence | `app/page.tsx` (CRO view), `data/trailingAccuracy.ts`, `components/ExceptionsTable.tsx` |
| Live dashboard: coverage, conversion, accuracy | `app/page.tsx`, `lib/evaluate.ts` (`coverageSnapshot`) |
| Self-serve, not a weekly manual pull | `/` CRO view + `/deals` + `/deals/[id]` — the exception list is generated, not assembled |
| Evidence vs. claim (the product thesis applied to forecast) | `lib/evidenceGate.ts`, `lib/dataQualityFindings.ts`, deal-detail citations |

## Seeded conflict cases

The demo is built to have teeth. Look these up on `/deals`:

| Id | Account | What it proves |
| --- | --- | --- |
| `opp-stale-commit` | Northwind Logistics | Commit whose last meaningful external call was 40+ days ago |
| `opp-no-eb-commit` | Helios Freight | Commit whose named economic buyer never appears on a call |
| `opp-hidden-competitor` | Meridian Health Systems | CRM competition field empty; calls name Voxora Replay |
| `opp-single-thread` | Atlas Retail Group | Only one external participant across every call |
| `opp-low-meddicc-commit` | Quorum Legal | Commit with a MEDDICC score below the floor |

## Layout

```
data/          typed synthetic seed (opportunities, calls, trailing weeks)
lib/           pure evidence engine — the part a reviewer should actually read
app/           CRO view, deals table, deal detail
components/    dense executive UI, no marketing chrome
```

Core functions, all unit-tested:

- `meddiccScore(opp, calls)`
- `evidenceFreshness(opp, calls, asOf)`
- `multiThreadScore(opp, calls)`
- `economicBuyerEngaged(opp, calls)`
- `evidenceGate(opp, calls, asOf)`
- `forecast(opps, calls, asOf)`
- `dataQualityFindings(opps, calls, asOf)`

The as-of date is frozen at `2026-09-03` (`lib/constants.ts`) so freshness math stays deterministic.

## What I would build next in the seat

The lib functions already take plain data structures. Wiring production is adapter work, not a rewrite.

1. **Gong + Salesforce adapters** behind the same `Opportunity` and `CallRecord` types. Only the loaders change.
2. **Write the evidence-adjusted category back to Salesforce as a separate field.** Do not overwrite the rep’s call. The point is a second number the CRO can trust, not a fight with the field.
3. **Post this week’s exception list to Slack** ahead of the CRO forecast call, with links into the deal record.
4. **Track forecast accuracy over time** against actuals and prove or disprove the ±5% target. The trailing table here is a sketch of that report; in the seat it would be a real closed-won series.

## Limitations

- **Synthetic data.** Useful for showing the system. Useless for calibrating it.
- **No auth.** This is a local/Vercel demo, not an internal app.
- **Scoring weights are starting points.** Call = 1.0, CRM = 0.5, 14-day freshness, MEDDICC floor of 55 — all illustrative. They should be fit against real closed-won / closed-lost outcomes, not opinions.
- **Conversion on the CRO view is a late-stage mix**, not a historical win rate. A production dashboard would use cohort conversion from the CRM.
- **Trailing accuracy weeks are fabricated** to show the shape of the report. They are not a claim about any real book of business.
