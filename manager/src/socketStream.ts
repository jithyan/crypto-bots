import {
  IBotInfoStream,
  IBotRemovalUpdate,
  IBotStatusUpdate,
  mapBotLastStateToStateDetails,
  TBotAvailableActions,
  TBotStatus,
} from "@jithyan/lib";
import { getBotRegisterIds, botRegister } from "./models.js";

function getAvailableActionsForBot(status: TBotStatus): TBotAvailableActions {
  switch (status) {
    case "ONLINE":
      return {
        shutdown: "/bots/shutdown",
        liquidate: "/bots/liquidate",
      };

    case "NOT WORKING":
      return {
        startup: "/bots/startup",
        shutdown: "/bots/shutdown",
      };

    case "OFFLINE":
      return {
        startup: "/bots/startup",
        remove: "/bots/remove",
      };

    default:
      return {};
  }
}

export const getBotUpdate = (id: string): IBotInfoStream => {
  const bot = botRegister.state[id] ?? {};

  return {
    lastCheckIn: bot?.lastCheckIn?.toISOString(),
    actions: getAvailableActionsForBot(bot.status),
    id,
    status: bot.status,
    version: bot.version,
    exchange: bot.exchange,
    symbol: bot.symbol,
    state: mapBotLastStateToStateDetails(bot),
  };
};

export const getAllBotInfo = (): IBotInfoStream[] =>
  getBotRegisterIds().map(getBotUpdate);

export const getBotStatusUpdate = (
  id: string,
  status: TBotStatus
): IBotStatusUpdate => ({
  id,
  status,
  actions: getAvailableActionsForBot(status),
});

export const getBotRemovalUpdate = (id: string): IBotRemovalUpdate => ({ id });
