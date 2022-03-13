import {
  partitionPriceList,
  PriceData,
  writeApiPricesForSymbol,
} from "./parse/api";
import { getAllPriceDataFromLogs } from "./parse/pricebot";
import { startSimulations } from "./simulation";

const parsePriceBot = false;
const getApiPricesForSymbol = true;
const simulate = false;

if (parsePriceBot) {
  getAllPriceDataFromLogs();
} else if (getApiPricesForSymbol) {
  writeApiPricesForSymbol("adabusd");

  // writeApiPricesForSymbol("avaxbusd");
  // writeApiPricesForSymbol("lunabusd");
  // writeApiPricesForSymbol("ethbusd");
  // writeApiPricesForSymbol("xrpbusd");
} else if (simulate) {
  console.time("simul");

  startSimulations(6, "ada").then((res) => {
    startSimulations(6, "eth").then((res) => {
      startSimulations(6, "avax").then((res) => {
        startSimulations(6, "xrp").then((res) => {
          console.timeEnd("simul");
        });
      });
    });
  });
}
