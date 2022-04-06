import fs from "fs";
import Big from "big.js";
import { parse } from "date-fns";
import { toMySqlDate, generateId } from "./dbUtils.js";
import { ITradeDbRow } from "./models.js";

type TradeCsv = [
  timestamp: string,
  type: "BUY" | "SELL",
  price: string,
  amount: string,
  value: string,
  from: string,
  to: string,
  profit: string,
  audValue: string,
  audBusd: string
];

export function getAllCsvData() {
  const vals = getCsvDataFromFiles(getAllFiles())
    .map(mapCsvRowToDbObject)
    .map(mapToInsertStmt)
    .join(",");
  return `INSERT INTO trades VALUES ${vals};`;
}

function mapCsvRowToDbObject(csv: TradeCsv): ITradeDbRow {
  const newRow = {
    at_timestamp: toMySqlDate(parse(csv[0], "yyyy-MM-dd h:m:s aa", new Date())),
    action: csv[1],
    price: csv[2],
    amount: csv[3],
    busd_value: csv[4],
    from_coin: csv[5],
    to_coin: csv[6],
    profit: csv[7] === "N/A" ? "0" : csv[7],
    aud_value: csv[8],
    aud_busd: csv[9],
    commission: new Big(csv[8]).mul("0.001").toFixed(8),
    symbol: csv[1] === "BUY" ? `${csv[6]}${csv[5]}` : `${csv[5]}${csv[6]}`,
  };

  return {
    trade_id: generateId(newRow),
    ...newRow,
  };
}

function mapToInsertStmt(row: ITradeDbRow) {
  return `('${row.trade_id}','${row.symbol}','${row.at_timestamp}','${row.action}',${row.price},${row.amount},${row.busd_value},'${row.from_coin}','${row.to_coin}',${row.profit},${row.aud_value},${row.aud_busd},${row.commission})`;
}

function getAllFiles() {
  const botConfig = JSON.parse(
    fs.readFileSync("../bot/botConfig.json", "utf8")
  );
  const symbols = Object.keys(botConfig);
  return symbols
    .map((symbol) => getFilesInDir(`./data/${symbol}`))
    .flatMap((f) => f);
}

export function getFilesInDir(dir: string): string[] {
  const filenames = fs.readdirSync(dir);
  return filenames.map((fn) => `${dir}/${fn}`);
}

export function getCsvDataFromFiles(filenames: string[]): TradeCsv[] {
  const csvData: TradeCsv[][] = [];

  filenames.forEach((fn) => {
    if (fn.endsWith(".csv")) {
      const csv: string = fs.readFileSync(fn, "utf8");
      const stringRows: string[] = csv
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const fileCsv: TradeCsv[] = stringRows
        .map((line) => line.split(",") as TradeCsv)
        .map((row) => {
          const modRow: TradeCsv = [...row];
          const day = fn.split("/").pop()?.replace("-trades.csv", "").trim();
          modRow[0] = `${day} ${modRow[0]}`;
          return modRow;
        });

      csvData.push(fileCsv);
    }
  });

  return csvData.flatMap((row) => row);
}

export function calculateProfit(csvData: TradeCsv[]): number {
  return csvData
    .filter((row) => row[1] === "SELL")
    .reduce((acc, line) => acc + Number(line[7]), 0);
}

export function getTradeStats(csvData: TradeCsv[]) {
  const sellTrades = csvData.filter((row) => row[1] === "SELL");
  const profitableSellTrades = sellTrades.filter(
    (line) => Number(line[7]) >= 0
  );
  const numSellTrades = sellTrades.length;
  const numProfitableTrades = profitableSellTrades.length;
  const totalProfit = calculateProfit(csvData);
  const totalOnlyProfitableTrades = calculateProfit(profitableSellTrades);

  const avgProfitForProfitableTrade =
    totalOnlyProfitableTrades / numProfitableTrades;
  const avgProfit = totalProfit / numSellTrades;
  sellTrades.sort((a, b) => Number(a[7]) - Number(b[7]));
  profitableSellTrades.sort((a, b) => Number(a[7]) - Number(b[7]));

  return {
    numSellTrades,
    numProfitableTrades,
    totalProfit,
    totalOnlyProfitableTrades,
    avgProfitForProfitableTrade,
    avgProfit,
  };
}
