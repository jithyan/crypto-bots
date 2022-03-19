import { writeApiPricesForSymbol } from "./parse/api";
import { getAllPriceDataFromLogs } from "./parse/pricebot";
import { startSimulations } from "./simulation";
import { getFilesInDir, runAsyncSequentially } from "./utils";

type Actions = "Analyze price bot" | "Extract api data" | "Run simulation";
const action: { do: Actions } = { do: "Run simulation" };

const execute = (
  arg: "Analyze price bot" | "Extract api data" | "Run simulation"
) => {
  action.do = arg;
  console.log(action.do + "...");
};

execute("Run simulation");

if (action.do === "Analyze price bot") {
  getAllPriceDataFromLogs().then(() => {
    const volatileSymbols = getFilesInDir("./data/pricebot/symbols")
      .filter((fn) => fn.endsWith(".json"))
      .map((fn) => fn.split("/").pop()?.replace("busd.json", "").trim());

    const numProcesses = 8;
    const simulArgs = volatileSymbols.map((vol) => [numProcesses, vol]);

    console.time("simul");
    runAsyncSequentially(simulArgs, startSimulations).then(() => {
      console.timeEnd("simul");
    });
  });
} else if (action.do === "Extract api data") {
  ["lunabusd"].forEach((symbol) => {
    writeApiPricesForSymbol(symbol);
  });
} else if (action.do === "Run simulation") {
  const numProcesses = 8;

  console.time("simul");

  runAsyncSequentially(
    ["luna"].map((vol) => [numProcesses, vol]),
    startSimulations
  ).then(() => {
    console.timeEnd("simul");
  });
}
