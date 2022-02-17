import fs from "fs";
import {
  HoldStableAsset,
  HoldVolatileAsset,
  ITradeAssetCycle,
  StableAssetOrderPlaced,
  TAssetStates,
  VolatileAssetOrderPlaced,
} from "./assetState.js";
import {
  TVolatileCoins,
  TStableCoins,
  binanceWallet,
} from "../../wallet/index.js";
import { startNewPriceTrendDecisionEngine } from "../decisionEngine/index.js";
import { generalLogger } from "../../log/index.js";
import {
  DecisionStates,
  DownwardPriceTrend,
  Start,
  UpwardPriceTrend,
  UpwardPriceTrendConfirmed,
} from "../decisionEngine/priceTrendDecision.js";

export function hydrate(filepath: string): ITradeAssetCycle {
  const file: Record<string, any> = JSON.parse(
    fs.readFileSync(filepath, "utf8")
  );

  generalLogger.info("Attempt to hydrate", { file, filepath });

  const { symbol, state, stableAsset, volatileAsset, clientOrderId } = file;
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
      decisionEngine = new Start(lastPurchasePrice);
      break;
    case "DownwardPriceTrend":
      decisionEngine = new DownwardPriceTrend(deArgs);
      break;
    case "UpwardPriceTrend":
      decisionEngine = new UpwardPriceTrend(deArgs);
      break;
    case "UpwardPriceTrendConfirmed":
      decisionEngine = new UpwardPriceTrendConfirmed(deArgs);
      break;
    default:
      throw new Error("Unrecognized decision state: " + deState);
  }

  const assetStateArgs = {
    symbol,
    state,
    stableAsset,
    volatileAsset,
    isStableAssetClass,
    decisionEngine,
  };

  switch (state as TAssetStates) {
    case "HoldStableAsset":
      return new HoldStableAsset(assetStateArgs);

    case "HoldVolatileAsset":
      return new HoldVolatileAsset(assetStateArgs);

    case "StableAssetOrderPlaced":
      return new StableAssetOrderPlaced(assetStateArgs, clientOrderId);

    case "VolatileAssetOrderPlaced":
      return new VolatileAssetOrderPlaced(assetStateArgs, clientOrderId);

    default:
      throw new Error("Unrecognized asset state: " + state);
  }
}

export async function initialiseAssetState(args: {
  volatileAsset: TVolatileCoins;
  stableAsset: TStableCoins;
}): Promise<ITradeAssetCycle> {
  const currentPrice = await binanceWallet.getLatestPrice(
    args.volatileAsset,
    args.stableAsset
  );
  const decisionEngine = startNewPriceTrendDecisionEngine(currentPrice);
  return new HoldStableAsset({ ...args, decisionEngine });
}
