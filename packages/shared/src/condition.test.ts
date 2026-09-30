import { describe, expect, it } from "vitest";
import { normalizeCondition } from "./condition";

describe("normalizeCondition (Reverb vocabulary)", () => {
  it.each([
    ["Brand New", "new"],
    ["Mint", "mint"],
    ["Excellent", "excellent"],
    ["Very Good", "very_good"],
    ["Good", "good"],
    ["Fair", "fair"],
    ["Poor", "poor"],
    ["Non Functioning", "non_functioning"],
    ["B-Stock", "excellent"],
  ])("%s -> %s", (input, expected) => {
    expect(normalizeCondition(input)).toBe(expected);
  });

  it("ignores case, extra whitespace and underscores/hyphens", () => {
    expect(normalizeCondition("  VERY   good ")).toBe("very_good");
    expect(normalizeCondition("very_good")).toBe("very_good");
    expect(normalizeCondition("Very-Good")).toBe("very_good");
  });

  it("falls back to unknown", () => {
    expect(normalizeCondition("")).toBe("unknown");
    expect(normalizeCondition("vintage vibes")).toBe("unknown");
    expect(normalizeCondition(undefined)).toBe("unknown");
  });
});
