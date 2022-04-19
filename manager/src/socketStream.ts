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
  const actions: TBotAvailableActions = {};

  if (status === "ONLINE") {
    actions.shutdown = "/bots/shutdown";
  }
  if (status === "OFFLINE") {
    actions.startup = "/bots/startup";
    actions.remove = "/bots/remove";
  }
  if (status === "NOT WORKING") {
    actions.startup = "/bots/startup";
    actions.shutdown = "/bots/shutdown";
  }

  return actions;
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
