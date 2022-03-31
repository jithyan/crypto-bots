import {
  atom,
  selector,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { Map } from "immutable";
import type { IBotInfoStream } from "common-util";
import { useCallback, useMemo } from "react";
import Big from "big.js";
import type { BotEventData } from "../api/botDataSocket";

export function useUpdateBotRegistry() {
  const setBotRegistry = useSetRecoilState(botRegistry);

  return useCallback(
    (action: BotEventData) =>
      setBotRegistry((prevState) => botRegistryReducer(prevState, action)),
    [setBotRegistry]
  );
}

export function useBotStats() {
  const botStats = useRecoilValue(atomBotStats);

  return useMemo(() => botStats, Object.values(botStats));
}

export type ImmutableBotInfo<
  K extends keyof IBotInfoStream = keyof IBotInfoStream
> = Map<K, IBotInfoStream[K]>;

export const botRegistry = atom({
  key: "botRegistry",
  default: Map<string, ImmutableBotInfo>(),
});

export const botInfoFor = selectorFamily({
  key: "botInfo",
  get:
    (id: string) =>
    ({ get }) =>
      get(botRegistry).get(id),
});

export const atomBotStats = selector({
  key: "botStats",
  get: ({ get }) => {
    const bots = get(botRegistry);
    const totalProfit = bots
      .reduce(
        (prev, curr) => new Big(getBotInfo(curr, "state").profit).add(prev),
        new Big("0")
      )
      .toFixed(3);

    const totalBots = bots.size;
    const onlineBots = bots.filter(
      (b) => getBotInfo(b, "status") === "ONLINE"
    ).size;
    const offlineBots = bots.filter(
      (b) => getBotInfo(b, "status") === "OFFLINE"
    ).size;
    const botsNotWorking = bots.filter(
      (b) => getBotInfo(b, "status") === "NOT WORKING"
    ).size;

    return { totalProfit, totalBots, onlineBots, botsNotWorking, offlineBots };
  },
});

export function getBotInfo<
  K extends keyof IBotInfoStream = keyof IBotInfoStream
>(map: ImmutableBotInfo, key: K): IBotInfoStream[K] {
  return map.get(key) as IBotInfoStream[K];
}

function botRegistryReducer(
  prevState: Map<string, ImmutableBotInfo>,
  action: BotEventData
): Map<string, ImmutableBotInfo> {
  switch (action.event) {
    case "allbots":
      return Map(
        action.data.map((bot) => [bot.id, Map(bot) as ImmutableBotInfo])
      );

    case "botremove":
      return prevState.delete(action.data.id);

    case "botstatus":
      return prevState
        .setIn([action.data.id, "status"], action.data.status)
        .setIn([action.data.id, "actions"], action.data.actions);

    case "botupdate":
      return prevState.set(
        action.data.id,
        Map(action.data) as ImmutableBotInfo
      );

    default:
      return prevState;
  }
}
