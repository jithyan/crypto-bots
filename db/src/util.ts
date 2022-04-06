import crypto from "crypto";
import { ITradeDbRow } from "./models";

export function generateId(trade: ITradeDbRow): string {
  const hasher = crypto.createHash("sha512");
  hasher.update(trade.symbol, "utf8");
  hasher.update(trade.at_timestamp, "utf8");
  return hasher.digest("hex");
}
