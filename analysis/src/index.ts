import { writeApiPricesForSymbol } from "./parse/api";
import { collateResults, getAllPriceDataFromLogs } from "./parse/pricebot";
import { startSimulations } from "./simulation";
import { getFilesInDir, runAsyncSequentially } from "./utils";

type Actions = "Analyze price bot" | "Extract api data" | "Run simulation";
const action: { do: Actions } = { do: "Run simulation" };

const execute = (arg: Actions) => {
  action.do = arg;
  console.log(action.do + "...");
};

execute("Analyze price bot");

const uselessCoins = [
  "aion",
  "bcha",
  "bch",
  "bchabc",
  "bear",
  "bkrw",
  "blz",
  "bnbbear",
  "bnbbull",
  "btc",
  "bts",
  "btt",
  "bull",
  "bzrx",
  "cover",
  "dai",
  "doge",
  "eos",
  "eosbear",
  "eosbull",
  "erd",
  "ethbear",
  "ethbull",
  "eur",
  "ftt",
  "gbp",
  "ghst",
  "gno",
  "iris",
  "kmd",
  "lend",
  "ltc",
  "nano",
  "nu",
  "rep",
  "rgt",
  "rlc",
  "santos",
  "strat",
  "swrv",
  "sxp",
  "tru",
];

const alreadyAnalyzed: string[] = [];

const ignoreSymbols: string[] = [
  ...alreadyAnalyzed,
  ...uselessCoins,
  "aud",
  "zec",
  "xmr",
  "dash",
  "rose",
  "scrt",
  "dcr",
  "zen",
  "keep",
  "mob",
  "arrr",
  "snt",
  "beam",
  "sero",
];

if (action.do === "Analyze price bot") {
  getAllPriceDataFromLogs().then(() => {
    const volatileSymbols = getFilesInDir("./data/pricebot/symbols")
      .filter((fn) => fn.endsWith(".json"))
      .filter(
        (fn) =>
          !ignoreSymbols.some((pref) => fn.split("/").pop()?.startsWith(pref))
      )
      .map((fn) => fn.split("/").pop()?.replace("busd.json", "").trim());
    const numProcesses = 24;
    const simulArgs = volatileSymbols.map((vol) => [numProcesses, vol]);
    console.log(simulArgs);
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
    ["xrp"].map((vol) => [numProcesses, vol]),
    startSimulations
  ).then(() => {
    console.timeEnd("simul");
    collateResults();
  });
}
