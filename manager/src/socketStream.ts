import {
  IBotInfoStream,
  IBotRemovalUpdate,
  IBotStatusUpdate,
  TBotAvailableActions,
  TBotStatus,
} from "common-util";
import { getBotRegisterIds, botRegister, IBotInfo } from "./models";

function getAvailableActionsForBot(status: TBotStatus): TBotAvailableActions {
  const actions: TBotAvailableActions = {};

  if (status === "ONLINE") {
    actions.shutdown = "/bots/shutdown";
  }
  if (status === "OFFLINE") {
    actions.startup = "/bots/startup";
    actions.remove = "/bots/remove";
  }

  return actions;
}

export const getBotUpdate = (id: string): IBotInfoStream => {
  const bot = botRegister.state[id] ?? {};

  return {
    id,
    ...bot,
    lastCheckIn: bot?.lastCheckIn?.toISOString(),
    actions: getAvailableActionsForBot(bot.status),
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
