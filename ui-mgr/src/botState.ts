import { useReducer, useMemo } from "react";
import type {
  TBotStatusEvent,
  IBotInfoStream,
  IBotRemovalUpdate,
  IBotStatusUpdate,
} from "common-util";
import produce from "immer";

type Action<E extends TBotStatusEvent, D> = { event: E; data: D };

export type PossibleSocketEvents =
  | Action<"allbots", IBotInfoStream[]>
  | Action<"botstatus", IBotStatusUpdate>
  | Action<"botupdate", IBotInfoStream>
  | Action<"botremove", IBotRemovalUpdate>;

function botStateReducer(
  prevState: Record<string, IBotInfoStream>,
  action: PossibleSocketEvents
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
  (action: PossibleSocketEvents) => void
] {
  const [state, dispatch] = useReducer(botStateReducer, {});

  return useMemo(
    () => [Object.keys(state).map((id) => state[id]), dispatch],
    [state]
  );
}
