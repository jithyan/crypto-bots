import Big from "big.js";
import type { IBotStateDetails, TBotStatus } from "common-util";
import React, { useCallback, useMemo, useState } from "react";
import { formatAsUsd, formatPct } from "../../utils/format";
import { useAnimateNumber } from "../../utils/useAnimateNumber";
import {
  Badge,
  AssetStateBadge,
  LastPurchasePriceBadge,
  PctChangeBadge,
} from "./Badges";
import { collapseIcon, expandIcon, PriceTrendIcon } from "./Icons";
import { useIsUpdatingOnChange } from "./useIsUpdatingOnChange";

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

const ToggleStateButton = React.memo(
  ({
    state,
    onToggleViewClicked,
  }: {
    state: "expand" | "collapse";
    onToggleViewClicked: () => void;
  }) =>
    state === "expand" ? (
      <Badge
        color="dark"
        textColor="light"
        border={true}
        onClick={onToggleViewClicked}
        style={{ marginRight: "8px", padding: "2px" }}
      >
        {expandIcon}
      </Badge>
    ) : (
      <Badge
        color="light"
        textColor="dark"
        border={true}
        onClick={onToggleViewClicked}
        style={{ marginRight: "8px", padding: "2px" }}
      >
        {collapseIcon}
      </Badge>
    )
);

function CompactStateView({
  priceTrendState = "",
  state = "",
  tickerPrice = "",
  lastPurchasePrice = "",
  symbol,
  iteration,
  onToggleViewClicked,
}: {
  symbol: string;
  onToggleViewClicked: () => void;
} & IBotStateDetails) {
  const holdsVolatileAsset = state.includes("Volatile");
  const formattedTickerPrice = useAnimateNumber(tickerPrice, 3);

  const isPriceBot = symbol === "PRICEBOT";

  if (isPriceBot) {
    return null;
  } else if (state.includes("Stasis")) {
    return (
      <>
        <ToggleStateButton
          onToggleViewClicked={onToggleViewClicked}
          state="expand"
        />
        <Badge color="dark" textColor="light">
          Zzz.. {4 - iteration!}h left
        </Badge>
      </>
    );
  }

  return (
    <>
      <ToggleStateButton
        onToggleViewClicked={onToggleViewClicked}
        state="expand"
      />
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

export const ExpandedView = React.memo(
  ({
    state,
    lastPurchasePrice,
    config,
    priceTrendState,
    tickerPrice,
    lastCheckIn,
    status,
    iteration,
    onToggleViewClicked,
  }: IBotStateProps & {
    onToggleViewClicked: () => void;
  }): JSX.Element => {
    const isNotPriceBot = state !== "PriceBot";
    const cardNormalStyle =
      status === "ONLINE"
        ? "card bg-light text-dark mb-3"
        : "card text-white bg-secondary mb-3";

    const isUpdating = useIsUpdatingOnChange(lastCheckIn);
    const cardStyle = isUpdating
      ? "card text-white bg-warning mb-3"
      : cardNormalStyle;

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
            <ToggleStateButton
              onToggleViewClicked={onToggleViewClicked}
              state="collapse"
            />
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
                  {state !== "HoldStableAsset" && state !== "PostSellStasis" ? (
                    <>
                      <li className="list-group-item">
                        <strong>Last purchase price:</strong>
                        <LastPurchasePriceBadge
                          lastPurchasePrice={lastPurchasePrice}
                          tickerPrice={tickerPrice}
                        />
                      </li>
                      <li className="list-group-item">
                        <strong>Percent change since last purchase:</strong>

                        <PctChangeBadge
                          lastPurchasePrice={lastPurchasePrice}
                          tickerPrice={tickerPrice}
                        />
                      </li>
                    </>
                  ) : null}
                  {state === "PostSellStasis" ? (
                    <Badge color="dark" textColor="light">
                      Sleeping after selling. {4 - iteration!} hours left
                    </Badge>
                  ) : null}
                </ul>
              </div>
              <div className="card-footer">
                <p>
                  Sleeping every <mark>{sleepStrategy}</mark>
                  <br />
                  <small>
                    Inc: {formatPct(priceHasIncreased, 4)} | Dec:{" "}
                    {formatPct(priceHasDecreased, 4)} | Stop loss:{" "}
                    {Math.trunc(Number(stopLoss) * 100)}% | Min inc:{" "}
                    {formatPct(minPercentIncreaseForSell, 4)} | Max buy: $
                    {maxBuyAmount}
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
