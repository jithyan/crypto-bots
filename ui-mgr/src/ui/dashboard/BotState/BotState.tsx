import type { IBotStateDetails, TBotStatus } from "common-util";
import React, { useCallback, useState } from "react";
import { CompactStateView } from "./CompactView";
import { ExpandedView } from "./ExpandedView";
import { TradeView } from "./TradeView";

export type IBotStateProps = IBotStateDetails & {
  symbol: string;
  status: TBotStatus;
  lastCheckIn: string;
};

export type TChangeViewState = (view: ViewStates) => void;
export type ViewStates = "trade" | "compact" | "expanded";

export const BotState = React.memo((props: IBotStateProps) => {
  const [viewState, changeViewState] = useState<ViewStates>("compact");

  if (viewState === "compact") {
    return <CompactStateView {...props} changeViewState={changeViewState} />;
  } else if (viewState === "expanded") {
    return <ExpandedView {...props} changeViewState={changeViewState} />;
  } else if (viewState === "trade") {
    return <TradeView />;
  } else {
    throw new Error("Unrecognized view state: " + viewState);
  }
});
