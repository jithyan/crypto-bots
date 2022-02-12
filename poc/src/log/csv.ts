// @ts-ignore
import CSV from "winston-csv-format";
import { createLogger, transports } from "winston";
import Big from "big.js";
import type { TSupportedCoins } from "../wallet";

const csvHeaders = {
  timestamp: "Timestamp",
  action: "Action",
  price: "Price",
  amount: "Amount",
  value: "Value",
  from: "From",
  to: "To",
};

const csvLogger = createLogger({
  level: "info",
  format: CSV(Object.keys(csvHeaders), {
    delimiter: ",",
  }),
  transports: [new transports.Console()],
});

type TLogTradeData = Record<
  Exclude<
    keyof typeof csvHeaders,
    "timestamp" | "from" | "to" | "action" | "value"
  >,
  string
> &
  Record<
    Exclude<
      keyof typeof csvHeaders,
      "timestamp" | "action" | "value" | "price" | "amount"
    >,
    TSupportedCoins
  > & { action: "BUY" | "SELL" };

export const logTrade = (data: TLogTradeData) => {
  const timestamp = new Date().toISOString();
  const value = new Big(data.amount).mul(data.price).toFixed(3);

  const logData: Record<keyof typeof csvHeaders, string> = {
    ...data,
    timestamp,
    value,
  };

  csvLogger.log("info", logData);
};

csvLogger.log("info", csvHeaders);
