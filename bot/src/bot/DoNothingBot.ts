import type { ITradeAssetCycle } from "./assetState/assetState";
import { ISleepStrategy } from "./sleep/BaseSleepStrategy.js";

export class DoNothingBot implements ITradeAssetCycle {
  readonly sleep: ISleepStrategy;

  constructor(sleep: ISleepStrategy) {
    this.sleep = sleep;
  }

  dehydrate = () => {};

  execute = async () => {
    await this.sleep.onHoldStableAsset();
    return this;
  };

  getCurrentState = () => "DoNothing";
}
