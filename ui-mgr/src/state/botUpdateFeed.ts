import { atom, selector, useRecoilState } from "recoil";
import { List } from "immutable";
import type { IBotInfoStream } from "common-util";
import Big from "big.js";
import { botInfoFor, getBotInfo, ImmutableBotInfo } from "./botRegistry";
import { formatIsoDate } from "../utils/date";

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

type DetectChange = (current: IBotInfoStream, old: ImmutableBotInfo) => string;

const skipIfPriceBot =
  (fn: DetectChange): DetectChange =>
  (curr, old) =>
    isPriceBot(curr) ? "" : fn(curr, old);

const changeDetectors: DetectChange[] = [
  skipIfPriceBot(stateChange),
  skipIfPriceBot(profitChange),
  skipIfPriceBot(tickerPriceChange),
  statusChange,
];

function isPriceBot(bot: IBotInfoStream): boolean {
  return bot.symbol === "PRICEBOT";
}

function getUpdateForBot(
  bot: IBotInfoStream,
  oldBot: ImmutableBotInfo | undefined
): string {
  const initialLog = `[${formatIsoDate(bot.lastCheckIn)}] ${bot.symbol}:`;

  const updates: string[] = oldBot
    ? changeDetectors
        .map((detectChange) => detectChange(bot, oldBot))
        .filter(Boolean)
    : ["New bot added"];

  return `${initialLog} ${
    updates.length > 0 ? updates.join(" | ") : "No change"
  }`;
}

function statusChange(currentBot: IBotInfoStream, oldBot: ImmutableBotInfo) {
  const oldStatus = getBotInfo(oldBot, "status");
  const currentStatus = currentBot.status;

  if (isPriceBot(currentBot)) {
    return "Checked in";
  } else if (oldStatus === currentStatus) {
    return "";
  } else {
    return `Status changed to ${currentStatus}`;
  }
}

function tickerPriceChange(
  currentBot: IBotInfoStream,
  oldBot: ImmutableBotInfo
): string {
  const oldTickerPrice = new Big(
    getBotInfo(oldBot, "state")?.tickerPrice ?? "0"
  );
  const newTickerPrice = new Big(currentBot?.state?.tickerPrice ?? "0");
  const pctChange = new Big("1")
    .minus(newTickerPrice.div(oldTickerPrice))
    .mul("-100");

  if (pctChange.eq("0")) {
    return "Ticker price unchanged";
  } else if (pctChange.gt("0")) {
    return `Ticker price increased by ${pctChange.toFixed(3)}%`;
  } else {
    return `Ticker price decreased by ${pctChange.toFixed(3)}%`;
  }
}

function stateChange(
  currentBot: IBotInfoStream,
  oldBot: ImmutableBotInfo
): string {
  const oldState = getBotInfo(oldBot, "state")?.state;
  const currState = currentBot?.state?.state;

  if (oldState !== currState) {
    return `State changed from ${oldState} to ${currState}`;
  } else {
    return "";
  }
}

function profitChange(currentBot: IBotInfoStream, oldBot: ImmutableBotInfo) {
  const oldProfit = new Big(getBotInfo(oldBot, "state")?.profit ?? "0");
  const currProfit = new Big(currentBot?.state?.profit ?? "0");

  if (!oldProfit.eq(currProfit)) {
    const diff = currProfit.minus(oldProfit).toFixed(3);
    return `Profit changed by $${diff}`;
  } else {
    return "";
  }
}
