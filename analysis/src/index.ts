import fs from "fs";
import { getLatestPriceApiLog, Intervals, partitionPriceList } from "./api";
import { getCsvDataFromFiles, calculateProfit, getTradeStats } from "./csv";
import { intervals, makeMockServer } from "./mockApi";
//@ts-ignore
const runCryptoBot = require("./bot.js").default;

let results: any[] = [];

async function runSimulationFor(
  { v, s = "busd" }: { v: string; s: string },
  interval: Intervals,
  stopLoss = "0.03",
  increase = "1.00175",
  decrease = "0.99975"
) {
  const mockServer = makeMockServer(
    { volatileAsset: v, stableAsset: s },
    interval
  );
  mockServer.listen();

  const profit = await runCryptoBot({
    volatileAsset: v?.toUpperCase().trim(),
    stableAsset: s?.toUpperCase().trim(),
    enableResume: false,
    sleepStrategy: "no-sleep",
    decisionConfig: {
      MIN_PERCENT_INCREASE_FOR_SELL: "1.015",
      PRICE_HAS_INCREASED_THRESHOLD: increase,
      PRICE_HAS_DECREASED_THRESHOLD: decrease,
      STOP_LOSS_THRESHOLD: stopLoss,
    },
    enableControlServer: false,
  }).catch((err: any) => {
    mockServer.resetHandlers();
    mockServer.close();
    console.log(err?.response?.data);
    const csvTradeFile = `${getDate()}-trades.csv`;
    const csv = getCsvDataFromFiles([csvTradeFile]);
    const profit = calculateProfit(csv);
    const stats = getTradeStats(csv);
    console.log(`Result`, {
      increase,
      decrease,
      profit,
      stopLoss,
      interval,
      stats,
    });
    results.push({
      increase,
      decrease,
      profit,
      stopLoss,
      interval,
      stats,
      timestamp: new Date().toISOString(),
    });
    return profit;
  });

  return profit;
}

async function meow(
  { v, s }: { v: string; s: string },
  start = 0,
  stop = 3000
) {
  results = [];
  const stopLosses = [
    "0.05",
    "0.06",
    "0.07",
    "0.08",
    "0.09",
    "0.10",
    "0.11",
    "0.12",
    "0.13",
    "0.14",
    "0.15",
  ];

  const decreases = ["0.985", "0.995", "0.999"];
  const increases = ["1.0015", "1.00175", "1.0035", "1.005"];
  const intervalsSubset: Intervals[] = ["m6", "m9", "m15", "m60"];

  const combinations = stopLosses
    .map((stopLoss) =>
      intervalsSubset.map((interval) => ({ interval, stopLoss }))
    )
    .flatMap((x) => x)
    .map((a) => decreases.map((decrease) => ({ decrease, ...a })))
    .flatMap((x) => x)
    .map((a) => increases.map((increase) => ({ increase, ...a })))
    .flatMap((x) => x);

  const subset = combinations.filter((x, i) => i >= start && i < stop);

  console.log("combinations", combinations.length);

  const p = subset.map(
    ({ interval, stopLoss, increase, decrease }, index) =>
      () =>
        new Promise<void>(async (resolve, reject) => {
          await runSimulationFor(
            { v, s },
            interval,
            stopLoss,
            increase,
            decrease
          );
          fs.writeFileSync(`${getDate()}-trades.csv`, "", "utf8");
          try {
            fs.unlinkSync(`${getDate()}-general.log`);
            fs.unlinkSync(`${getDate()}-pricestats.log`);
            fs.unlinkSync(`${getDate()}-state.log`);
            fs.unlinkSync(`${getDate()}-api.log`);
          } catch (err) {}
          console.log("Completed run #" + index);
          resolve();
        })
  );
  p.push(async () => {
    results.sort((a, b) => b.profit - a.profit);
    console.log("top result", results[0]);
    fs.writeFileSync(
      `${v.concat(s).toUpperCase()}_FINAL_RESULTS_${start}-${stop}.json`,
      JSON.stringify(results, null, 2),
      "utf8"
    );
    console.log("FINISHED", { start, stop });
  });
  p.reduce(
    (acc: any, curr, i) =>
      acc.then(curr).then(() => {
        //@ts-ignore
        global.gc();
        return Promise.resolve();
      }),
    Promise.resolve()
  );
}

meow({ v: "eth", s: "busd" }, 650, 725);
// runSimulationFor({ v: "ada", s: "busd" }, "m6", "0.15", "1.005", "0.9995");
function getDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm: number | string = today.getMonth() + 1; // Months start at 0!
  let dd: number | string = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  return yyyy + "-" + mm + "-" + dd;
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

// getApiPricesForSymbol("adabusd");
// getApiPricesForSymbol("ethbusd");
// getApiPricesForSymbol("avaxbusd");
// getApiPricesForSymbol("xrpbusd");
