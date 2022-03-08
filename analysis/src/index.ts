import fs from "fs";
import { getLatestPriceApiLog, partitionPriceList } from "./api";
import { getCsvDataFromFiles, calculateProfit } from "./csv";
import { makeMockServer } from "./mockApi";
//@ts-ignore
const { runCryptoBot } = require("./bot.js");

const mockServer = makeMockServer(
  { volatileAsset: "ada", stableAsset: "busd" },
  "m60"
);
mockServer.listen();

try {
  runCryptoBot({
    volatileAsset: "ADA"?.toUpperCase().trim(),
    stableAsset: "BUSD"?.toUpperCase().trim(),
    enableResume: true,
    sleepStrategy: "no-sleep",
    decisionConfig: {
      MIN_PERCENT_INCREASE_FOR_SELL: "1.015",
      PRICE_HAS_INCREASED_THRESHOLD: "1.00175",
      PRICE_HAS_DECREASED_THRESHOLD: "0.99975",
    },
    enableControlServer: true,
  });
} catch (err) {
  console.log("Finished");
}

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
