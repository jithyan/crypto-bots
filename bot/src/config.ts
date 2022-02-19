import Big from "big.js";
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
} as {
  APP_VERSION: string;
  EXCHANGE: TExchange;
  SYMBOL: TCoinPair;
  APPSTATE_FILENAME: string;
  COLLECT_PRICE_STATS: boolean;
  MAX_BUY_AMOUNT: Big;
};
