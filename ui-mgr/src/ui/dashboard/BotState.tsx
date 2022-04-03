import Big from "big.js";
import type { IBotStateDetails, TBotStatus } from "common-util";
import React, { useState } from "react";
import { getBotInfo } from "../../state";
import { formatAsUsd, formatIsoDate } from "../../utils/format";
import { useAnimateNumber } from "../../utils/useAnimateNumber";
import {
  Badge,
  AssetStateBadge,
  LastPurchasePriceBadge,
  PctChangeBadge,
} from "./Badges";
import { PriceTrendIcon } from "./Icons";
import { useUpdateStyleOnCheckIn } from "./useUpdateStyleOnCheckIn";

export type IBotStateProps = IBotStateDetails & {
  symbol: string;
  status: TBotStatus;
  lastCheckIn: string;
};

export const BotState = React.memo((props: IBotStateProps) => {
  const [showCompact, setShowCompact] = useState(true);

  return (
    <span onClick={() => setShowCompact((prev) => !prev)}>
      {showCompact ? (
        <CompactStateView {...props} />
      ) : (
        <ExpandedView {...props} />
      )}
    </span>
  );
});

function CompactStateView({
  priceTrendState = "",
  state = "",
  tickerPrice = "",
  lastPurchasePrice = "",
  symbol,
  iteration,
}: {
  symbol: string;
} & IBotStateDetails) {
  const holdsVolatileAsset = state.includes("Volatile");
  const formattedTickerPrice = useAnimateNumber(tickerPrice, 3);

  const isPriceBot = symbol === "PRICEBOT";

  if (isPriceBot) {
    return null;
  } else if (state.includes("Stasis")) {
    return (
      <Badge color="dark" textColor="light">
        Zzz.. {4 - iteration!}h left
      </Badge>
    );
  }

  return (
    <>
      {" "}
      <AssetStateBadge assetState={state} />{" "}
      <PriceTrendIcon trendState={priceTrendState} />{" "}
      <strong>{formatAsUsd(formattedTickerPrice, 3)}</strong>{" "}
      {holdsVolatileAsset ? (
        <>
          <LastPurchasePriceBadge
            lastPurchasePrice={lastPurchasePrice}
            tickerPrice={tickerPrice}
          />{" "}
          <PctChangeBadge
            lastPurchasePrice={lastPurchasePrice}
            tickerPrice={tickerPrice}
          />
        </>
      ) : null}
    </>
  );
}

const cardHasJustBeenUpdatedStyle = "card text-white bg-warning mb-3";

export const ExpandedView = React.memo(
  ({
    state,
    lastPurchasePrice,
    config,
    priceTrendState,
    tickerPrice,
    lastCheckIn,
    status,
  }: IBotStateProps): JSX.Element => {
    const isNotPriceBot = state !== "PriceBot";
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
      maxBuyAmount,
    } = config;

    if (typeof state === "string") {
      return (
        <div className={cardStyle} style={{ width: "24rem" }}>
          <div className="card-header">
            <strong>{state}</strong> <AssetStateBadge assetState={state} />
          </div>
          {isNotPriceBot ? (
            <>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <em>{priceTrendState}</em>{" "}
                    <PriceTrendIcon trendState={priceTrendState} />
                  </li>
                  <li className="list-group-item">
                    <strong>Last ticker price:</strong> $
                    {new Big(tickerPrice).round(3).toString()}
                  </li>
                  {state !== "HoldStableAsset" && (
                    <li className="list-group-item">
                      <strong>Last purchase price:</strong>
                      <LastPurchasePriceBadge
                        lastPurchasePrice={lastPurchasePrice}
                        tickerPrice={tickerPrice}
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
                    {(
                      parseFloat(minPercentIncreaseForSell) * 100 -
                      100
                    ).toFixed(1)}
                    % | Max buy: ${maxBuyAmount}
                  </small>
                </p>
              </div>
            </>
          ) : null}
        </div>
      );
    } else {
      console.error("Invalid state", state);
      return <span>Unknown</span>;
    }
  }
);
