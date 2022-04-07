import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import { parseISO } from "date-fns";
import Big from "big.js";
import { IDbTradePayload, DbTradePayload } from "common-util";
import { generateId, toMySqlDate } from "./dbUtils.js";
import { ITradeDbRow } from "./models.js";
import { logger } from "./log.js";
import {
  addNewTradeToDb,
  getYearToDateProfit,
  getYearToDateProfitForSymbol,
} from "./db.js";

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

app.get("/trade/year", async (req, res) => {
  const result = await getYearToDateProfit();
  return res.status(200).json(result);
});

app.get("/trade/year/:symbol", async (req, res) => {
  const symbol = req.params.symbol;
  const result = await getYearToDateProfitForSymbol(symbol);

  return res.status(200).json(result);
});

app.listen(2001, () => {
  console.log("Db service listening on port 2001");
});

function mapTradePayloadToDbObject(data: IDbTradePayload): ITradeDbRow {
  const newRow = {
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
  };

  return {
    trade_id: generateId(newRow),
    ...newRow,
  };
}
