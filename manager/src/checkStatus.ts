import cron from "node-cron";
import { logger } from "./log.js";
import { botRegister } from "./models.js";

function isLastCheckInOverAnHourAgo(lastCheckIn: Date) {
  // TO DO
  return false;
}

const checkBotStatus = () => {
  Object.keys(botRegister).forEach((botId) => {
    const currentBot = botRegister[botId];
    const { status } = currentBot;
    const botIsDown = isLastCheckInOverAnHourAgo(currentBot.lastCheckIn);

    if (botIsDown && ["ONLINE", "SHUTTING DOWN"].includes(status)) {
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
  cron.schedule("7 1 * * *", checkBotStatus);
};
