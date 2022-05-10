import z from "zod";

export const DbTradePayload = z.object({
  timestamp: z.string(),
  type: z.union([z.literal("BUY"), z.literal("SELL")]),
  price: z.string(),
  amount: z.string(),
  value: z.string(),
  from: z.string(),
  to: z.string(),
  profit: z.string(),
  audValue: z.string(),
  audBusd: z.string(),
  isTestNet: z.union([z.literal("0"), z.literal("1")]),
});

export type IDbTradePayload = z.infer<typeof DbTradePayload>;
