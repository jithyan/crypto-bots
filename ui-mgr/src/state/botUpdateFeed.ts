import { atom, selector, useRecoilState } from "recoil";
import { List } from "immutable";
import { botInfoFor, ImmutableBotInfo } from "./botRegistry";
import type { IBotInfoStream } from "common-util";
import { formatIsoDate } from "../helper";

export const MAX_EVENT_LIST = 4;

export function useBotFeed() {
  return useRecoilState(botFeed) as [
    List<string>,
    (botUpdate: IBotInfoStream) => void
  ];
}

const botChangeList = atom({
  key: "botUpdateFeed",
  default: List<string>(),
});

const botFeed = selector<IBotInfoStream | List<string>>({
  key: "botFeed",
  get: ({ get }) => get(botChangeList),
  set: ({ set, get }, newValue) => {
    const botUpdate = newValue as IBotInfoStream;
    const oldBot = get(botInfoFor(botUpdate.id));
    set(botChangeList, (changeList) => {
      const nextUpdate = getUpdateForBot(botUpdate, oldBot);

      return changeList.size >= MAX_EVENT_LIST
        ? changeList.shift().push(nextUpdate)
        : changeList.push(nextUpdate);
    });
  },
});

function getUpdateForBot(
  bot: IBotInfoStream,
  oldBot: ImmutableBotInfo | undefined
): string {
  const initialLog = `[${formatIsoDate(bot.lastCheckIn)}] ${bot.symbol}:`;
  const updates: string[] = [];
  const oldBotLastState = oldBot?.get("lastState");

  if (oldBot) {
    const oldProfit = oldBotLastState?.stats?.usdProfitToDate ?? "0";
    const currProfit = bot.lastState?.stats?.usdProfitToDate ?? "0";
    const diff = Number(currProfit) - Number(oldProfit);

    if (oldProfit !== currProfit) {
      updates.push(`Profit changed by $${diff.toFixed(3)}`);
    }

    const oldState = oldBotLastState?.state;
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
