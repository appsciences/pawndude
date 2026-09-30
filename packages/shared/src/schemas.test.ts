import { describe, expect, it } from "vitest";
import { AskingCompSchema, InstrumentQuerySchema, SoldCompSchema } from "./schemas";

const base = {
  source: "reverb",
  sourceId: "12345",
  url: "https://reverb.com/item/12345-fender-stratocaster",
  title: "1978 Fender Stratocaster",
  make: "Fender",
  model: "Stratocaster",
  year: 1978,
  condition: "very_good",
  price: { amountCents: 250000, currency: "USD" },
  shipping: { amountCents: 12000, currency: "USD" },
  retrievedAt: "2026-09-30T12:00:00Z",
};

describe("AskingCompSchema", () => {
  it("accepts a valid asking comp", () => {
    expect(AskingCompSchema.parse({ ...base, kind: "asking" }).kind).toBe("asking");
  });

  it("makes shipping, year, make, model and finish optional", () => {
    const { shipping, year, make, model, ...rest } = base;
    expect(AskingCompSchema.safeParse({ ...rest, kind: "asking" }).success).toBe(true);
  });

  it("rejects negative or fractional prices", () => {
    expect(
      AskingCompSchema.safeParse({ ...base, kind: "asking", price: { amountCents: -1, currency: "USD" } }).success,
    ).toBe(false);
    expect(
      AskingCompSchema.safeParse({ ...base, kind: "asking", price: { amountCents: 10.5, currency: "USD" } }).success,
    ).toBe(false);
  });

  it("rejects a non-URL link and an unknown condition", () => {
    expect(AskingCompSchema.safeParse({ ...base, kind: "asking", url: "not a url" }).success).toBe(false);
    expect(AskingCompSchema.safeParse({ ...base, kind: "asking", condition: "shiny" }).success).toBe(false);
  });
});

describe("SoldCompSchema", () => {
  it("requires soldAt", () => {
    expect(SoldCompSchema.safeParse({ ...base, kind: "sold" }).success).toBe(false);
    expect(SoldCompSchema.safeParse({ ...base, kind: "sold", soldAt: "2026-09-01T00:00:00Z" }).success).toBe(true);
  });

  it("does not accept an asking comp", () => {
    expect(SoldCompSchema.safeParse({ ...base, kind: "asking" }).success).toBe(false);
  });
});

describe("InstrumentQuerySchema", () => {
  it("requires make and model", () => {
    expect(InstrumentQuerySchema.safeParse({ make: "Fender" }).success).toBe(false);
    expect(InstrumentQuerySchema.safeParse({ make: "Fender", model: "Telecaster" }).success).toBe(true);
  });

  it("rejects empty strings and implausible years", () => {
    expect(InstrumentQuerySchema.safeParse({ make: " ", model: "Telecaster" }).success).toBe(false);
    expect(InstrumentQuerySchema.safeParse({ make: "Fender", model: "Telecaster", year: 1700 }).success).toBe(false);
  });
});
