import type { CompsProvider, ListingsProvider, SearchOptions } from "../providers";
import type { AskingComp, InstrumentQuery, SoldComp } from "../schemas";

function matches(q: InstrumentQuery, c: { make?: string; model?: string; year?: number }): boolean {
  const eq = (a?: string, b?: string) => !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();
  return eq(q.make, c.make) && eq(q.model, c.model) && (q.year === undefined || q.year === c.year);
}

function select<T extends { make?: string; model?: string; year?: number }>(
  items: T[],
  q: InstrumentQuery,
  options?: SearchOptions,
): T[] {
  options?.signal?.throwIfAborted();
  const found = items.filter((c) => matches(q, c));
  return options?.limit === undefined ? found : found.slice(0, options.limit);
}

export class InMemoryListingsProvider implements ListingsProvider {
  constructor(
    readonly id: string,
    private readonly items: AskingComp[],
  ) {}
  async searchListings(q: InstrumentQuery, options?: SearchOptions): Promise<AskingComp[]> {
    return select(this.items, q, options);
  }
}

export class InMemoryCompsProvider implements CompsProvider {
  constructor(
    readonly id: string,
    private readonly items: SoldComp[],
  ) {}
  async searchSoldComps(q: InstrumentQuery, options?: SearchOptions): Promise<SoldComp[]> {
    return select(this.items, q, options);
  }
}
