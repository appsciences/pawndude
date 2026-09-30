import { z } from "zod";

export const ConditionSchema = z.enum([
  "new",
  "mint",
  "excellent",
  "very_good",
  "good",
  "fair",
  "poor",
  "non_functioning",
  "unknown",
]);
export type Condition = z.infer<typeof ConditionSchema>;

// Reverb's vocabulary; "B-Stock" is factory-refurbished/open-box, treated as excellent.
const ALIASES: Record<string, Condition> = {
  brand_new: "new",
  new: "new",
  mint: "mint",
  excellent: "excellent",
  b_stock: "excellent",
  very_good: "very_good",
  good: "good",
  fair: "fair",
  poor: "poor",
  non_functioning: "non_functioning",
};

export function normalizeCondition(raw: string | undefined | null): Condition {
  if (!raw) return "unknown";
  const key = raw.trim().toLowerCase().replace(/[\s_-]+/g, "_");
  return ALIASES[key] ?? "unknown";
}
