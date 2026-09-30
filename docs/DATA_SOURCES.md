# PawnDude: Data Sources (v0.1 draft)

Valuation needs two kinds of price data. They are kept separate everywhere in the app:

| Kind | Meaning | Reliability |
|---|---|---|
| **Sold comps** | What buyers actually paid | High |
| **Asking comps** | What sellers currently want | Lower; usually above sale price |

## Provider interfaces (`packages/shared`)
- `CompsProvider`: sold transactions for a normalized instrument (make, model, year, finish, condition).
- `ListingsProvider`: live listings for the same query.
Each provider passes the same contract tests, returns normalized records with `source`, `url` and `retrievedAt`, and can be swapped or disabled without touching valuation.

## Reverb (primary, issue #5)
Status as of research (could not open dev.reverb.com from the build environment, so verify there):
- Documented public API: live listings search and listing detail (token auth).
- Sold data: the Price Guide shows real transactions on the site, but I found no documented API for it. Reports describe undocumented endpoints and third-party scrapers; using those risks violating Reverb's terms and breaking without notice. Not used.
- Plan: (1) build on live listings now; (2) ask Reverb for partner/API access to Price Guide data, describing PawnDude and linking back to listings (which sends them traffic); (3) plug sold data into `CompsProvider` if granted.

## eBay (issue #3)
Browse API gives active listings only. Sold data needs Marketplace Insights approval (owner applying).

## Guitar Center and other retailers (issue #6)
- No public API found. Guitar Center offers an affiliate program; a product feed there is the clean route and is worth applying for.
- Interim: Claude API web search restricted to an allowlist of retailer domains, returning structured, cited results. Low-confidence asking prices, cached, cost tracked.
- No bulk scraping. Review each site's terms before adding it to the allowlist.

## Valuation rule
Estimate = sold comps when available (recency-weighted, trimmed median). Otherwise asking comps discounted by a category sell-through factor learned from data, with the confidence label lowered and the UI saying "based on asking prices".
