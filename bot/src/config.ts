import { TCoinPair, TExchange } from "./exchange";

export const Config = {
  APP_VERSION: process.env.APP_VERSION?.trim() ?? "not-set",
  EXCHANGE: process.env.EXCHANGE?.trim().toLowerCase() ?? "not-set",
  SYMBOL: process.env.SYMBOL?.trim().toLowerCase() ?? "not-set",
  APPSTATE_FILENAME: `./${process.env.APP_VERSION?.trim()}_${process.env.EXCHANGE?.trim().toLowerCase()}_${process.env.VOLATILE_COIN?.trim().toLowerCase()}${process.env.STABLE_COIN?.trim().toLowerCase()}_appState.json`,
} as {
  APP_VERSION: string;
  EXCHANGE: TExchange;
  SYMBOL: TCoinPair;
  APPSTATE_FILENAME: string;
};
