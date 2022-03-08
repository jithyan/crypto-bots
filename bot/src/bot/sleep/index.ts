export type { TSleepStrategyTypes, ISleepStrategy } from "./BaseSleepStrategy";
import type {
  ISleepStrategy,
  TSleepStrategyTypes,
} from "./BaseSleepStrategy.js";
import {
  ThreeMinuteSleepStrategy,
  SixMinuteSleepStrategy,
  FifteenMinuteSleepStrategy,
  ThirtyMinuteSleepStrategy,
  SixtyMinuteSleepStrategy,
  NoSleepStrategy,
} from "./sleepStrategies.js";

export function getSleepStrategy(
  strategy: TSleepStrategyTypes
): ISleepStrategy {
  switch (strategy) {
    case "3m":
      return new ThreeMinuteSleepStrategy();
    case "6m":
      return new SixMinuteSleepStrategy();
    case "15m":
      return new FifteenMinuteSleepStrategy();
    case "30m":
      return new ThirtyMinuteSleepStrategy();
    case "60m":
      return new SixtyMinuteSleepStrategy();
    case "no-sleep":
      return new NoSleepStrategy();
    default:
      throw new Error("Unknown strategy: " + strategy);
  }
}
