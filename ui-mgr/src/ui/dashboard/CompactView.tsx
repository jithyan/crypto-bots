import React from "react";
import { formatIsoDate } from "../../utils/date";
import { PriceTrendIcon } from "./Icons";
import type { IStateProps } from "./Dashboard";
import { useUpdateStyleOnCheckIn } from "./useUpdateStyleOnCheckIn";
import {
  AssetStateBadge,
  LastPurchasePriceBadge,
  PctChangeBadge,
} from "./Badges";
import Big from "big.js";

export const CompactView = React.memo(CompactViewNoMemo);

function CompactViewNoMemo({
  lastState,
  lastCheckIn,
  status,
  symbol,
}: IStateProps) {
  const lastTickerPrice = new Big(lastState.tickerPrice).round(3).toString();
  const checkIn = formatIsoDate(lastCheckIn);
  const holdsVolatileAsset = lastState.state === "HoldVolatileAsset";

  const bgStyle = useUpdateStyleOnCheckIn(lastCheckIn, {
    normalStyle: "",
    updatedStyle: "bg-warning",
  });

  if (lastState?.state === "PostSellStasis") {
    return (
      <div>
        <ul className="list-group list-group-horizontal-sm">
          <li className={`list-group-item ${bgStyle}`}>
            <span className="badge bg-dark text-light">
              Zzz.. {4 - lastState.iteration}h left
            </span>
          </li>
          <li className={`list-group-item ${bgStyle}`}>
            <CheckInAndSleepStrategy sleepStrategy={"1h"} checkIn={checkIn} />
          </li>
        </ul>
      </div>
    );
  }

  if (symbol === "PRICEBOT") {
    return (
      <div>
        <ul className="list-group list-group-horizontal-sm">
          <li className={`list-group-item ${bgStyle}`}>
            <CheckInAndSleepStrategy
              sleepStrategy={lastState.config.sleepStrategy}
              checkIn={checkIn}
            />
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div>
      <ul className="list-group list-group-horizontal-sm">
        <li className={`list-group-item ${bgStyle}`}>
          <AssetStateBadge assetState={lastState.state} />{" "}
          <PriceTrendIcon trendState={lastState.priceTrendState} /> $
          {lastTickerPrice}{" "}
          {holdsVolatileAsset && (
            <>
              <LastPurchasePriceBadge
                lastPurchasePrice={lastState.lastPurchasePrice}
                tickerPrice={lastState.tickerPrice}
              />
              <PctChangeBadge
                lastPurchasePrice={lastState.lastPurchasePrice}
                tickerPrice={lastState.tickerPrice}
              />
            </>
          )}
        </li>
        <li className={`list-group-item ${bgStyle}`}>
          <CheckInAndSleepStrategy
            sleepStrategy={lastState.config.sleepStrategy}
            checkIn={checkIn}
          />
        </li>
      </ul>
    </div>
  );
}

export const CheckInAndSleepStrategy = React.memo(
  ({ sleepStrategy, checkIn }: Record<"sleepStrategy" | "checkIn", string>) => {
    return (
      <small>
        {checkIn} <mark>{sleepStrategy}</mark>
      </small>
    );
  }
);
