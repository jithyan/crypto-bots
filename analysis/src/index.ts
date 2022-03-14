import { writeApiPricesForSymbol } from "./parse/api";
import { getAllPriceDataFromLogs } from "./parse/pricebot";
import { startSimulations } from "./simulation";
import { getFilesInDir, runAsyncSequentially } from "./utils";

const parsePriceBot = true;
const getApiPricesForSymbol = false;
const simulate = false;

if (parsePriceBot) {
  getAllPriceDataFromLogs().then(() => {
    const volatileSymbols = getFilesInDir("./data/pricebot/symbols")
      .filter((fn) => fn.endsWith(".json"))
      .map((fn) => fn.split("/").pop()?.replace("busd.json", "").trim());

    const numProcesses = 4;
    const simulArgs = volatileSymbols.map((vol) => [numProcesses, vol]);

    console.time("simul");
    runAsyncSequentially(simulArgs, startSimulations).then(() => {
      console.timeEnd("simul");
    });
  });
} else if (getApiPricesForSymbol) {
  ["adabusd", "avaxbusd", "ethbusd", "xrpbusd"].forEach((symbol) => {
    writeApiPricesForSymbol(symbol);
  });
} else if (simulate) {
  const numProcesses = 4;

  console.time("simul");

  runAsyncSequentially(
    ["eth"].map((vol) => [numProcesses, vol]),
    startSimulations
  ).then(() => {
    console.timeEnd("simul");
  });
}
