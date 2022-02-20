import express from "express";
import { Config } from "./config.js";
import { generalLogger } from "./log/index.js";

const controlServer = express();

export const SERVER_CONTROL = {
  shutdown: false,
};

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
