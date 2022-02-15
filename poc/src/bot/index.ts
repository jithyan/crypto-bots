import { TVolatileCoins, TStableCoins } from "../wallet/index.js";
import { initialiseAssetState } from "./assetState/index.js";
import { ITradeAssetCycle } from "./assetState/assetState.js";

export async function* executeTradeCycle(args: {
  volatileAsset: TVolatileCoins;
  stableAsset: TStableCoins;
}) {
  let nextAssetState = await initialiseAssetState(args);
  while (true) {
    nextAssetState = await nextAssetState.execute();
    yield nextAssetState;
  }
}
