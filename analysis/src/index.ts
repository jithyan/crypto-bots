import fs from "fs";
import { getLatestPriceApiLog, partitionPriceList } from "./api";
import { getCsvDataFromFiles, calculateProfit } from "./csv";

function getFileListInDir(dir: string): string[] {
  const filenames = fs.readdirSync(dir);
  return filenames.map((fn) => `${dir}/${fn}`);
}

function getTotalProfit(): number {
  const symbols = ["adabusd", "xrpbusd", "ethbusd", "avaxbusd"];
  const profits = symbols
    .map((symbol) => getFileListInDir(`./data/${symbol}`))
    .map(getCsvDataFromFiles)
    .map(calculateProfit);

  return profits.reduce((acc, curr) => acc + curr, 0);
}

function getApiPricesForSymbol(symbol: string) {
  const dir = `./data/${symbol}`;
  const files = getFileListInDir(`./data/${symbol}`);
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

// getApiPricesForSymbol("ethbusd");
// getApiPricesForSymbol("avaxbusd");
// getApiPricesForSymbol("xrpbusd");
console.log("finished");
