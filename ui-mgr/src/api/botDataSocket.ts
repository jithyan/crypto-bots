import io from "socket.io-client";
import { useLayoutEffect, useState } from "react";
import type {
  TBotStatusEvent,
  IBotInfoStream,
  IBotStatusUpdate,
  IBotRemovalUpdate,
} from "common-util";

const socket = io("ws://35.243.104.152:2000");

export type BotEvent<E extends TBotStatusEvent, D> = { event: E; data: D };
export type BotEventData =
  | BotEvent<"allbots", IBotInfoStream[]>
  | BotEvent<"botstatus", IBotStatusUpdate>
  | BotEvent<"botupdate", IBotInfoStream>
  | BotEvent<"botremove", IBotRemovalUpdate>;

export function useBotStream(
  updateOnEvent: (event: BotEventData) => void
): boolean {
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    if (!socket.hasListeners("allbots")) {
      socket.on("allbots", (data) => {
        console.log("allbots", data);
        updateOnEvent({ event: "allbots", data });
        setLoading(false);
      });

      socket.on("botremove", (data) => {
        console.log("botremove", data);
        updateOnEvent({ event: "botremove", data });
      });

      socket.on("botstatus", (data) => {
        console.log("botstatus", data);
        updateOnEvent({ event: "botstatus", data });
      });

      socket.on("botupdate", (data) => {
        console.log("botupdate", data);
        updateOnEvent({ event: "botupdate", data });
      });
    }
  }, []);

  return loading;
}
