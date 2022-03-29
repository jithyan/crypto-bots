import { atom, selectorFamily, useSetRecoilState } from "recoil";
import { Map } from "immutable";
import type { IBotInfoStream } from "common-util";
import type { BotEventData } from "../api";
import { useCallback } from "react";

export function useUpdateBotRegistry() {
  const setBotRegistry = useSetRecoilState(botRegistry);

  return useCallback(
    (action: BotEventData) =>
      setBotRegistry((prevState) => botRegistryReducer(prevState, action)),
    [setBotRegistry]
  );
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
