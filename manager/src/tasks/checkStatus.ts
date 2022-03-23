import { logger } from "../log.js";
import { botRegister } from "../models.js";
import { isWithinInterval, addHours } from "date-fns";

function isLastCheckInOverAnHourAgo(lastCheckIn: Date) {
  return !isWithinInterval(new Date(), {
    start: lastCheckIn,
    end: addHours(lastCheckIn, 1),
  });
}

const checkBotStatus = () => {
  Object.keys(botRegister.state).forEach((botId) => {
    const currentBot =
      botRegister.state[botId as keyof typeof botRegister.state];

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

export const startBotCheckup = () => {
  console.log("Starting bot checkup");
  setInterval(checkBotStatus, 30 * 60 * 1000);
};
