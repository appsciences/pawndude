import { describe, expect, it } from "vitest";
import type { AskingComp, SoldComp } from "./schemas";
import { InMemoryCompsProvider, InMemoryListingsProvider } from "./testing/inMemory";
import {
  assertAskingResults,
  assertSoldResults,
  runCompsProviderContract,
  runListingsProviderContract,
} from "./testing/contracts";

const asking = (n: number, over: Partial<AskingComp> = {}): AskingComp => ({
  kind: "asking",
  source: "memory",
  sourceId: `a${n}`,
  url: `https://example.com/a${n}`,
  title: `1978 Fender Stratocaster #${n}`,
  make: "Fender",
  model: "Stratocaster",
  year: 1978,
  condition: "good",
  price: { amountCents: 100000 + n * 1000, currency: "USD" },
  retrievedAt: "2026-09-30T12:00:00Z",
  ...over,
});

const sold = (n: number): SoldComp => ({
  ...asking(n),
  kind: "sold",
  soldAt: "2026-09-01T00:00:00Z",
});

const query = { make: "Fender", model: "Stratocaster" };
const noMatch = { make: "Zzyzx", model: "Nothing" };

runListingsProviderContract("InMemoryListingsProvider", {
  create: () => new InMemoryListingsProvider("memory", [asking(1), asking(2), asking(3)]),
  matchingQuery: query,
  noMatchQuery: noMatch,
});

runCompsProviderContract("InMemoryCompsProvider", {
  create: () => new InMemoryCompsProvider("memory", [sold(1), sold(2), sold(3)]),
  matchingQuery: query,
  noMatchQuery: noMatch,
});

describe("the contract harness itself", () => {
  it("the asking assertion rejects sold data mislabeled as asking, and vice versa", () => {
    expect(() => assertAskingResults([sold(1)])).toThrow();
    expect(() => assertSoldResults([asking(1)])).toThrow();
    expect(() => assertAskingResults([asking(1)])).not.toThrow();
    expect(() => assertSoldResults([sold(1)])).not.toThrow();
  });

  it("InMemoryListingsProvider only matches on make and model, case-insensitively", async () => {
    const p = new InMemoryListingsProvider("memory", [asking(1), asking(2, { model: "Telecaster" })]);
    const res = await p.searchListings({ make: "fender", model: "STRATOCASTER" });
    expect(res.map((r) => r.sourceId)).toEqual(["a1"]);
  });

  it("InMemoryListingsProvider honours year when given", async () => {
    const p = new InMemoryListingsProvider("memory", [asking(1), asking(2, { year: 1965 })]);
    const res = await p.searchListings({ ...query, year: 1965 });
    expect(res.map((r) => r.sourceId)).toEqual(["a2"]);
  });
});
