import NodeCache from "node-cache";
import { ITradeStatsResponse } from "../models";

interface INodeCached<K, V> {
  get: (key: K) => V | undefined;
  set: (key: K, value: V, ttl?: number) => boolean;
  del: (key: K) => number;
}

export const profitCache = new NodeCache({
  stdTTL: 60 * 60 * 12,
  useClones: true,
  checkperiod: 60 * 60 * 6,
  deleteOnExpire: true,
  maxKeys: 325,
}) as INodeCached<"profit_allsymbols" | string, string>;
const ALL_SYMBOLS_PROFITS_KEY = "profit_allsymbols";

export const tradesCache = new NodeCache({
  stdTTL: 60 * 60 * 12,
  useClones: true,
  checkperiod: 60 * 60 * 6,
  deleteOnExpire: true,
}) as INodeCached<string, ITradeStatsResponse>;

function getTradeCacheKey(inputSymbol: string): string {
  const symbol = inputSymbol.toUpperCase();
  return `${symbol}-trades`;
}

export function getTradeStatsForSymbolFromCache(symbol: string) {
  return tradesCache.get(getTradeCacheKey(symbol));
}

export function setTradeStatsForSymbolFromCache(
  inputSymbol: string,
  newValue: ITradeStatsResponse
) {
  const symbol = inputSymbol.toUpperCase();
  tradesCache.set(getTradeCacheKey(symbol), newValue);
}

export function getAllTimeProfitFromCache(): string | undefined {
  const res = profitCache.get(ALL_SYMBOLS_PROFITS_KEY);

  return typeof res === "string" ? res : undefined;
}

export function setAllTimeProfitCache(newValue: string): void {
  profitCache.set(ALL_SYMBOLS_PROFITS_KEY, newValue);
}

export function updateCacheOnNewTrade(inputSymbol: string) {
  const symbol = inputSymbol.toUpperCase();
  profitCache.del(ALL_SYMBOLS_PROFITS_KEY);
  profitCache.del(symbol);
  tradesCache.del(getTradeCacheKey(symbol));
}
