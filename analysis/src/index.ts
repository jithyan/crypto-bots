import {
  partitionPriceList,
  PriceData,
  writeApiPricesForSymbol,
} from "./parse/api";
import { getAllPriceDataFromLogs } from "./parse/pricebot";
import { startSimulations } from "./simulation";
import { getFilesInDir, runAsyncSequentially } from "./utils";

const parsePriceBot = false;
const getApiPricesForSymbol = false;
const simulate = true;

if (parsePriceBot) {
  getAllPriceDataFromLogs();
  const volatileSymbols = getFilesInDir("./data/pricebot/symbols")
    .filter((fn) => fn.endsWith(".json"))
    .map((fn) => fn.split("/").pop()?.replace("busd.json", "").trim());

  const simulArgs = volatileSymbols.map((vol) => [6, vol]);
  console.time("simul");
  runAsyncSequentially(simulArgs, startSimulations).then(() => {
    console.timeEnd("simul");
  });
} else if (getApiPricesForSymbol) {
  writeApiPricesForSymbol("adabusd");
  writeApiPricesForSymbol("avaxbusd");
  // writeApiPricesForSymbol("lunabusd");
  writeApiPricesForSymbol("ethbusd");
  writeApiPricesForSymbol("xrpbusd");
} else if (simulate) {
  console.time("simul");
  runAsyncSequentially(
    [
      [8, "eth"],
      [8, "xrp"],
    ],
    startSimulations
  ).then(() => {
    console.timeEnd("simul");
  });
}
