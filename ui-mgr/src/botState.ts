import { useReducer, useMemo } from "react";
import type { IBotInfoStream } from "common-util";
import produce from "immer";
import type { BotEvent, BotEventData } from "./api";
import { formatIsoDate } from "./helper";

export interface IBotReducerState {
  bots: Record<string, IBotInfoStream>;
  changes: string[];
}

export function reducer(state: IBotReducerState, action: BotEventData) {
  return produce(state, (draft) => {
    draft.bots = botStateReducer(state.bots, action);
    draft.changes = botUpdateReducer(state.changes, action, state.bots);
  });
}

export const MAX_EVENT_LIST = 3;

function getUpdateForBot(
  data: Record<string, IBotInfoStream>,
  bot: IBotInfoStream
): string {
  const initialLog = `[${formatIsoDate(bot.lastCheckIn)}] ${bot.symbol}:`;
  const updates: string[] = [];

  const oldBot = data[bot.id];
  if (oldBot) {
    const oldProfit = oldBot.lastState?.stats?.usdProfitToDate ?? "0";
    const currProfit = bot.lastState?.stats?.usdProfitToDate ?? "0";
    const diff = Number(currProfit) - Number(oldProfit);

    if (oldProfit !== currProfit) {
      updates.push(`Profit changed by $${diff.toFixed(3)}`);
    }

    const oldState = oldBot.lastState?.state;
    const currState = bot.lastState?.state;

    if (oldState !== currState) {
      updates.push(`State changed to ${currState}`);
    }
  } else {
    updates.push("New bot added");
  }

  return `${initialLog} ${
    updates.length > 0 ? updates.join(" | ") : "No change"
  }`;
}

function botUpdateReducer(
  prevState: string[],
  action: BotEventData,
  data: Record<string, IBotInfoStream>
): string[] {
  switch (action.event) {
    case "botupdate":
      const update = getUpdateForBot(data, action.data);
      return produce(prevState, (draft) => {
        if (prevState.length >= MAX_EVENT_LIST) {
          draft.shift();
          draft[prevState.length - 1] = update;
        } else {
          draft.push(update);
        }
      });

    default:
      return prevState;
  }
}

function botStateReducer(
  prevState: Record<string, IBotInfoStream>,
  action: BotEventData
): Record<string, IBotInfoStream> {
  switch (action.event) {
    case "allbots":
      return action.data.reduce((prev, curr) => {
        prev[curr.id] = curr;
        return prev;
      }, {} as Record<string, IBotInfoStream>);

    case "botremove":
      return produce(prevState, (draft) => {
        delete draft[action.data.id];
      });

    case "botstatus":
      return produce(prevState, (draft) => {
        draft[action.data.id].status = action.data.status;
        draft[action.data.id].actions = action.data.actions;
      });

    case "botupdate":
      return produce(prevState, (draft) => {
        draft[action.data.id] = action.data;
      });

    default:
      return prevState;
  }
}

export function useBotState(): [
  IBotInfoStream[],
  string[],
  (action: BotEventData) => void
] {
  const [state, dispatch] = useReducer(reducer, { bots: {}, changes: [] });

  return useMemo(
    () => [
      Object.keys(state.bots).map((id) => state.bots[id]),
      state.changes,
      dispatch,
    ],
    [state]
  );
}
