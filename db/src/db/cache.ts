import NodeCache from "node-cache";

interface INodeCached<K, V> {
  get: (key: K) => V | undefined;
  set: (key: K, value: V, ttl?: number) => boolean;
  del: (key: K) => number;
}

export const dbCache = new NodeCache({
  stdTTL: 60 * 60 * 24,
  useClones: true,
  checkperiod: 60 * 60 * 12,
  deleteOnExpire: true,
  maxKeys: 325,
}) as INodeCached<"profit_allsymbols" | string, string>;

export function getAllTimeProfitFromCache(): string | undefined {
  const res = dbCache.get("profit_allsymbols");

  return typeof res === "string" ? res : undefined;
}

export function setAllTimeProfitCache(newValue: string): void {
  dbCache.set("profit_allsymbols", newValue);
}

export function updateCacheOnNewTrade(symbol: string) {
  dbCache.del("profit_allsymbols");
  dbCache.del(symbol);
}
