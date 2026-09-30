import { describe, expect, it } from "vitest";
import type { CompsProvider, ListingsProvider } from "../providers";
import { AskingCompSchema, SoldCompSchema, type InstrumentQuery } from "../schemas";

export interface ContractFixture<P> {
  create(): P;
  /** A query the provider's fixture data has at least 2 results for. */
  matchingQuery: InstrumentQuery;
  /** A query the provider's fixture data has no results for. */
  noMatchQuery: InstrumentQuery;
}

/** Throws unless every result is a valid asking comp. Exported so the check itself is testable. */
export function assertAskingResults(results: unknown[]): void {
  for (const r of results) AskingCompSchema.parse(r);
}

/** Throws unless every result is a valid sold comp. */
export function assertSoldResults(results: unknown[]): void {
  for (const r of results) SoldCompSchema.parse(r);
}

export function runListingsProviderContract(name: string, fx: ContractFixture<ListingsProvider>): void {
  describe(`ListingsProvider contract: ${name}`, () => {
    it("has a non-empty id", () => {
      expect(fx.create().id.trim()).not.toBe("");
    });

    it("returns valid asking comps for a matching query", async () => {
      const results = await fx.create().searchListings(fx.matchingQuery);
      expect(results.length).toBeGreaterThan(0);
      assertAskingResults(results);
    });

    it("returns an empty array, not an error, when nothing matches", async () => {
      expect(await fx.create().searchListings(fx.noMatchQuery)).toEqual([]);
    });

    it("respects limit", async () => {
      const results = await fx.create().searchListings(fx.matchingQuery, { limit: 1 });
      expect(results).toHaveLength(1);
    });

    it("rejects when the signal is already aborted", async () => {
      const ctrl = new AbortController();
      ctrl.abort();
      await expect(fx.create().searchListings(fx.matchingQuery, { signal: ctrl.signal })).rejects.toThrow();
    });
  });
}

export function runCompsProviderContract(name: string, fx: ContractFixture<CompsProvider>): void {
  describe(`CompsProvider contract: ${name}`, () => {
    it("has a non-empty id", () => {
      expect(fx.create().id.trim()).not.toBe("");
    });

    it("returns valid sold comps for a matching query", async () => {
      const results = await fx.create().searchSoldComps(fx.matchingQuery);
      expect(results.length).toBeGreaterThan(0);
      assertSoldResults(results);
    });

    it("returns an empty array, not an error, when nothing matches", async () => {
      expect(await fx.create().searchSoldComps(fx.noMatchQuery)).toEqual([]);
    });

    it("respects limit", async () => {
      const results = await fx.create().searchSoldComps(fx.matchingQuery, { limit: 1 });
      expect(results).toHaveLength(1);
    });

    it("rejects when the signal is already aborted", async () => {
      const ctrl = new AbortController();
      ctrl.abort();
      await expect(fx.create().searchSoldComps(fx.matchingQuery, { signal: ctrl.signal })).rejects.toThrow();
    });
  });
}
