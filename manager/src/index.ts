import { startBotStatusCheck } from "./checkStatus.js";
import { Config } from "./config.js";
import { httpServer } from "./httpServer.js";
import { logger } from "./log.js";

const hostname = "0.0.0.0";

httpServer.listen(Config.PORT, hostname, () => {
  console.log(`Listening on ${hostname}:${Config.PORT}`);
  logger.info("Started bot manager", { ...Config });
  startBotStatusCheck();
});
