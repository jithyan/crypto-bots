import { getCsvDataFromFiles, calculateProfit } from "./parse/csv";
import { getFilesInDir } from "./utils";

export function getTotalProfit(volatileCoins: string[]): number {
  const symbols = volatileCoins.map((c) => `${c.trim().toLowerCase()}busd`);
  const profits = symbols
    .map((symbol) => getFilesInDir(`./data/${symbol}`))
    .map(getCsvDataFromFiles)
    .map(calculateProfit);

  return profits.reduce((acc, curr) => acc + curr, 0);
}
