import express from "express";
import helmet from "helmet";
import { getBotFilePath } from "@jithyan/lib";
import { Config } from "./config.js";
import { generalLogger } from "./log/index.js";
import axios, { AxiosError } from "axios";
import { ITradeAssetCycle } from "./bot/assetState/assetState.js";

const controlServer = express();
controlServer.use(helmet());
controlServer.disable("x-powered-by");

export const SERVER_CONTROL = {
  shutdown: false,
  liquidate: false,
};

export async function registerWithBotManager(
  extraInfo: {
    status?: "SHUTTING DOWN" | "OFFLINE";
    lastState?: ITradeAssetCycle;
  } = {}
): Promise<void> {
  return axios
    .post("http://0.0.0.0:2000/register", {
      version: Config.APP_VERSION,
      location: getBotFilePath({ symbol: Config.SYMBOL, port: Config.PORT }),
      exchange: Config.EXCHANGE,
      port: Config.PORT,
      symbol: Config.SYMBOL,
      maxBuyAmount: Config.MAX_BUY_AMOUNT,
      ...extraInfo,
    })
    .then(() => {
      generalLogger.info("Sent registration to manager");
    })
    .catch((e) => {
      const { message, code, response, config } = e as AxiosError;
      generalLogger.error("Manager registration failed", {
        message,
        code,
        response: response?.data,
        status: response?.status,
        statusText: response?.statusText,
        config,
      });
    });
}

controlServer.post("/shutdown", (req, res, next) => {
  generalLogger.info("Server shutdown request received, initiating...");
  SERVER_CONTROL.shutdown = true;
  return res.json({ status: "Acknowledged. Shutting down." });
});

controlServer.post("/liquidate", (req, res, next) => {
  generalLogger.info("Liquidation request received, initiating...");
  SERVER_CONTROL.liquidate = true;
  return res.json({ status: "Acknowledged. Will liquidate." });
});

export function startControlServer() {
  const port =
    Config.PORT ?? Math.trunc((Math.random() * 100_000 + 1025) % 65000);

  return controlServer.listen(port, () => {
    console.log("Started listening on port " + port);
    generalLogger.info("Started control server on port " + port);
  });
}
