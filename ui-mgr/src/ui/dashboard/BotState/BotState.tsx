import type { IBotStateDetails, TBotStatus } from "common-util";
import React, { useCallback, useState } from "react";
import { CompactStateView } from "./CompactView";
import { ExpandedView } from "./ExpandedView";

export type IBotStateProps = IBotStateDetails & {
  symbol: string;
  status: TBotStatus;
  lastCheckIn: string;
};

export const BotState = React.memo((props: IBotStateProps) => {
  const [showCompact, setShowCompact] = useState(true);
  const onToggleViewClicked = useCallback(
    () => setShowCompact((prev) => !prev),
    []
  );

  return showCompact ? (
    <CompactStateView {...props} onToggleViewClicked={onToggleViewClicked} />
  ) : (
    <ExpandedView {...props} onToggleViewClicked={onToggleViewClicked} />
  );
});
