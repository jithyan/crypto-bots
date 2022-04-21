import React, { useRef } from "react";
import { useRecoilRefresher_UNSTABLE } from "recoil";
import { BotEventData, useBotStream } from "../../api";
import {
  queryProfit,
  useUpdateBotRegistry,
  useBotFeed,
  useSortedAndFilteredBots,
} from "../../state";
import { ControlPanel } from "../controlPanel";
import { Dashboard } from "../dashboard";
import { TableLoading } from "./TableLoading";

export function MainContent() {
  const updateBotRegistry = useUpdateBotRegistry();
  const [feed, updateFeed] = useBotFeed();
  const refreshProfit = useRecoilRefresher_UNSTABLE(queryProfit);

  const updateState = useRef((action: BotEventData) => {
    if (action.event === "botupdate") {
      setTimeout(() => {
        updateFeed(action.data);
        updateBotRegistry(action);
        if (action.data?.state?.state?.includes("Stasis")) {
          refreshProfit();
        }
      }, 0);
    } else {
      updateBotRegistry(action);
    }
  });

  const loading = useBotStream(updateState.current);
  const sortedData = useSortedAndFilteredBots();

  return loading ? (
    <>
      <ControlPanel />
      <TableLoading />
    </>
  ) : (
    <>
      <ControlPanel />
      <Dashboard data={sortedData} changes={feed} />
    </>
  );
}
