import z from "zod";

const TradeDbRow = z.object({
  symbol: z.string(),
  at_timestamp: z.string(),
  action: z.union([z.literal("BUY"), z.literal("SELL")]),
  price: z.string(),
  amount: z.string(),
  busd_value: z.string(),
  from_coin: z.string(),
  to_coin: z.string(),
  profit: z.string(),
  aud_value: z.string(),
  aud_busd: z.string(),
  commission: z.string(),
});

export type ITradeDbRow = z.infer<typeof TradeDbRow>;
