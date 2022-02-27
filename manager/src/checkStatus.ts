import cron from "node-cron";
import { botRegister } from "./models.js";

function isLastCheckInOverAnHourAgo(lastCheckIn: Date) {
  // TO DO
  return true;
}

const checkBotStatus = () => {
  Object.keys(botRegister).forEach((botId) => {
    const currentBot = botRegister[botId];

    if (
      currentBot.status === "ONLINE" &&
      isLastCheckInOverAnHourAgo(currentBot.lastCheckIn)
    ) {
      console.error("Bot has not updated");
      currentBot.status = "NOT WORKING";
    } else if (
      currentBot.status === "SHUTTING DOWN" &&
      isLastCheckInOverAnHourAgo(currentBot.lastCheckIn)
    ) {
      console.error("Bot has not updated since trying to shutdown");
      currentBot.status = "NOT WORKING";
    }
  });
};

export const startBotStatusCheck = () => {
  console.log("Started bot status check scheduler");
  cron.schedule("7 1 * * *", checkBotStatus);
};
