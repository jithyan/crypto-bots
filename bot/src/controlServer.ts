import express from "express";
import helmet from "helmet";
import { getBotFilePath } from "common-util";
import { Config } from "./config.js";
import { generalLogger } from "./log/index.js";
import axios, { AxiosError } from "axios";

const controlServer = express();
controlServer.use(helmet());
controlServer.disable("x-powered-by");

export const SERVER_CONTROL = {
  shutdown: false,
};

export async function registerWithBotManager(
  extraInfo: {
    status?: "SHUTTING DOWN" | "OFFLINE";
    lastState?: string;
  } = {}
): Promise<void> {
  return axios
    .post("http://0.0.0.0:2000/register", {
      version: Config.APP_VERSION,
      location: getBotFilePath({ symbol: Config.SYMBOL, port: Config.PORT }),
      exchange: Config.EXCHANGE,
      port: Config.PORT,
      symbol: Config.SYMBOL,
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

export function startControlServer() {
  const port =
    Config.PORT ?? Math.trunc((Math.random() * 100_000 + 1025) % 65000);

  return controlServer.listen(port, () => {
    console.log("Started listening on port " + port);
    generalLogger.info("Started control server on port " + port);
  });
}
