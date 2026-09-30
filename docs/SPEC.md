# PawnDude: Product Spec (v0.3 draft)

## 1. Vision
A mobile app that lets any musician turn a Saturday of pawn-shop digging into real side income. Scan an instrument, and PawnDude tells you **what it is, whether it's real, what shape it's in, what it sells for, and what you'd clear after costs**: a clear Buy / Haggle / Pass call with the evidence behind it.

## 2. Users
- **Primary:** gigging/hobbyist musicians and gear heads who already know some gear and want extra income (hundreds of dollars per flip).
- **Secondary:** casual flippers without deep gear knowledge, who need the AI to be the expert.

## 3. Core Jobs to Be Done
1. "What is this thing?" Identify make, model, year range, and notable variants.
2. "Is it legit?" Authenticity assessment (counterfeit, refin, swapped parts, reissue vs. original).
3. "What shape is it in?" Itemized condition, down to fine detail, so there is no misunderstanding when it's resold.
4. "What's it worth?" Market value from real sold comps.
5. "Can I make money?" Net profit after all costs, and a max-buy price.

## 4. Core User Flow
1. **Scan.** Guided capture wizard: overall shots, headstock, serial/neck plate, body front/back, hardware, electronics cavity (where allowed), and a short walkthrough video (see 6.1).
2. **Identify.** The app proposes make/model/year and asks the user to confirm or correct. Serial number OCR feeds the ID.
3. **Analyze.** Runs authenticity, condition, and valuation in parallel; results stream in.
4. **Decide.** The Deal Card shows the verdict, the asking price entered by the user, and the profit calculator.
5. **Act.** Save to "Finds", share the report, use the haggle script, and later mark as bought/sold to track actual profit.

## 5. Features

### 5.1 Capture (mobile)
- Guided checklist per instrument category (guitar/bass, amp, pedal, synth/keys, drums, band/orchestral), with on-screen overlays showing what to shoot next.
- Live quality checks: blur, glare, lighting, and framing warnings before a shot is accepted. Bad input is the largest source of bad output.
- **Photo vs. video:** photos are the default for detail (macro on serials, finish checking, solder joints). Video is used for what stills can't show: rotating the body under light to reveal finish checking/refinishing, neck relief sighting, fret wear, tuning-machine and pot smoothness, and audio (see 5.6). The AI samples sharp keyframes from video, so the user gets photo-grade frames without taking 40 photos.
- Capture keeps working with a weak connection: media is stored locally (IndexedDB) and uploaded when a connection returns (pawn shops are often dead zones).

### 5.2 Identification
- Vision model plus a reference catalog (make/model/year specs, feature timelines, serial-number decoders).
- Serial number OCR and decoding (e.g. Fender, Gibson, Martin, Roland, Moog serial schemes) cross-checked against the claimed year and model.
- Barcode/QR and text OCR on amps, pedals, and synths (plates, date codes, pot codes).

### 5.3 Authenticity
Produces a **score plus itemized evidence**, not a bare number. Examples of checks:
- Serial/year consistency; headstock shape, logo, and decal details vs. known-period references
- Hardware, pots, and pickup date codes vs. period
- Known counterfeit tells per model
- Signs of refinish, neck reset, re-fret, routed cavities, swapped parts (which are "all original" killers)
- Output states: **Likely Authentic / Inconclusive / Concerns Found**. "Inconclusive" is a first-class outcome, with a list of what extra photos or checks would resolve it.
- **Hard rule:** the app never claims certainty it doesn't have. It is decision support, not an appraisal or a legal authentication. The UI says so plainly.

### 5.4 Condition Report
- Structured, itemized grading by component (finish, neck/fretboard, frets, hardware, electronics, structural), each with a photo-linked finding (e.g. "3cm buckle rash, lower bout, see photo 6").
- Defect detection: cracks, repairs, headstock breaks, fret wear, rust/pitting, corrosion, non-original parts, and cosmetic vs. functional issues.
- Overall grade mapped to marketplace vocabulary (Mint/Excellent/Very Good/Good/Fair/Poor, per Reverb/eBay norms).
- Exportable as a buyer-facing report (PDF/link) for the eventual listing, which also reduces returns.
- Every finding is tied to an image region; users can correct or add findings (human-in-the-loop).

### 5.5 Market Valuation
- Pull **sold** comps (not asking prices) for the identified model/year/condition; adjust for condition, originality, and modifications.
- Show a price range (low/median/high), comp count, recency, and confidence. Show the actual comps behind the number.
- Sources (see Plan §Data Sources for feasibility): eBay sold data, Reverb sold/price guide, and others later.
- Sell-through and time-to-sell signals (how fast does this category move?).

### 5.6 Audio (phase 2)
- Optional "plug in / strum / play a note" capture for noise, dead spots, hum, intonation, and a crackly pot. Adds a functional-condition score.

### 5.7 Profit Calculator
Inputs: asking price, negotiated price, expected resale price (from 5.5, overridable).
Costs modeled:
- Sales tax on the purchase
- eBay/Reverb final value fees and payment processing (category-specific rates, kept current)
- Shipping: dimensions/weight by instrument type, carrier rate estimates (UPS/FedEx/USPS freight limits), case/packaging, insurance
- Repair/cleanup allowance (auto-suggested from the condition report, editable)
- Optional: time value and mileage
Outputs:
- **Net profit and ROI**, a **max-buy price** for a target profit, and a **walk-away price**
- Verdict: **Buy / Haggle (target $X) / Pass**, plus a one-line reason
- Sensitivity view: profit at the low/median/high comp

### 5.8 Finds Ledger
- Saved scans, bought/sold status, actual sale price and costs, running profit dashboard, and feedback that improves the model (predicted vs. actual).

## 6. Design Principles
- **Speed at the counter.** Verdict in under ~60s of capture. You're standing in a store.
- **Show your work.** Every claim links to evidence (photo region, comp, reference).
- **Honest uncertainty.** Confidence is always displayed; low-confidence results ask for more input.
- **Discreet.** Useful to use without announcing to the shop owner what you're doing (quiet mode, no audio prompts).
- **Fun.** Gear-nerd delight: era trivia, "hidden gem" callouts, a collection/streak feel.

## 7. AI Approach (high level)
- **v1 uses Claude Vision directly (structured JSON outputs) + retrieval, with no training.** Claude doesn't take video natively, so the app sends sampled keyframes. Use a vision-capable LLM for identification, condition findings, and reasoning, grounded by a retrieval layer over curated reference data (model feature timelines, serial decoders, counterfeit tells, component date codes).
- **Fine-tune specialized models later**, once labeled data exists: defect detection/segmentation, serial OCR, and model/year classification for the top ~50 instrument families.
- Labeled data comes from the app itself: user corrections and confirmed outcomes, plus expert-labeled seed data and licensed/public listing imagery (verify terms).
- **Evaluation first:** build an eval set of ~200+ known-answer instruments (including known fakes and known-condition items) *before* shipping so accuracy is measured, not assumed.

## 8. Platform and Architecture (proposal)
- **Client:** **React Native (Expo) + TypeScript**, mobile-only. Guided capture with Expo Camera or VisionCamera; sharp keyframes sampled from video on-device. On-device helpers (not trained by us): blur/glare gating and serial-number OCR (Apple Vision / ML Kit).
- **Backend:** Next.js route handlers for the API (TypeScript; types shared with the app), with a job queue for analysis pipelines with a job queue for analysis pipelines; Postgres (Supabase is already available in this workspace) plus object storage for media.
- **AI pipeline:** orchestrated multi-step analysis: keyframe selection → ID → authenticity → condition → valuation, each independently cacheable and retryable.
- **Privacy/security:** media encrypted in transit and at rest, user-owned data, deletion on request.

## 9. Risks and Open Questions
| Risk | Why it matters | Mitigation |
|---|---|---|
| **eBay sold-data access** | eBay's public Browse API only returns *active* listings. Sold-listing data needs the restricted Marketplace Insights API (approval required) or alternative sources. | Apply for access early; fall back to Reverb, licensed data providers, or user-submitted comps. **Validate first (Plan Phase 0).** Don't scrape in violation of ToS. |
| **Authenticity accuracy/liability** | A wrong "authentic" call can cost someone real money; a wrong "fake" call can cost a deal. | Frame as decision support; show confidence and evidence; favor "Inconclusive"; add disclaimers; measure against the eval set. |
| **Image quality in the wild** | Bad lighting and reflective finishes cause errors. | Guided capture with live quality gating. |
| **Long tail of instruments** | Thousands of models. | Launch on a narrow category (electric guitars/basses + tube amps) where comps are plentiful and value is high. |
| **Shipping estimates** | Fragile, oversized; carrier rules vary. | Per-category dimension tables plus live rate APIs. |
| **Data rights for training** | Scraped images may not be usable. | Use licensed/consented data and user-contributed data with opt-in. |
| **Business model** | Undecided. | See below. |

Open questions for the product owner:
1. Launch category: electric guitars/basses first? (Recommended)
2. Business model: freemium (N free scans/month) plus subscription for unlimited scans and the ledger? Or pay per scan?
3. Geography and marketplaces at launch: US + eBay + Reverb?
4. Where does the owner want to sell: only eBay, or also Reverb, Facebook Marketplace, and local?
5. iOS first, or both platforms at launch?

## 10. Success Metrics
- ID accuracy (top-1 model/year) on the eval set: target ≥ 90% for launch categories
- Authenticity: high precision on "Concerns Found" (few false alarms), and zero known fakes labeled "Likely Authentic" in the eval set
- Valuation: median absolute error vs. realized sale price ≤ 15%
- Time from first photo to verdict: < 60s
- User-level: % of saved finds bought, and realized profit per user per month
