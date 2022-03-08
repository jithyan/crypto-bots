import { sleep } from "../../utils.js";
import { BaseSleepStrategy } from "./BaseSleepStrategy.js";

export class NoSleepStrategy extends BaseSleepStrategy {
  constructor() {
    super("no-sleep");
  }

  onPlacedVolatileAssetSellOrder = () => Promise.resolve();
  onHoldVolatileAsset = () => Promise.resolve();
  onPlacedVolatileAssetBuyOrder = () => Promise.resolve();
  onHoldStableAsset = () => Promise.resolve();
  onAssetOrderNotFilled = () => Promise.resolve();
  onAssetOrderFilled = () => Promise.resolve();
}

export class ThreeMinuteSleepStrategy extends BaseSleepStrategy {
  constructor() {
    super("3m");
  }

  onPlacedVolatileAssetSellOrder = () => sleep(3);
  onHoldVolatileAsset = () => sleep(3);
  onPlacedVolatileAssetBuyOrder = () => sleep(3);
  onHoldStableAsset = () => sleep(3);
  onAssetOrderNotFilled = () => sleep(3);
  onAssetOrderFilled = () => Promise.resolve();
}

export class SixMinuteSleepStrategy extends BaseSleepStrategy {
  constructor() {
    super("6m");
  }

  onPlacedVolatileAssetSellOrder = () => sleep(6);
  onHoldVolatileAsset = () => sleep(6);
  onPlacedVolatileAssetBuyOrder = () => sleep(6);
  onHoldStableAsset = () => sleep(6);
  onAssetOrderNotFilled = () => sleep(6);
  onAssetOrderFilled = () => Promise.resolve();
}

export class FifteenMinuteSleepStrategy extends BaseSleepStrategy {
  constructor() {
    super("15m");
  }

  onPlacedVolatileAssetSellOrder = () => sleep(15);
  onHoldVolatileAsset = () => sleep(15);
  onPlacedVolatileAssetBuyOrder = () => sleep(15);
  onHoldStableAsset = () => sleep(15);
  onAssetOrderNotFilled = () => sleep(15);
  onAssetOrderFilled = () => Promise.resolve();
}

export class ThirtyMinuteSleepStrategy extends BaseSleepStrategy {
  constructor() {
    super("30m");
  }

  onPlacedVolatileAssetSellOrder = () => sleep(30);
  onHoldVolatileAsset = () => sleep(30);
  onPlacedVolatileAssetBuyOrder = () => sleep(30);
  onHoldStableAsset = () => sleep(30);
  onAssetOrderNotFilled = () => sleep(30);
  onAssetOrderFilled = () => Promise.resolve();
}

export class SixtyMinuteSleepStrategy extends BaseSleepStrategy {
  constructor() {
    super("60m");
  }

  onPlacedVolatileAssetSellOrder = () => sleep(60);
  onHoldVolatileAsset = () => sleep(60);
  onPlacedVolatileAssetBuyOrder = () => sleep(60);
  onHoldStableAsset = () => sleep(60);
  onAssetOrderNotFilled = () => sleep(60);
  onAssetOrderFilled = () => Promise.resolve();
}
