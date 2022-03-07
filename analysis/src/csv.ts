import fs from "fs";

type TradeCsv = [
  timestamp: string,
  type: "BUY" | "SELL",
  price: string,
  amount: string,
  value: string,
  from: string,
  to: string,
  profit: string
];

export function getCsvDataFromFiles(filenames: string[]): TradeCsv[] {
  const csvData: TradeCsv[][] = [];

  filenames.forEach((fn) => {
    if (fn.endsWith(".csv")) {
      const csv: string = fs.readFileSync(fn, "utf8");
      const stringRows: string[] = csv
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const fileCsv: TradeCsv[] = stringRows.map(
        (line) => line.split(",") as TradeCsv
      );

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
