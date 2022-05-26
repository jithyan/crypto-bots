import type { IBotStateDetails, TBotStatus } from "@jithyan/lib";
import React, { useState } from "react";
import { spinner } from "../../controlPanel/Profit";
import { CompactStateView } from "./CompactView";
import { ExpandedView } from "./ExpandedView";
const TradeView = React.lazy(() => import("./TradeView"));

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
    return (
      <React.Suspense fallback={spinner}>
        <TradeView symbol={props.symbol} changeViewState={changeViewState} />
      </React.Suspense>
    );
  } else {
    throw new Error("Unrecognized view state: " + viewState);
  }
});
