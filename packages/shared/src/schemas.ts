import { z } from "zod";
import { ConditionSchema } from "./condition";

export const MoneySchema = z.object({
  amountCents: z.number().int().nonnegative(),
  currency: z.string().length(3),
});
export type Money = z.infer<typeof MoneySchema>;

const nonBlank = z.string().trim().min(1);

export const InstrumentQuerySchema = z.object({
  make: nonBlank,
  model: nonBlank,
  year: z.number().int().min(1850).max(2100).optional(),
  finish: nonBlank.optional(),
});
export type InstrumentQuery = z.infer<typeof InstrumentQuerySchema>;

const compBase = z.object({
  source: nonBlank,
  sourceId: nonBlank,
  url: z.string().url(),
  title: nonBlank,
  make: nonBlank.optional(),
  model: nonBlank.optional(),
  year: z.number().int().min(1850).max(2100).optional(),
  finish: nonBlank.optional(),
  condition: ConditionSchema,
  price: MoneySchema,
  shipping: MoneySchema.optional(),
  retrievedAt: z.string().datetime(),
});

/** What a seller currently wants. Not evidence of what buyers pay. */
export const AskingCompSchema = compBase.extend({ kind: z.literal("asking") });
export type AskingComp = z.infer<typeof AskingCompSchema>;

/** What a buyer actually paid. */
export const SoldCompSchema = compBase.extend({
  kind: z.literal("sold"),
  soldAt: z.string().datetime(),
});
export type SoldComp = z.infer<typeof SoldCompSchema>;

export const PriceCompSchema = z.discriminatedUnion("kind", [AskingCompSchema, SoldCompSchema]);
export type PriceComp = z.infer<typeof PriceCompSchema>;
