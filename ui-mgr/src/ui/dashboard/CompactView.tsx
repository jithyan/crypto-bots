//@ts-ignore
import React, { useEffect, useState, startTransition } from "react";
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

export function useAnimateNumber(
  val: string,
  round: number,
  { steps = 10, ms = 125 }: { steps?: number; ms?: number }
) {
  const [num, setNum] = useState(new Big(val).round(round).toString());

  useEffect(() => {
    if (!new Big(val).round(round).eq(num)) {
      const ids: number[] = [];
      const increment = new Big(num).minus(val).div(steps);

      for (let i = 0; i < steps; i++) {
        const id = setTimeout(() => {
          startTransition(() => {
            setNum((prev) =>
              new Big(prev).add(increment).round(round).toString()
            );
          });
        }, ms);

        ids.push(id);
      }

      return () => ids.forEach((id) => clearTimeout(id));
    }
  }, [val]);

  return num;
}

function CompactViewNoMemo({
  lastState,
  lastCheckIn,
  status,
  symbol,
}: IStateProps) {
  const lastTickerPrice = useAnimateNumber(lastState.tickerPrice, 3, {
    steps: 10,
    ms: 500,
  });
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
