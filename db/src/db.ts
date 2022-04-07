import mariadb, { Pool, PoolConnection } from "mariadb";
import { mapToInsertValues } from "./dbUtils.js";
import { logger } from "./log.js";
import { ITradeDbRow } from "./models.js";

export const db: Record<"pool", Pool | null> = {
  pool: null,
};
function getConnection(): Promise<PoolConnection> {
  if (!db.pool) {
    db.pool = mariadb.createPool({
      user: process.env.DB_USER?.trim(),
      password: process.env.DB_PWD?.trim(),
      connectionLimit: 5,
      database: "trades_db",
    });
  }

  return db.pool.getConnection();
}

export async function addNewTradeToDb(data: ITradeDbRow): Promise<void> {
  try {
    const values = mapToInsertValues(data);
    const conn = await getConnection();
    await conn.query(
      `INSERT INTO trades VALUES (${values.map(() => "?").join(", ")})`,
      values
    );
    logger.info("Successfully added trade row", data);
  } catch (err: any) {
    logger.error("Failed to add trade row", err);
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
  if (result[0].total_profit) {
    return result[0] as ITotalProfitResult;
  } else {
    return { total_profit: "0" };
  }
}

export async function getYearToDateProfit(): Promise<ITotalProfitResult> {
  try {
    const conn = await getConnection();
    const res = await conn.query(
      `SELECT SUM(profit) AS total_profit FROM daily_stats WHERE ytd=2022`
    );

    return parseProfitResult(res);
  } catch (err: any) {
    logger.error("Failed to get trades", err);
    throw err;
  }
}

export async function getYearToDateProfitForSymbol(
  symbol: string
): Promise<ITotalProfitResult> {
  try {
    const conn = await getConnection();
    const res = await conn.query(
      `SELECT SUM(profit) AS total_profit FROM daily_stats WHERE ytd=2022 AND symbol=?`,
      [symbol?.toUpperCase() ?? ""]
    );

    return parseProfitResult(res);
  } catch (err: any) {
    logger.error("Failed to get trades", err);
    throw err;
  }
}
