import fs from "fs";
import { startBotStatusCheck } from "./tasks/checkStatus.js";
import { Config } from "./config.js";
import { httpServer } from "./httpServer.js";
import { logger } from "./log.js";
import { startPeriodicStateSaving } from "./tasks/saveState.js";
import { botRegister, TBotRegister } from "./models.js";

const hostname = "0.0.0.0";

try {
  logger.info("Attempting to load previous state");

  const loadedFile = JSON.parse(
    fs.readFileSync("./botRegisterState.json", "utf8")
  ) as TBotRegister;

  if (Object.keys(loadedFile).length !== 0) {
    botRegister.state = loadedFile;
  } else {
    logger.info("Nothing to load as state is empty");
    console.log("Nothing to load as state is empty");
  }
} catch (err) {
  logger.warn("Failed to load previous state", err);
  console.log("Failed to load previous state", err);
}

httpServer.listen(Config.PORT, hostname, () => {
  console.log(`Listening on ${hostname}:${Config.PORT}`);
  logger.info("Started bot manager", { ...Config });
  startBotStatusCheck();
  startPeriodicStateSaving();
});
