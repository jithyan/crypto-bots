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
      connectionLimit: 6,
      database: "trades_db",
      idleTimeout: 120,
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
    conn.end();
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

export async function allTimeProfitForSymbol(
  symbol: string
): Promise<ITotalProfitResult> {
  try {
    const conn = await getConnection();
    const res = await conn.query(
      `SELECT SUM(profit) AS total_profit FROM trades GROUP BY symbol HAVING symbol=?`,
      [symbol?.toUpperCase() ?? ""]
    );
    conn.end();

    return parseProfitResult(res);
  } catch (err: any) {
    logger.error("Failed to get trades", err);
    throw err;
  }
}
