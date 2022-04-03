import fs from "fs";
import { spawn } from "child_process";
import { Intervals } from "../parse/api";

export async function startSimulations(
  numProcesses: number,
  volatileAsset: string,
  stableAsset = "busd"
) {
  const allPossibleArgs = generateSimulationCombinations(
    volatileAsset,
    stableAsset
  );
  const partitionedArgs = partition(allPossibleArgs, numProcesses);

  console.log(
    "partitoned",
    partitionedArgs.reduce((acc, curr, i) => ({ ...acc, [i]: curr.length }), {})
  );

  const allResults = await Promise.all(
    partitionedArgs.map((arg, i) => runSimulationSlice(arg, i))
  );
  const finalResults = allResults.flatMap((x) => x);
  finalResults.sort((a, b) => Number(b.profit) - Number(a.profit));

  fs.writeFileSync(
    `./data/${volatileAsset}_results.json`,
    JSON.stringify(finalResults, undefined, 2),
    "utf8"
  );

  return finalResults;
}

function partition<T = any>(arr: T[], numPartitions: number): T[][] {
  return arr.reduce((acc, curr, index) => {
    const i = index % numPartitions;
    if (Array.isArray(acc[i])) {
      acc[i].push(curr);
    } else {
      acc[i] = [curr];
    }
    return acc;
  }, [] as T[][]);
}

type SimulationParams = Record<
  | "volatileAsset"
  | "stableAsset"
  | "interval"
  | "stopLoss"
  | "increase"
  | "decrease"
  | "postSellSleep"
  | "pumpInc",
  string
>;

const sleepStrategyToNumCalls: Record<Intervals, number> = {
  m3: 20,
  m6: 10,
  m9: 7,
  m15: 4,
  m30: 2,
  m60: 0,
};

async function runSingleSimulationProcessFor(
  {
    volatileAsset,
    stableAsset = "BUSD",
    interval,
    stopLoss = "0.03",
    increase = "1.00175",
    decrease = "0.99975",
    postSellSleep = "4",
    pumpInc = "",
  }: SimulationParams,
  processNumber: number,
  results: any[]
) {
  const cwd = `${process.cwd()}/dist/${processNumber}_wd`;

  if (!fs.existsSync(cwd)) {
    fs.mkdirSync(cwd);
  }
  return new Promise<void>((resolve, reject) => {
    const childProcess = spawn(process.argv[0], ["../simulation/engine.js"], {
      stdio: ["inherit", "inherit", "inherit", "ipc"],
      cwd,
      env: {
        VOL: volatileAsset,
        STAB: stableAsset,
        INTERV: interval,
        INC: increase,
        DEC: decrease,
        STOPL: stopLoss,
        PUMP_INC: pumpInc,
        POST_SELL_SLEEP: postSellSleep,
        NUM_PRICE_CALLS:
          sleepStrategyToNumCalls[interval as Intervals].toString(),
      },
    });

    childProcess.on("message", (message: string) => {
      if (typeof message === "string") {
        const result = JSON.parse(message);
        if (result.error) {
          console.error("Failed");
          reject();
        } else {
          const profit = Number(result.profit);
          if (isNaN(profit)) {
            console.error("Something went wrong, profit is NaN", result);
          } else if (profit > 0) {
            results.push(result);
          }
          resolve(result);
        }
      }
    });
  });
}

function generateSimulationCombinations(
  volatileAsset: string,
  stableAsset = "BUSD"
): SimulationParams[] {
  const stopLosses = [
    "0.05",
    "0.06",
    "0.07",
    "0.08",
    // "0.09",
    "0.10",
    // "0.11",
    "0.12",
    // "0.13",
    // "0.14",
    "0.15",
  ];

  const decreases = ["0.985", "0.995", "0.999"];
  const increases = ["1.0015", "1.00175", "1.0035", "1.005"];
  const intervalsSubset: Intervals[] = ["m3", "m6", "m9", "m15"];
  const postSellSleepDuration: string[] = ["4"];
  const pumpSignals: string[] = ["1.02"];

  const combinations = stopLosses
    .map((stopLoss) =>
      intervalsSubset.map((interval) => ({ interval, stopLoss }))
    )
    .flatMap((x) => x)
    .map((a) => decreases.map((decrease) => ({ decrease, ...a })))
    .flatMap((x) => x)
    .map((a) => increases.map((increase) => ({ increase, ...a })))
    .flatMap((x) => x)
    .map((a) =>
      postSellSleepDuration.map((postSellSleep) => ({ postSellSleep, ...a }))
    )
    .flatMap((x) => x)
    .map((a) => pumpSignals.map((pumpInc) => ({ pumpInc, ...a })))
    .flatMap((x) => x);

  const params: SimulationParams[] = combinations.map(
    ({ interval, stopLoss, increase, decrease, pumpInc, postSellSleep }) => ({
      volatileAsset,
      stableAsset,
      interval,
      stopLoss,
      increase,
      decrease,
      pumpInc,
      postSellSleep,
    })
  );

  console.log("total params", params.length);

  return params;
}

function runSimulationSlice(
  simulationArgs: SimulationParams[],
  processNumber: number
): Promise<any[]> {
  const results: any[] = [];

  let resolve: (arg: any[]) => any;
  let reject: (arg: any) => any;

  let counter = 0;

  const finalPromise = new Promise<any[]>((res, rej) => {
    resolve = res;
  });

  function nextPromise(): Promise<void> {
    return runSingleSimulationProcessFor(
      simulationArgs[counter++],
      processNumber,
      results
    )
      .then((res) => {
        console.log(
          `Completed run #${counter}, ${(
            (counter / simulationArgs.length) *
            100
          ).toFixed(2)}% (${processNumber})`
        );
      })
      .then(
        counter < simulationArgs.length ? nextPromise : () => resolve(results)
      );
  }

  nextPromise();

  return finalPromise;
}
