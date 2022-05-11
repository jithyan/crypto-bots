import { number, z } from "zod";

export const BotStatus = z.union([
  z.literal("ONLINE"),
  z.literal("SHUTTING DOWN"),
  z.literal("OFFLINE"),
  z.literal("NOT WORKING"),
  z.literal("STARTING UP"),
]);
export type TBotStatus = z.infer<typeof BotStatus>;

export const BotInfoReq = z.object({
  version: z.string(),
  exchange: z.string(),
  symbol: z.string(),
  port: z.string(),
  location: z.string().optional(),
  status: BotStatus.optional(),
  lastState: z.any().optional(),
  maxBuyAmount: z.string().optional(),
});
export type TBotInfoReq = z.infer<typeof BotInfoReq>;

export type TBotStatusEvent =
  | "allbots"
  | "botstatus"
  | "botremove"
  | "botupdate";

export const BotActions = z.union([
  z.literal("shutdown"),
  z.literal("startup"),
  z.literal("remove"),
  z.literal("liquidate"),
]);
export type TBotActions = z.infer<typeof BotActions>;

export const BotActionsPath = z.union([
  z.literal("/bots/shutdown"),
  z.literal("/bots/startup"),
  z.literal("/bots/remove"),
  z.literal("/bots/liquidate"),
]);
export type TBotActionsPath = z.infer<typeof BotActionsPath>;

export const BotAvailableActions = z.record(BotActions, BotActionsPath);
export type TBotAvailableActions = z.infer<typeof BotAvailableActions>;

export const BotStatusUpdate = z.object({
  id: z.string(),
  status: BotStatus,
  actions: BotAvailableActions,
});
export type IBotStatusUpdate = z.infer<typeof BotStatusUpdate>;

export const BotStateDetails = z.object({
  profit: z.string(),
  state: z.string(),
  priceTrendState: z.string(),
  tickerPrice: z.string(),
  lastPurchasePrice: z.string().optional(),
  iteration: z.number(),
  isSimulation: z.boolean().optional(),
  config: z.object({
    priceHasIncreased: z.string(),
    priceHasDecreased: z.string(),
    stopLoss: z.string(),
    minPercentIncreaseForSell: z.string(),
    sleepStrategy: z.string(),
    maxBuyAmount: z.string(),
    postSellSleep: z.string(),
    pumpInc: z.string(),
  }),
});

export type IBotStateDetails = z.infer<typeof BotStateDetails>;

export const BotInfoStream = z.object({
  lastCheckIn: z.string(),
  actions: BotAvailableActions,
  id: z.string(),
  status: BotStatus,
  version: z.string(),
  exchange: z.string(),
  symbol: z.string(),
  state: BotStateDetails,
});

export type IBotInfoStream = z.infer<typeof BotInfoStream>;

export function mapBotLastStateToStateDetails(
  bot: TBotInfoReq
): IBotStateDetails {
  const {
    PRICE_HAS_DECREASED_THRESHOLD = "missing",
    PRICE_HAS_INCREASED_THRESHOLD = "missing",
    STOP_LOSS_THRESHOLD = "missing",
    MIN_PERCENT_INCREASE_FOR_SELL = "missing",
    PUMP_INC = "missing",
  } = bot.lastState?.decisionEngine?.decisionConfig ?? {};

  return {
    profit: bot.lastState?.stats?.usdProfitToDate ?? "0",
    state: bot.lastState?.state ?? "",
    priceTrendState: bot.lastState?.decisionEngine?.state ?? "",
    tickerPrice: bot.lastState?.decisionEngine?.lastTickerPrice ?? "0",
    lastPurchasePrice: bot.lastState?.decisionEngine?.lastPurchasePrice,
    iteration: bot.lastState?.iteration ?? 0,
    isSimulation: Boolean(bot?.lastState?.isSimulation),
    config: {
      priceHasIncreased: PRICE_HAS_INCREASED_THRESHOLD,
      priceHasDecreased: PRICE_HAS_DECREASED_THRESHOLD,
      stopLoss: STOP_LOSS_THRESHOLD,
      minPercentIncreaseForSell: MIN_PERCENT_INCREASE_FOR_SELL,
      pumpInc: PUMP_INC,
      sleepStrategy: bot?.lastState?.sleep?.sleepStrategy,
      maxBuyAmount: bot?.maxBuyAmount ?? "",
      postSellSleep: bot?.lastState?.postSellSleep?.toString() ?? "",
    },
  };
}

export const BotRemovalUpdate = z.object({
  id: z.string(),
});
export type IBotRemovalUpdate = z.infer<typeof BotRemovalUpdate>;
