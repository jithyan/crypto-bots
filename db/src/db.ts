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
      user: process.env.DB_ADMIN,
      password: process.env.DB_PWD,
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

export async function getAllDailyTrades() {
  try {
    const conn = await getConnection();
    const res = await conn.query(`SELECT * FROM trades`);
    return res;
  } catch (err: any) {
    logger.error("Failed to get trades", err);
    throw err;
  }
}
