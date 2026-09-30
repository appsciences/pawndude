import type { AskingComp, InstrumentQuery, SoldComp } from "./schemas";

export interface SearchOptions {
  /** Maximum number of results to return. */
  limit?: number;
  signal?: AbortSignal;
}

/** Live listings (asking prices). Must only return `kind: "asking"`. */
export interface ListingsProvider {
  readonly id: string;
  searchListings(query: InstrumentQuery, options?: SearchOptions): Promise<AskingComp[]>;
}

/** Completed sales. Must only return `kind: "sold"`. */
export interface CompsProvider {
  readonly id: string;
  searchSoldComps(query: InstrumentQuery, options?: SearchOptions): Promise<SoldComp[]>;
}
