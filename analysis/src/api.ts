import fs from "fs";

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
      latestPrices.sort((a, b) => (a === b ? 0 : a < b ? -1 : 1));
      return latestPrices;
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
