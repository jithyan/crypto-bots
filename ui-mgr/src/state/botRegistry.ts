import {
  atom,
  selectorFamily,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { Collection, Map } from "immutable";
import type { IBotInfoStream } from "@jithyan/lib";
import { useCallback } from "react";
import type { BotEventData } from "../api/botDataSocket";

export function useUpdateBotRegistry(): (action: BotEventData) => void {
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
