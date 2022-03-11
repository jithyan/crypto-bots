import fs from "fs";
import { Intervals } from "../parse/api";
import {
  getCsvDataFromFiles,
  calculateProfit,
  getTradeStats,
} from "../parse/csv";
import { makeMockServer } from "../mock/mockApi";
import { getTodayInLogDateFormat } from "../utils";

const runCryptoBot = require("./bot.js").default;

const interval = process.env.INTERV as Intervals;
const volatileAsset = process.env.VOL as string;
const stableAsset = process.env.STAB as string;
const increase = process.env.INC as string;
const decrease = process.env.DEC as string;
const stopLoss = process.env.STOPL as string;

if (
  interval &&
  volatileAsset &&
  stableAsset &&
  increase &&
  decrease &&
  stopLoss
) {
  startEngine();
}

async function startEngine() {
  const mockServer = makeMockServer({ volatileAsset, stableAsset }, interval);
  mockServer.listen();

  try {
    await runCryptoBot(getBotConfig());
  } catch (err: any) {
    mockServer.close();
    if (err?.response?.data?.message === "out of data") {
      const { profit, stats } = calculateStatsFromTrades();
      clearBotLogs();

      const result = {
        increase,
        decrease,
        profit,
        stopLoss,
        interval,
        stats,
      };
      process.send?.(JSON.stringify(result));

      process.exit(0);
    } else {
      fs.appendFileSync(
        `error_${volatileAsset}.txt`,
        JSON.stringify(err, undefined, 2),
        "utf8"
      );
      process.send?.(JSON.stringify({ error: true }));
      process.exit(1);
    }
  }
}

function calculateStatsFromTrades() {
  const csvTradeFile = `${getTodayInLogDateFormat()}-trades.csv`;
  const csv = getCsvDataFromFiles([csvTradeFile]);
  const profit = calculateProfit(csv);
  const stats = getTradeStats(csv);

  return {
    profit,
    stats,
  };
}

function clearBotLogs() {
  fs.writeFileSync(`${getTodayInLogDateFormat()}-trades.csv`, "", "utf8");
  try {
    fs.unlinkSync(`${getTodayInLogDateFormat()}-general.log`);
    fs.unlinkSync(`${getTodayInLogDateFormat()}-pricestats.log`);
    fs.unlinkSync(`${getTodayInLogDateFormat()}-state.log`);
    fs.unlinkSync(`${getTodayInLogDateFormat()}-api.log`);
  } catch (err) {}
}

function getBotConfig() {
  return {
    enableControlServer: false,
    enableResume: false,
    sleepStrategy: "no-sleep",
    volatileAsset: volatileAsset?.toUpperCase().trim(),
    stableAsset: stableAsset?.toUpperCase().trim(),
    decisionConfig: {
      MIN_PERCENT_INCREASE_FOR_SELL: "1.015",
      PRICE_HAS_INCREASED_THRESHOLD: increase,
      PRICE_HAS_DECREASED_THRESHOLD: decrease,
      STOP_LOSS_THRESHOLD: stopLoss,
    },
  };
}
