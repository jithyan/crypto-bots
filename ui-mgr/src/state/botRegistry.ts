import {
  atom,
  selector,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { Collection, Map } from "immutable";
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

export function useBotDetails(id: string) {
  return useRecoilValue(botInfoFor(id));
}

export function useBotStats() {
  const botStats = useRecoilValue(atomBotStats);

  return useMemo(() => botStats, Object.values(botStats));
}

export type ImmutableBotMap<
  K extends keyof IBotInfoStream = keyof IBotInfoStream
> = Map<K, IBotInfoStream[K]>;

export type ImmutableBotCollection = Collection<string, ImmutableBotMap>;

export const botRegistry = atom({
  key: "botRegistry",
  default: Map<string, ImmutableBotMap>(),
});

export const botInfoFor = selectorFamily({
  key: "botInfo",
  get:
    (id: string) =>
    ({ get }) =>
      get(botRegistry).get(id),
});

export const atomBotStats = selector<{
  totalProfit: string;
  totalBots: number;
  onlineBots: number;
  botsNotWorking: number;
  offlineBots: number;
  numBotsHoldStable: number;
  numBotsPlacedOrders: number;
  numBotsHoldingVolatileAssets: number;
  numBotsSleeping: number;
}>({
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

    const numBotsHoldingVolatileAssets = bots.reduce((prev, curr) => {
      const state = getBotInfo(curr, "state")?.state ?? "";
      const status = getBotInfo(curr, "status");

      if (state.includes("HoldVolatile") && status === "ONLINE") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    const numBotsPlacedOrders = bots.reduce((prev, curr) => {
      if (getBotInfo(curr, "state")?.state?.includes("Order")) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    const numBotsHoldStable = bots.reduce((prev, curr) => {
      const state = getBotInfo(curr, "state")?.state ?? "";
      const status = getBotInfo(curr, "status");

      if (state.includes("HoldStable") && status === "ONLINE") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    const numBotsSleeping = bots.reduce((prev, curr) => {
      const state = getBotInfo(curr, "state")?.state ?? "";
      const status = getBotInfo(curr, "status");

      if (state.includes("PostSell") && status === "ONLINE") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    return {
      totalProfit,
      totalBots,
      onlineBots,
      botsNotWorking,
      offlineBots,
      numBotsHoldStable,
      numBotsPlacedOrders,
      numBotsHoldingVolatileAssets,
      numBotsSleeping,
    };
  },
});

export function getBotInfo<
  K extends keyof IBotInfoStream = keyof IBotInfoStream
>(map: ImmutableBotMap, key: K): IBotInfoStream[K] {
  return map.get(key) as IBotInfoStream[K];
}

function botRegistryReducer(
  prevState: Map<string, ImmutableBotMap>,
  action: BotEventData
): Map<string, ImmutableBotMap> {
  switch (action.event) {
    case "allbots":
      return Map(
        action.data.map((bot) => [bot.id, Map(bot) as ImmutableBotMap])
      );

    case "botremove":
      return prevState.delete(action.data.id);

    case "botstatus":
      return prevState
        .setIn([action.data.id, "status"], action.data.status)
        .setIn([action.data.id, "actions"], action.data.actions);

    case "botupdate":
      return prevState.set(action.data.id, Map(action.data) as ImmutableBotMap);

    default:
      return prevState;
  }
}
