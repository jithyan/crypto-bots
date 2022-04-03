import fs from "fs";
import {
  HoldStableAsset,
  HoldVolatileAsset,
  ITradeAssetCycle,
  PostSellStasis,
  StableAssetOrderPlaced,
  TAssetStates,
  VolatileAssetOrderPlaced,
} from "./assetState.js";
import {
  TVolatileCoins,
  TStableCoins,
  getExchangeClient,
} from "../../exchange/index.js";
import { startNewPriceTrendDecisionEngine } from "../decisionEngine/index.js";
import { generalLogger } from "../../log/index.js";
import {
  DecisionStates,
  DownwardPriceTrend,
  PriceTrendDecisionConfig,
  Start,
  UpwardPriceTrend,
  UpwardPriceTrendConfirmed,
} from "../decisionEngine/priceTrendDecision.js";
import { Config } from "../../config.js";
import { getSleepStrategy, TSleepStrategyTypes } from "../sleep/index.js";

const binanceClient = getExchangeClient(Config.EXCHANGE);

export function hydrate(
  filepath: string,
  sleepStrategy: TSleepStrategyTypes,
  decisionConfig: PriceTrendDecisionConfig
): ITradeAssetCycle {
  const file: Record<string, any> = JSON.parse(
    fs.readFileSync(filepath, "utf8")
  );

  generalLogger.info("Attempt to hydrate", { file, filepath });

  const {
    symbol,
    state,
    stableAsset,
    volatileAsset,
    clientOrderId,
    stats,
    iteration,
    postSellSleep,
  } = file;
  const {
    state: deState,
    lastPurchasePrice,
    lastTickerPrice,
  } = file.decisionEngine;
  const isStableAssetClass =
    typeof file.isStableAssetClass === "boolean"
      ? file.isStableAssetClass
      : file.isStableAssetClass === "true";

  let decisionEngine;
  const deArgs = {
    lastPurchasePrice,
    lastTickerPrice,
  };
  switch (deState as DecisionStates) {
    case "Start":
      decisionEngine = new Start(lastPurchasePrice, decisionConfig);
      break;
    case "DownwardPriceTrend":
      decisionEngine = new DownwardPriceTrend(deArgs, decisionConfig);
      break;
    case "UpwardPriceTrend":
      decisionEngine = new UpwardPriceTrend(deArgs, decisionConfig);
      break;
    case "UpwardPriceTrendConfirmed":
      decisionEngine = new UpwardPriceTrendConfirmed(deArgs, decisionConfig);
      break;
    default:
      throw new Error("Unrecognized decision state: " + deState);
  }

  const assetStateArgs = {
    stats: stats ?? { usdProfitToDate: "0" },
    symbol,
    state,
    stableAsset,
    volatileAsset,
    isStableAssetClass,
    decisionEngine,
    sleep: getSleepStrategy(sleepStrategy),
    postSellSleep: Number(
      postSellSleep ? postSellSleep : Config.POST_SELL_SLEEP
    ),
  };

  switch (state as TAssetStates) {
    case "HoldStableAsset":
      return new HoldStableAsset(assetStateArgs);

    case "HoldVolatileAsset":
      return new HoldVolatileAsset(assetStateArgs);

    case "StableAssetOrderPlaced":
      return new StableAssetOrderPlaced(
        assetStateArgs,
        clientOrderId,
        file.lastPurchasePrice ?? "0"
      );

    case "VolatileAssetOrderPlaced":
      return new VolatileAssetOrderPlaced(
        assetStateArgs,
        clientOrderId,
        file.lastPurchasePrice ?? "0"
      );
    case "PostSellStasis":
      return new PostSellStasis(assetStateArgs, iteration);

    default:
      throw new Error("Unrecognized asset state: " + state);
  }
}

export async function initialiseAssetState(args: {
  volatileAsset: TVolatileCoins;
  stableAsset: TStableCoins;
  sleepStrategy: TSleepStrategyTypes;
  decisionConfig: PriceTrendDecisionConfig;
  postSellSleep: number;
}): Promise<ITradeAssetCycle> {
  const currentPrice = await binanceClient.getLatestPrice(
    args.volatileAsset,
    args.stableAsset
  );
  const decisionEngine = startNewPriceTrendDecisionEngine(
    currentPrice,
    args.decisionConfig
  );
  const sleep = getSleepStrategy(args.sleepStrategy);
  return new HoldStableAsset({
    ...args,
    decisionEngine,
    sleep,
    stats: { usdProfitToDate: "0" },
  });
}
