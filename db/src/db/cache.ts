import NodeCache from "node-cache";
import { ITradeStatsResponse } from "../models";
import { toMySqlDate } from "./dbUtils";

interface INodeCached<K, V> {
  get: (key: K) => V | undefined;
  set: (key: K, value: V, ttl?: number) => boolean;
  del: (key: K) => number;
}

export const profitCache = new NodeCache({
  stdTTL: 60 * 60 * 24,
  useClones: true,
  checkperiod: 60 * 60 * 12,
  deleteOnExpire: true,
  maxKeys: 325,
}) as INodeCached<"profit_allsymbols" | string, string>;

export const tradesCache = new NodeCache({
  stdTTL: 60 * 60 * 24,
  useClones: true,
  checkperiod: 60 * 60 * 24,
  deleteOnExpire: true,
  maxKeys: 325,
}) as INodeCached<string, ITradeStatsResponse>;

function getTradeCacheKey(symbol: string): string {
  const today = toMySqlDate(new Date()).split(" ")[0];
  return `${symbol}-${today}`;
}

export function getTradeStatsForSymbolFromCache(symbol: string) {
  return tradesCache.get(getTradeCacheKey(symbol));
}

export function setTradeStatsForSymbolFromCache(
  symbol: string,
  newValue: ITradeStatsResponse
) {
  tradesCache.set(getTradeCacheKey(symbol), newValue);
}

export function getAllTimeProfitFromCache(): string | undefined {
  const res = profitCache.get("profit_allsymbols");

  return typeof res === "string" ? res : undefined;
}

export function setAllTimeProfitCache(newValue: string): void {
  profitCache.set("profit_allsymbols", newValue);
}

export function updateCacheOnNewTrade(symbol: string) {
  profitCache.del("profit_allsymbols");
  profitCache.del(symbol);
  profitCache.del(getTradeCacheKey(symbol));
}
