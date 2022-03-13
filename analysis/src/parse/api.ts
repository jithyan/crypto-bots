import fs from "fs";
import { getFilesInDir } from "../utils";
import { areTimestampsEqualToTheMinute } from "./pricebot";

interface LatestPriceLog {
  timestamp: string;
  message: "Latest price";
  data: {
    price: string;
    symbol: string;
  };
}
type Log = LatestPriceLog | Record<string, any>;

export type PriceData = Record<"timestamp" | "price" | "symbol", string>;

export type Intervals = "m3" | "m6" | "m9" | "m15" | "m30" | "m60";

export type IntervalPriceData = Record<Intervals, PriceData[]>;

export function getLatestPriceApiLog(files: string[]): PriceData[] {
  const prices: PriceData[] = files
    .filter((fn) => fn.endsWith(".log"))
    .map((fn) => {
      const file = fs.readFileSync(fn, "utf8");
      const logs: Log[] = file
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => JSON.parse(line));

      const latestPrices = logs
        .filter((l) => l.message === "Latest price")
        .map((l) => ({
          price: l.data.price,
          symbol: l.data.symbol,
          timestamp: l.timestamp,
        }));
      latestPrices.sort((a, b) =>
        a.timestamp === b.timestamp ? 0 : a.timestamp < b.timestamp ? -1 : 1
      );
      return (
        latestPrices
          .filter(
            (p, i) =>
              !areTimestampsEqualToTheMinute(
                p.timestamp,
                latestPrices[i - 1]?.timestamp ?? new Date().toISOString()
              )
          )
          // Found some missing data for the first few minutes
          .filter((a, i) => i > 14)
      );
    })
    .flatMap((x) => x);

  return prices;
}

export function partitionPriceList(priceList: PriceData[]): IntervalPriceData {
  const m3 = [...priceList];
  const m6 = priceList.filter((p, i) => i % 2 === 0);
  const m9 = priceList.filter((p, i) => i % 3 === 0);
  const m15 = priceList.filter((p, i) => i % 5 === 0);
  const m30 = priceList.filter((p, i) => i % 10 === 0);
  const m60 = priceList.filter((p, i) => i % 20 === 0);

  return {
    m3,
    m6,
    m9,
    m15,
    m30,
    m60,
  };
}

/**
 *
 * @param symbol eg "adabusd"
 */
export function writeApiPricesForSymbol(symbol: string) {
  const dir = `./data/${symbol}`;
  const files = getFilesInDir(`./data/${symbol}`);
  const prices = getLatestPriceApiLog(files);
  const partitions = partitionPriceList(prices);
  Object.keys(partitions).forEach((partition) => {
    fs.writeFileSync(
      `${dir}/${partition}_${symbol}.json`,
      JSON.stringify(
        partitions[partition as keyof typeof partitions],
        undefined,
        2
      )
    );
  });
}
