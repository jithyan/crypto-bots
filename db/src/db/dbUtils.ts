import crypto from "crypto";
import { format } from "date-fns";
import { ITradeDbRow, TradeRowValues } from "../models.js";

export function generateId(trade: Omit<ITradeDbRow, "trade_id">): string {
  const hasher = crypto.createHash("sha512");
  hasher.update(trade.symbol, "utf8");
  hasher.update(trade.at_timestamp, "utf8");
  return hasher.digest("hex");
}

export function mapToInsertValues(row: ITradeDbRow): TradeRowValues {
  return [
    row.trade_id,
    row.symbol,
    row.at_timestamp,
    row.action,
    row.price,
    row.amount,
    row.busd_value,
    row.from_coin,
    row.to_coin,
    row.profit,
    row.aud_value,
    row.aud_busd,
    row.commission,
    row.is_test,
  ];
}

export function toMySqlDate(date: Date) {
  return format(date, "yyyy-MM-dd HH:mm:ss");
}
