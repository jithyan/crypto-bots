import cron from "node-cron";
import { logger } from "../log.js";
import { botRegister } from "../models.js";
import { isWithinInterval, addHours } from "date-fns";

function isLastCheckInOverAnHourAgo(lastCheckIn: Date) {
  return !isWithinInterval(lastCheckIn, {
    start: lastCheckIn,
    end: addHours(lastCheckIn, 1),
  });
}

const checkBotStatus = () => {
  Object.keys(botRegister).forEach((botId) => {
    const currentBot = botRegister.state[botId];
    const { status } = currentBot;
    const botIsDown = isLastCheckInOverAnHourAgo(currentBot.lastCheckIn);
    const flagError = botIsDown && ["ONLINE", "SHUTTING DOWN"].includes(status);

    logger.info("Checking bot status", { currentBot, status, botIsDown });

    if (flagError) {
      logger.error("Bot has not sent a health check in the last hour", {
        ...currentBot,
        botId,
      });
      currentBot.status = "NOT WORKING";
    }
  });
};

export const startBotStatusCheck = () => {
  console.log("Started bot status check scheduler");
  cron.schedule("* 2 * * *", checkBotStatus);
};
