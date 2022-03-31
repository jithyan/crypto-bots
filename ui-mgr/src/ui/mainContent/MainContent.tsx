import React, { useRef } from "react";
import { BotEventData, useBotStream } from "../../api";
import {
  useUpdateBotRegistry,
  useBotFeed,
  useSortedBotList,
} from "../../state";
import { ControlPanel } from "../controlPanel";
import { Dashboard } from "../dashboard";
import { TableLoading } from "./TableLoading";

export function MainContent() {
  const updateBotRegistry = useUpdateBotRegistry();
  const [feed, updateFeed] = useBotFeed();

  const updateState = useRef((action: BotEventData) => {
    if (action.event === "botupdate") {
      setTimeout(() => {
        updateFeed(action.data);
        updateBotRegistry(action);
      }, 0);
    } else {
      updateBotRegistry(action);
    }
  });

  const loading = useBotStream(updateState.current);
  const sortedData = useSortedBotList();

  return loading ? (
    <TableLoading />
  ) : (
    <>
      <ControlPanel />
      <Dashboard data={sortedData} changes={feed} />
    </>
  );
}
