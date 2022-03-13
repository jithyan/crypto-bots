import {
  partitionPriceList,
  PriceData,
  writeApiPricesForSymbol,
} from "./parse/api";
import { getAllPriceDataFromLogs } from "./parse/pricebot";
import { startSimulations } from "./simulation";

const parsePriceBot = true;
const getApiPricesForSymbol = false;
const simulate = false;

if (parsePriceBot) {
  getAllPriceDataFromLogs();
} else if (getApiPricesForSymbol) {
  writeApiPricesForSymbol("lunabusd");
} else if (simulate) {
  console.time("simul");
  startSimulations(2, "luna").then((res) => {
    console.timeLog("simul", res[0]);
    console.timeEnd("simul");
  });
}
