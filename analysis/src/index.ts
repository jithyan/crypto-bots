import { writeApiPricesForSymbol } from "./parse/api";
import { startSimulations } from "./simulation";

// writeApiPricesForSymbol("lunabusd");

console.time("simul");
startSimulations(2, "luna").then((res) => {
  console.timeLog("simul", res[0]);
  console.timeEnd("simul");
});
