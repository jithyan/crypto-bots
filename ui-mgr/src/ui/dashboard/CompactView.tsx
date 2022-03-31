import React from "react";
import { formatIsoDate } from "../../utils/date";
import { ArrowUpCircleFill, ArrowUpCircle, ArrowDownCircle } from "./Icons";
import type { IStateProps } from "./Dashboard";
import { useUpdateStyleOnCheckIn } from "./useUpdateStyleOnCheckIn";

export const CompactView = React.memo(CompactViewNoMemo);

const PriceTrendIcon = React.memo(({ trendState }: { trendState: string }) => {
  if (trendState.includes("confirm")) {
    return <ArrowUpCircleFill />;
  } else if (trendState.startsWith("up")) {
    return <ArrowUpCircle />;
  } else {
    return <ArrowDownCircle />;
  }
});

const HoldStableAsset = (
  <span className="badge rounded-pill bg-secondary">S</span>
);
const OrderPlaced = <span className="badge rounded-pill bg-warning">O</span>;
const HoldVolatileAsset = (
  <span className="badge rounded-pill bg-primary">V</span>
);

const AssetStateIcon = React.memo(({ assetState }: { assetState: string }) => {
  if (assetState.includes("HoldStable")) {
    return HoldStableAsset;
  } else if (assetState.includes("Order")) {
    return OrderPlaced;
  } else {
    return HoldVolatileAsset;
  }
});

function CompactViewNoMemo({
  lastState,
  lastCheckIn,
  status,
  symbol,
}: IStateProps) {
  const lastTickerPrice = parseFloat(lastState.tickerPrice).toFixed(3);
  const checkIn = formatIsoDate(lastCheckIn);
  const holdsVolatileAsset = lastState.state === "HoldVolatileAsset";
  const lastPurchasePrice = parseFloat(
    lastState.lastPurchasePrice ?? "0"
  ).toFixed(3);
  const trendState = lastState?.priceTrendState?.toLowerCase() ?? "";

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
            {checkIn} <mark>1h</mark>
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
            <small>{checkIn}</small>
          </li>
        </ul>
      </div>
    );
  }

  const purchasePriceBgColor =
    lastPurchasePrice === lastTickerPrice
      ? "secondary"
      : Number(lastPurchasePrice) < Number(lastTickerPrice)
      ? "success"
      : "danger";

  const pctChange =
    (1 - Number(lastTickerPrice) / Number(lastPurchasePrice)) * -100;

  return (
    <div>
      <ul className="list-group list-group-horizontal-sm">
        <li className={`list-group-item ${bgStyle}`}>
          <AssetStateIcon assetState={lastState.state} />{" "}
          <PriceTrendIcon trendState={lastState.priceTrendState} /> $
          {lastTickerPrice}{" "}
          {holdsVolatileAsset && (
            <>
              <span className={`badge bg-${purchasePriceBgColor}`}>
                ${lastPurchasePrice}
              </span>
              <span
                className={`badge rounded-pill bg-light text-${purchasePriceBgColor}`}
              >
                {pctChange.toFixed(2)}%
              </span>
            </>
          )}
        </li>
        <li className={`list-group-item ${bgStyle}`}>
          <small>
            {checkIn} <mark>{lastState?.config?.sleepStrategy}</mark>
          </small>
        </li>
      </ul>
    </div>
  );
}
