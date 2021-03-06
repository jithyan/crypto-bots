import mariadb, { Pool, PoolConnection } from "mariadb";
import { generateId, mapToInsertValues } from "./dbUtils.js";
import { logger } from "../log.js";
import {
  IAggregateTradeStats,
  ITradeDbRow,
  ITradeStatsResponse,
  ITradeResponse,
} from "../models.js";
import {
  profitCache,
  getAllTimeProfitFromCache,
  setAllTimeProfitCache,
  updateCacheOnNewTrade,
  getTradeStatsForSymbolFromCache,
  setTradeStatsForSymbolFromCache,
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

export async function getPerformanceReport() {
  try {
    const query = `
SELECT 
  A.symbol,
  C.total_profit, 
  ((B.num_profitable/A.num_sold) * 100.0) AS success_rate, 
  A.num_sold 
FROM 
  (SELECT 
    symbol, 
    COUNT(action) as num_sold 
  FROM trades 
  WHERE action="SELL" 
  GROUP BY symbol) AS A 
  CROSS JOIN (
    SELECT 
      symbol, 
      COUNT(action) as num_profitable 
    FROM trades 
    WHERE action="SELL" AND profit > 0 
    GROUP BY symbol) AS B 
  ON B.symbol = A.symbol
  CROSS JOIN (
    SELECT 
      symbol, 
      SUM(profit) AS total_profit 
    FROM trades 
    WHERE action = "SELL" 
    GROUP BY symbol HAVING total_profit < 0) AS C 
  ON A.symbol=C.symbol
ORDER BY C.total_profit, success_rate, A.num_sold DESC;
`;
    const conn = await getConnection();
    const result = await conn.execute(query);
    conn.end();
    return parsePerfReport(result);
  } catch (err) {
    logger.error("Failed generating perf report from DB", err);
  }
}

function parsePerfReport(res: any): Record<string, string>[] {
  if (!res || !Array.isArray(res)) {
    return [];
  }

  return res.map((d: any) => ({
    symbol: d.symbol ?? "",
    totalProfit: d.total_profit?.toString() ?? "",
    successRate: d.success_rate?.toString() ?? "",
    numSold: d.num_sold?.toString() ?? "",
  }));
}

export async function getTradeStatsForSymbol(
  inputSymbol: string,
  includeTestNet: boolean = true
): Promise<any> {
  const symbol = inputSymbol?.toUpperCase().trim() ?? "";

  const cachedRes = getTradeStatsForSymbolFromCache(symbol);
  if (cachedRes) {
    return cachedRes;
  }

  try {
    const testNetFilter = !includeTestNet ? " AND is_test=0" : "";
    const conn = await getConnection();
    const aggPromise = conn.query(
      `SELECT A.symbol, A.num_sold, B.num_profitable FROM (SELECT symbol, COUNT(action) as num_sold FROM trades WHERE symbol = ? AND action="SELL"${testNetFilter}) AS A CROSS JOIN (SELECT symbol, COUNT(action) as num_profitable FROM trades WHERE symbol = ? AND action="SELL" AND profit > 0${testNetFilter}) AS B;`,
      [symbol, symbol]
    );
    const tradesPromise = conn.query(
      `SELECT at_timestamp, action, amount, price, busd_value, profit FROM trades WHERE symbol = ? AND DATE(at_timestamp) = CURRENT_DATE()${testNetFilter} ORDER BY at_timestamp DESC;`,
      [symbol]
    );
    const [aggRes, tradesRes] = await Promise.all([aggPromise, tradesPromise]);
    conn.end();

    const aggStats = parseAggTradeStats(aggRes);
    const trades = parseTodaysTrades(tradesRes);

    const result: ITradeStatsResponse = {
      ...aggStats,
      trades,
    };

    setTradeStatsForSymbolFromCache(symbol, result);

    return result;
  } catch (err) {
    logger.error("Failed getting aggregate trade stats for symbol", err);
    throw err;
  }
}

function parseAggTradeStats(res: any): IAggregateTradeStats {
  const data = res?.[0];
  if (!data) {
    return {
      numSold: "0",
      numProfitableTrades: "0",
    };
  }

  return {
    numSold: data.num_sold?.toString() ?? "0",
    numProfitableTrades: data.num_profitable?.toString() ?? "0",
  };
}

function parseTodaysTrades(res: any): ITradeResponse {
  if (!res || !Array.isArray(res)) {
    return [];
  }

  return res.map((d: any) => ({
    timestamp: d.at_timestamp ?? "",
    action: d.action ?? "",
    price: d.price?.toString() ?? "",
    value: d.busd_value?.toString() ?? "",
    profit: d.profit?.toString() ?? "",
    amount: d.amount?.toString() ?? "",
  }));
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
  symbol: string,
  includeTestNet = true
): Promise<ITotalProfitResult> {
  const cachedResult = profitCache.get(symbol);
  if (typeof cachedResult === "string") {
    return { total_profit: cachedResult };
  }

  try {
    const conn = await getConnection();
    const res = await conn.query(
      `SELECT SUM(profit) AS total_profit FROM trades ${
        !includeTestNet ? "AND is_test=0" : ""
      }GROUP BY symbol HAVING symbol=?;`,
      [symbol?.toUpperCase() ?? ""]
    );
    conn.end();

    const profit = parseProfitResult(res);
    profitCache.set(symbol, profit.total_profit);

    return profit;
  } catch (err: any) {
    logger.error("Failed to get trades", err);
    throw err;
  }
}

export async function allTimeProfit({
  includeTestNet = true,
}): Promise<ITotalProfitResult> {
  const cachedResult = getAllTimeProfitFromCache();
  if (cachedResult) {
    return { total_profit: cachedResult };
  }

  try {
    const conn = await getConnection();
    const res = await conn.query(
      `SELECT SUM(profit) AS total_profit FROM trades${
        includeTestNet ? " WHERE is_test = 0" : ""
      };`
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
