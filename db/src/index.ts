import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import { parseISO } from "date-fns";
import Big from "big.js";
import { IDbTradePayload, DbTradePayload } from "@jithyan/lib";
import { toMySqlDate } from "./db/dbUtils.js";
import { ITradeDbRow } from "./models.js";
import { logger } from "./log.js";
import {
  addNewTradeToDb,
  allTimeProfit,
  allTimeProfitForSymbol,
  getPerformanceReport,
  getTradeStatsForSymbol,
} from "./db/db.js";

const app = express();
export const httpServer = http.createServer(app);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.disable("x-powered-by");

app.post("/trade/add", async (req, res) => {
  try {
    const tradePayload = DbTradePayload.parse(req.body);
    const trade = mapTradePayloadToDbObject(tradePayload);

    logger.info("Logging new trade", { tradePayload, trade });

    await addNewTradeToDb(trade);

    return res.status(201).json({ status: "Successfully added row" });
  } catch (e: any) {
    logger.error("Add new trade failed", e);
    return res.status(500).json({ msg: "Failed to add new trade" });
  }
});

app.get("/trade/profit", async (req, res) => {
  try {
    const includeTestNet = req.query.include_test !== "0";
    const result = await allTimeProfit({
      includeTestNet,
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: "Failed", error });
  }
});

app.get("/trade/profit/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const includeTestNet = req.query.include_test !== "0";
    const result = await allTimeProfitForSymbol(symbol, includeTestNet);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ status: "Failed", error });
  }
});

app.get("/trade/stats/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol;
    const includeTestNet = req.query.include_test !== "0";
    const result = await getTradeStatsForSymbol(symbol, includeTestNet);

    return res.status(200).json(result);
  } catch (error) {
    logger.error("Failed getting agg trade stats", {
      error,
      symbol: req.params.symbol,
    });
    return res.status(500).json({ status: "Failed", error });
  }
});

app.get("/trade/report", async (req, res) => {
  try {
    const result = await getPerformanceReport();

    return res.status(200).json(result);
  } catch (error) {
    logger.error("Failed getting performance report", {
      error,
    });
    return res.status(500).json({ status: "Failed", error });
  }
});

app.listen(2001, () => {
  console.log("Db service listening on port 2001");
});

function mapTradePayloadToDbObject(
  data: IDbTradePayload
): Omit<ITradeDbRow, "trade_id"> {
  return {
    at_timestamp: toMySqlDate(parseISO(data.timestamp)),
    action: data.type,
    price: data.price,
    amount: data.amount,
    busd_value: data.value,
    from_coin: data.from,
    to_coin: data.to,
    profit: data.profit === "N/A" ? "0" : data.profit,
    aud_value: data.audValue,
    aud_busd: data.audBusd,
    commission: new Big(data.audValue).mul("0.001").toFixed(8),
    symbol:
      data.type === "BUY" ? `${data.to}${data.from}` : `${data.from}${data.to}`,
    is_test: data.isTestNet ? "0" : data.isTestNet,
  };
}
