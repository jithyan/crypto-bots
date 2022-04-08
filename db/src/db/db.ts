import mariadb, { Pool, PoolConnection } from "mariadb";
import { generateId, mapToInsertValues } from "./dbUtils.js";
import { logger } from "../log.js";
import { ITradeDbRow } from "../models.js";
import {
  dbCache,
  getAllTimeProfitFromCache,
  setAllTimeProfitCache,
  updateCacheOnNewTrade,
} from "./cache.js";

export const db: Record<"pool", Pool | null> = {
  pool: null,
};
function getConnection(): Promise<PoolConnection> {
  if (!db.pool) {
    db.pool = mariadb.createPool({
      user: process.env.DB_USER?.trim(),
      password: process.env.DB_PWD?.trim(),
      connectionLimit: 10,
      database: "trades_db",
      idleTimeout: 180,
    });
  }

  return db.pool.getConnection();
}

export async function addNewTradeToDb(
  trade: Omit<ITradeDbRow, "trade_id">
): Promise<void> {
  try {
    const data = { ...trade, trade_id: generateId(trade) } as ITradeDbRow;
    const values = mapToInsertValues(data);
    const conn = await getConnection();
    await conn.query(
      `INSERT INTO trades VALUES (${values.map(() => "?").join(", ")})`,
      values
    );
    conn.end();

    logger.info("Successfully added trade row", data);
    updateCacheOnNewTrade(data.symbol);
  } catch (err: any) {
    logger.error("Failed to add trade row", err);
    throw err;
  }
}

export async function allTimeProfitForSymbol(
  symbol: string
): Promise<ITotalProfitResult> {
  const cachedResult = dbCache.get(symbol);
  if (typeof cachedResult === "string") {
    return { total_profit: cachedResult };
  }

  try {
    const conn = await getConnection();
    const res = await conn.query(
      `SELECT SUM(profit) AS total_profit FROM trades GROUP BY symbol HAVING symbol=?`,
      [symbol?.toUpperCase() ?? ""]
    );
    conn.end();

    const profit = parseProfitResult(res);
    dbCache.set(symbol, profit.total_profit);

    return profit;
  } catch (err: any) {
    logger.error("Failed to get trades", err);
    throw err;
  }
}

export async function allTimeProfit(): Promise<ITotalProfitResult> {
  const cachedResult = getAllTimeProfitFromCache();
  if (cachedResult) {
    return { total_profit: cachedResult };
  }

  try {
    const conn = await getConnection();
    const res = await conn.query(
      "SELECT SUM(profit) AS total_profit FROM trades"
    );
    conn.end();

    const result = parseProfitResult(res);
    setAllTimeProfitCache(result.total_profit);
    return result;
  } catch (err: any) {
    logger.error("Failed to get trades", err);
    throw err;
  }
}

export interface ITotalProfitResult {
  total_profit: string;
}

export function parseProfitResult(
  result: [
    {
      total_profit: string | null;
    }
  ]
): ITotalProfitResult {
  if (result?.[0]?.total_profit) {
    return result[0] as ITotalProfitResult;
  } else {
    return { total_profit: "0" };
  }
}
