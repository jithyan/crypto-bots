import Big from "big.js";
import React from "react";
import { formatIsoDate } from "../../utils/date";
import { AssetStateBadge, LastPurchasePriceBadge } from "./Badges";
import type { IStateProps } from "./Dashboard";
import { PriceTrendIcon } from "./Icons";
import { useUpdateStyleOnCheckIn } from "./useUpdateStyleOnCheckIn";

const cardHasJustBeenUpdatedStyle = "card text-white bg-warning mb-3";

export const ExpandedView = React.memo(ExpandedViewNoMemo);

function ExpandedViewNoMemo({
  lastState,
  lastCheckIn,
  status,
}: IStateProps): JSX.Element {
  const isNotPriceBot = lastState?.state !== "PriceBot";
  const cardNormalStyle =
    status === "ONLINE"
      ? "card bg-light text-dark mb-3"
      : "card text-white bg-secondary mb-3";
  const cardStyle = useUpdateStyleOnCheckIn(lastCheckIn, {
    normalStyle: cardNormalStyle,
    updatedStyle: cardHasJustBeenUpdatedStyle,
  });
  const {
    priceHasDecreased,
    priceHasIncreased,
    sleepStrategy,
    stopLoss,
    minPercentIncreaseForSell,
  } = lastState?.config;

  if (lastState && typeof lastState !== "string") {
    return (
      <div className={cardStyle} style={{ width: "24rem" }}>
        <div className="card-header">
          <strong>{lastState.state}</strong>{" "}
          <AssetStateBadge assetState={lastState.state} />
        </div>
        {isNotPriceBot ? (
          <>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <em>{lastState?.priceTrendState}</em>{" "}
                  <PriceTrendIcon trendState={lastState.priceTrendState} />
                </li>
                <li className="list-group-item">
                  <strong>Last ticker price:</strong> $
                  {new Big(lastState.tickerPrice).round(3).toString()}
                </li>
                {lastState?.state !== "HoldStableAsset" && (
                  <li className="list-group-item">
                    <strong>Last purchase price:</strong>
                    <LastPurchasePriceBadge
                      lastPurchasePrice={lastState.lastPurchasePrice}
                      tickerPrice={lastState.tickerPrice}
                    />
                  </li>
                )}
                <li className="list-group-item">
                  <strong>Last check in:</strong>{" "}
                  <mark>{formatIsoDate(lastCheckIn)}</mark>
                </li>
              </ul>
            </div>
            <div className="card-footer">
              <p>
                Using <mark>{sleepStrategy}</mark> sleep strategy
                <br />
                <small>
                  Inc: {parseFloat(priceHasIncreased).toFixed(4)} | Dec:{" "}
                  {parseFloat(priceHasDecreased).toFixed(4)} | Stop loss:{" "}
                  {(parseFloat(stopLoss) * 100).toFixed(0)}% | Min inc:{" "}
                  {(parseFloat(minPercentIncreaseForSell) * 100 - 100).toFixed(
                    1
                  )}
                  %
                </small>
              </p>
            </div>
          </>
        ) : null}
      </div>
    );
  } else {
    return <span>Unknown</span>;
  }
}
