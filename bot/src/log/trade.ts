//@ts-ignore
import CSV from "winston-csv-format";
import { createLogger } from "winston";
import Big from "big.js";
import DailyRotateFile from "winston-daily-rotate-file";
import type { IWallet, TSupportedCoins } from "../exchange/index.js";

const dailyRotationTransport: DailyRotateFile = new DailyRotateFile({
  filename: "%DATE%-trades.csv",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "40m",
  maxFiles: "365d",
});

const csvHeaders = {
  timestamp: "Timestamp",
  action: "Action",
  price: "Price",
  amount: "Amount",
  value: "Value",
  from: "From",
  to: "To",
  profit: "Profit",
  audValue: "AUD Value",
  audBusd: "AUD to BUSD",
};

const csvLogger = createLogger({
  level: "info",
  format: CSV.default(Object.keys(csvHeaders), {
    delimiter: ",",
  }),
  transports: [dailyRotationTransport],
});

type THeadersWhichAreTypeString = Exclude<
  keyof typeof csvHeaders | "lastPurchasePrice",
  | "timestamp"
  | "from"
  | "to"
  | "action"
  | "value"
  | "profit"
  | "audValue"
  | "audBusd"
>;
type THeadersWhichAreTypeCoin = Exclude<
  keyof typeof csvHeaders,
  | "timestamp"
  | "action"
  | "value"
  | "price"
  | "amount"
  | "profit"
  | "audValue"
  | "audBusd"
>;

type TLogTradeData = Record<THeadersWhichAreTypeString, string> &
  Record<THeadersWhichAreTypeCoin, TSupportedCoins> & {
    action: "BUY" | "SELL";
  };

export const logTrade = async (
  { lastPurchasePrice, ...data }: TLogTradeData,
  client: IWallet
): Promise<string> => {
  const timestamp = new Date()
    .toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
    })
    .split(", ")[1];
  const value = new Big(data.amount).mul(data.price).toFixed(3);
  const profit =
    data.action === "SELL"
      ? new Big(value)
          .minus(new Big(lastPurchasePrice).mul(data.amount))
          .toFixed(3)
      : "N/A";
  const audBusd = await client.getAudUsdValue();
  const audValue = new Big(value).div(audBusd).toFixed(3);

  const logData: Record<keyof typeof csvHeaders, string> = {
    ...data,
    audBusd,
    audValue,
    timestamp,
    profit,
    value,
  };

  csvLogger.log("info", logData);

  return profit;
};
