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
    if (currentBot) {
      const { status } = currentBot;
      const botIsDown = isLastCheckInOverAnHourAgo(currentBot.lastCheckIn);
      const flagError =
        botIsDown && ["ONLINE", "SHUTTING DOWN"].includes(status);
      logger.info("Checking bot status", { botIsDown, currentBot, flagError });

      if (flagError) {
        logger.error("Bot has not sent a health check in the last hour", {
          ...currentBot,
          botId,
        });
        currentBot.status = "NOT WORKING";
      }
    } else {
      logger.warn("currentBot does not exist", {
        currentBot,
        botId,
        state: botRegister.state,
      });
    }
  });
};

export const startBotStatusCheck = () => {
  console.log("Started bot status check scheduler");
  setInterval(checkBotStatus, 60 * 60 * 1000);
};
