import Big from "big.js";
import { TSleepStrategyTypes } from "./bot/sleep/BaseSleepStrategy.js";
import { TCoinPair, TExchange } from "./exchange/index.js";

/**!
 * DONT FORGET - to add the corresponding process.env variable
 * to the esbuild script.
 */
export const Config = {
  COLLECT_PRICE_STATS:
    process.env.COLLECT_PRICE_STATS?.trim().toLowerCase() === "true",
  APP_VERSION: process.env.APP_VERSION?.trim() ?? "not-set",
  EXCHANGE: process.env.EXCHANGE?.trim().toLowerCase() ?? "not-set",
  SYMBOL: `${process.env.VOLATILE_COIN}${process.env.STABLE_COIN}`,
  APPSTATE_FILENAME: `./${process.env.EXCHANGE?.trim().toLowerCase()}_${process.env.VOLATILE_COIN?.trim().toLowerCase()}${process.env.STABLE_COIN?.trim().toLowerCase()}_appState.json`,
  MAX_BUY_AMOUNT: new Big(process.env.MAX_BUY_AMOUNT?.trim() ?? "25"),
  PORT: process.env.PORT,
  SLEEP_STRATEGY: process.env.SLEEP_STRATEGY?.trim() ?? "not-set",
  TERMINATE_ON_ERROR: process.env.TERMINATE_ON_ERROR?.trim() === "true",
  RUN_BOT_ON_STARTUP: process.env.RUN_BOT_ON_STARTUP?.trim() === "true",
  PRICE_HAS_INCREASED_THRESHOLD:
    process.env.PRICE_HAS_INCREASED_THRESHOLD?.trim() ?? "not-set",
  PRICE_HAS_DECREASED_THRESHOLD:
    process.env.PRICE_HAS_DECREASED_THRESHOLD?.trim() ?? "not-set",
  STOP_LOSS_THRESHOLD: process.env.STOP_LOSS_THRESHOLD?.trim() ?? "not-set",
  ENABLE_RESUME: (process.env.ENABLE_RESUME?.trim() ?? "true") === "true",
} as {
  APP_VERSION: string;
  EXCHANGE: TExchange;
  SYMBOL: TCoinPair;
  APPSTATE_FILENAME: string;
  COLLECT_PRICE_STATS: boolean;
  MAX_BUY_AMOUNT: Big;
  PORT: string;
  SLEEP_STRATEGY: TSleepStrategyTypes;
  TERMINATE_ON_ERROR: boolean;
  RUN_BOT_ON_STARTUP: boolean;
  PRICE_HAS_INCREASED_THRESHOLD: string;
  PRICE_HAS_DECREASED_THRESHOLD: string;
  STOP_LOSS_THRESHOLD: string;
  ENABLE_RESUME: boolean;
};
