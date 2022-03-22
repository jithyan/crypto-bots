import fs from "fs";
import readLine from "readline";
import SonicBoom from "sonic-boom";
import AsyncLock from "async-lock";
import { getFilesInDir } from "../utils";
import { PriceData, partitionPriceList } from "./api";

const writeStreamLock = new AsyncLock();
const writeStream: Record<string, SonicBoom> = {};

export async function getAllPriceDataFromLogs() {
  const logFiles = getFilesInDir("./data/pricebot").filter((fn) =>
    fn.endsWith(".log")
  );
  console.log("Number of log files: " + logFiles.length);
  await Promise.all(logFiles.map(writePriceForSymbolFromLog));
  console.log("Finished processing logs");
  await Promise.all(closeAllSonicBoomFileStreams());
  generateParititonedPriceDataForAllSymbols();
  console.log("Finished partitioning price data");
}

type LogPrice = Record<"symbol" | "price", string>;
type LogLine = {
  timestamp: string;
  prices: LogPrice[];
};

function parseLogLine(line: string): LogLine {
  if (line.trim()) {
    const json = JSON.parse(line);
    if (json.timestamp && Array.isArray(json.prices)) {
      return {
        timestamp: json.timestamp,
        prices: json.prices,
      };
    }
  }

  throw new Error("Unexpected input: " + line);
}

async function getPriceWriter(
  symbol: string,
  priceData: string
): Promise<{ writer: SonicBoom; isFirstWrite: boolean }> {
  let isFirstWrite = false;
  return writeStreamLock.acquire("filelock", () => {
    if (!writeStream.hasOwnProperty(symbol)) {
      isFirstWrite = true;
      writeStream[symbol] = new SonicBoom({
        dest: `./data/pricebot/symbols/${symbol.toLowerCase()}.json`,
        sync: false,
        mkdir: true,
        append: true,
      });
      writeStream[symbol].write("[\n" + priceData);
    }

    return { writer: writeStream[symbol], isFirstWrite };
  });
}

async function writePriceToFile({ prices, timestamp }: LogLine) {
  for (const { symbol, price } of prices) {
    const priceData = JSON.stringify({ timestamp, symbol, price }, null, 2);
    const { writer, isFirstWrite } = await getPriceWriter(symbol, priceData);
    if (!isFirstWrite) {
      writer.write(",\n" + priceData);
    }
  }
}

function writePartitionedPriceForSymbol(filename: string, symbol: string) {
  const data: PriceData[] = JSON.parse(fs.readFileSync(filename, "utf8"));
  data.sort((a, b) =>
    a.timestamp === b.timestamp ? 0 : a.timestamp < b.timestamp ? -1 : 1
  );
  const dataWithNoDuplicates = data.filter((p, i) => {
    const prev = i - 1;
    return !areTimestampsEqualToTheMinute(
      p.timestamp,
      data[prev]?.timestamp ?? new Date().toISOString()
    );
  });
  const partitions = partitionPriceList(dataWithNoDuplicates);
  Object.keys(partitions).forEach((partition) => {
    const w = new SonicBoom({
      dest: `./data/pricebot/symbols/${symbol}/${partition}_${symbol}.json`,
      sync: true,
      mkdir: true,
      append: false,
    });
    w.write(
      JSON.stringify(
        partitions[partition as keyof typeof partitions],
        undefined,
        2
      )
    );
  });
}

export function areTimestampsEqualToTheMinute(
  currentTime: string,
  prevTime: string
): boolean {
  const time1 = currentTime.split("T")[1].split(".")[0];
  const time2 = prevTime.split("T")[1].split(".")[0];
  return time1 === time2;
}

function generateParititonedPriceDataForAllSymbols() {
  const files = getFilesInDir("./data/pricebot/symbols").filter((fn) =>
    fn.endsWith(".json")
  );
  console.log("Number of symbol price data files: ", files.length);
  files.forEach((fn, i) => {
    const symbol = fn.split("/").pop()?.replace(".json", "");
    if (symbol) {
      writePartitionedPriceForSymbol(fn, symbol);
    } else {
      throw new Error("No symbol provided");
    }
  });
}

async function writePriceForSymbolFromLog(filepath: string) {
  return new Promise<void>((resolve, reject) => {
    const rl = readLine.createInterface({
      input: fs.createReadStream(filepath, "utf8"),
    });

    rl.on("error", function (error) {
      console.error(error);
      reject(error);
    });

    rl.on("line", (line: any) => {
      writePriceToFile(parseLogLine(line));
    });

    rl.on("close", () => {
      resolve();
    });
  });
}

function closeAllSonicBoomFileStreams() {
  return Object.keys(writeStream).map(
    (symbol) =>
      new Promise<void>((resolve) => {
        writeStream[symbol].write("\n]");
        writeStream[symbol].end();
        writeStream[symbol].addListener("close", () => {
          resolve();
        });
      })
  );
}

export function collateResults() {
  const allResults: any[] = [];
  const resultFiles = getFilesInDir("./data").filter((file) =>
    file.endsWith(".json")
  );
  resultFiles.forEach((file) => {
    const res = JSON.parse(fs.readFileSync(file, "utf8"))[0];

    if (res.length > 0) {
      allResults.push({
        ...res,
        name: file
          .split("/")
          .pop()
          ?.replace(/_results.json$/gi, ""),
      });
    }
  });
  allResults.sort((a, b) => b.profit - a.profit);
  fs.writeFileSync(
    "./data/sortedResults.json",
    JSON.stringify(allResults, null, 2)
  );
}
