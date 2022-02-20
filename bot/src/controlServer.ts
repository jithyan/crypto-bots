import express from "express";
import { Config } from "./config.js";
import { generalLogger } from "./log/index.js";
import axios, { AxiosError } from "axios";
import cron from "node-cron";

const controlServer = express();

export const SERVER_CONTROL = {
  shutdown: false,
};

async function registerWithBotManager(): Promise<void> {
  return axios
    .post("http://localhost:8900/register", {
      version: Config.APP_VERSION,
      location: Config.APPSTATE_FILENAME,
      exchange: Config.EXCHANGE,
      port: Config.PORT,
      symbol: Config.SYMBOL,
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
    registerWithBotManager();
    cron.schedule("0 21 * * *", registerWithBotManager);
  });
}
