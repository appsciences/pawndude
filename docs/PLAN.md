# PawnDude: Implementation Plan (v0.3 draft)

Guiding idea: **de-risk the two things that could kill the product (valuation data and AI accuracy) before building the polished app.** A pretty camera app on top of an unreliable verdict is worthless.

## SDLC (per `CLAUDE.md`)
Every unit of work follows the same loop:
1. **Issue first:** create a GitHub issue with acceptance criteria before starting.
2. **Feature branch:** one branch per issue (in cloud sessions, the session's designated branch).
3. **Tests first:** write Maestro (mobile) or Playwright (API) E2E tests, plus unit tests for pure logic such as the profit calculator, from the acceptance criteria; watch them fail.
4. **Implement** until green; commits reference the issue (`Refs #N`).
5. **PR** referencing the issue (`Closes #N`); merge only when **all tests pass** (the full test suite).
Stack: React Native (Expo) + TypeScript app; Next.js API; Maestro and Playwright.

## Phase 0: Feasibility Spikes (1–2 weeks)
Goal: answer the go/no-go questions with throwaway code.

| Spike | Question | Done when |
|---|---|---|
| **Comps data** | Can we legitimately get *sold* price data at volume? | eBay Marketplace Insights application submitted; Reverb API and licensed-data alternatives tested; a written decision on the source(s). |
| **AI ID/condition** | How well does a frontier vision model identify and grade instruments from phone photos? | A notebook run over ~50 instruments with a scored report. |
| **Photo vs. video** | Does video-derived keyframe analysis beat stills for finish/neck/wear issues? | A comparison on the same ~20 instruments. |
| **Fee/shipping model** | Can we estimate net profit within a few dollars? | The calculator matches 10 real past sales. |

**Output:** a go/no-go memo and a finalized data-source decision.

## Phase 1: Foundations (weeks 2–4)
- Monorepo: `apps/mobile` (Expo/React Native), `apps/api` (Next.js route handlers), `packages/shared` (types, schemas, profit calculator, valuation), `e2e/` (Maestro for mobile, Playwright for API), and `ml/` (evals and pipelines).
- CI (lint, typecheck, tests); environments; secrets management.
- Database schema (users, scans, media, analyses, comps, finds/ledger, reference catalog) on Postgres/Supabase; object storage with signed uploads.
- Auth (email + Apple/Google sign-in).
- **Eval harness:** dataset format, scoring scripts, and a dashboard. Every later AI change is measured against it.

## Phase 2: Reference Data and Valuation Engine (weeks 3–7, parallel)
- Curate a **reference catalog** for the launch category (electric guitars/basses + tube amps): top ~50 model families with spec timelines, serial decoders, and counterfeit/refin tells.
- Comps ingestion service: fetch, normalize (model/year/condition/mods), dedupe, cache, and refresh.
- Valuation model: robust statistics first (trimmed median by model/year/condition bucket, recency-weighted), then condition and originality adjustments. Output range plus confidence.
- **Profit calculator** as a pure, well-tested library: fees by marketplace/category, tax, shipping tables and rate APIs, repairs. Unit tests with golden cases.

### Data source work (see `docs/DATA_SOURCES.md`)
Reverb provider (#5) and web-search retail provider (#6) are built test-first behind shared provider interfaces during this phase.

## Phase 3: AI Analysis Pipeline (weeks 4–9)
1. **Keyframe extraction** from video (sharpness and coverage scoring).
2. **Identification** via multimodal LLM + retrieval over the catalog; serial OCR and decoding.
3. **Condition analysis**: structured findings tied to image regions; schema-validated JSON output.
4. **Authenticity analysis**: rule/evidence-based checks plus model judgment; calibrated three-state output.
5. **Orchestrator:** async jobs, streaming partial results, retries, caching, cost tracking per scan.
- Prompt and schema versioning; regression-test against the eval set on every change.
- v1 is Claude Vision only; training is phase two. Decide on fine-tuning only after the eval shows specific, data-addressable gaps.

## Phase 4: Mobile App MVP (weeks 5–10)
- Guided capture wizard with live quality gating (blur/glare/light), video record + photo modes, local-first upload queue.
- Result screens: Deal Card (verdict and profit), evidence view (photo overlays), comps view, editable assumptions (asking price, repairs, resale price).
- Finds list and basic ledger.
- Polished, discreet, fast UX; accessibility pass.

## Phase 5: Private Beta (weeks 10–14)
- 20–50 real musicians/flippers scanning in real shops. TestFlight + Play internal track.
- Instrument the funnel: capture completion, time to verdict, corrections made, saved → bought → sold.
- Collect ground truth (actual purchase/sale prices; expert spot-checks of authenticity calls).
- Weekly accuracy review against the eval set and real outcomes; fix the top failure modes.

## Phase 6: Launch Prep (weeks 14–18)
- Legal: disclaimers, ToS/privacy policy, marketplace API terms compliance, data-rights review.
- Monetization (subscription/credits) and paywall; App Store/Play review prep.
- Observability, cost controls, abuse/rate limiting.
- Public launch on the first category.

## Post-Launch Roadmap
1. Audio capture and functional scoring
2. Listing generator (draft eBay/Reverb listings from the condition report and photos)
3. More categories (pedals, synths, vintage keyboards, drums, brass/woodwind)
4. Haggle coach and "hunt mode" (alerts for undervalued local listings, such as Craigslist/FB Marketplace)
5. Fine-tuned defect-detection and model-ID models from accumulated labeled data
6. Community: verified-find sharing, leaderboards

## Team and Tooling Assumptions
- Solo or small team, with Claude Code doing most of the implementation; the human provides domain expertise (gear knowledge for the reference catalog and eval labels), which is the most valuable input to accuracy.
- Suggested stack: TypeScript everywhere (Expo, Next.js API, shared types), Python for `ml/` evals and pipelines, Supabase (Postgres/Auth/Storage), a vision-capable Claude model for analysis.

## Immediate Next Steps
1. Answer the open questions in SPEC §9 (launch category, business model, platforms).
2. Apply for eBay Marketplace Insights API access (long lead time, so start now).
3. Gather 30–50 instruments with known truth for the eval set (owned gear, friends' gear, plus a few known fakes if obtainable).
4. Kick off Phase 0 spikes.
