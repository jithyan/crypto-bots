import { sleep } from "../../utils.js";

export type ISleepStrategy = Record<
  | "onTooManyRequestsError"
  | "onInsuffientBalanceError"
  | "onUnknownApiError"
  | "onPlacedVolatileAssetSellOrder"
  | "onHoldVolatileAsset"
  | "onPlacedVolatileAssetBuyOrder"
  | "onHoldStableAsset"
  | "onAssetOrderNotFilled"
  | "onAssetOrderFilled",
  () => Promise<void>
>;

export type TSleepStrategyTypes =
  | "3m"
  | "6m"
  | "15m"
  | "30m"
  | "60m"
  | "no-sleep";

export abstract class BaseSleepStrategy implements ISleepStrategy {
  public readonly sleepStrategy: TSleepStrategyTypes;

  constructor(sleepStrategy: TSleepStrategyTypes) {
    this.sleepStrategy = sleepStrategy;
  }

  onTooManyRequestsError: () => Promise<void> = () => sleep(15);
  onInsuffientBalanceError: () => Promise<void> = () => sleep(30);
  onUnknownApiError: () => Promise<void> = () => sleep(2);

  abstract onPlacedVolatileAssetSellOrder: () => Promise<void>;
  abstract onHoldVolatileAsset: () => Promise<void>;
  abstract onPlacedVolatileAssetBuyOrder: () => Promise<void>;
  abstract onHoldStableAsset: () => Promise<void>;
  abstract onAssetOrderNotFilled: () => Promise<void>;
  abstract onAssetOrderFilled: () => Promise<void>;
}
