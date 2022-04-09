import z from "zod";

export interface ITradeStatsResponse extends IAggregateTradeStats {
  trades: ITradeResponse;
}
export type IAggregateTradeStats = Record<
  "numSold" | "numProfitableTrades",
  string
>;
export type ITradeResponse = Record<
  "timestamp" | "action" | "price" | "value" | "profit" | "amount",
  string
>[];

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
  trade_id: z.string(),
});

export type ITradeDbRow = z.infer<typeof TradeDbRow>;

export type TradeRowValues = [
  trade_id: string,
  symbol: string,
  at_timestamp: string,
  action: string,
  price: string,
  amount: string,
  busd_value: string,
  from_coin: string,
  to_coin: string,
  profit: string,
  aud_value: string,
  aud_busd: string,
  commission: string
];
