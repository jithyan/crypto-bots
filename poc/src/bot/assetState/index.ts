import { HoldStableAsset } from "./assetState.js";
import {
  TVolatileCoins,
  TStableCoins,
  binanceWallet,
} from "../../wallet/index.js";
import { startNewPriceTrendDecisionEngine } from "../decisionEngine";

export async function initialiseAssetState(args: {
  volatileAsset: TVolatileCoins;
  stableAsset: TStableCoins;
}) {
  const currentPrice = await binanceWallet.getLatestPrice(
    args.volatileAsset,
    args.stableAsset
  );
  const decisionEngine = startNewPriceTrendDecisionEngine(currentPrice);
  return new HoldStableAsset({ ...args, decisionEngine });
}
