import React from "react";
import type { IBotStateDetails } from "common-util";
import { formatAsUsd } from "../../../utils/format";
import { useAnimateNumber } from "../../../utils/useAnimateNumber";
import {
  AssetStateBadge,
  Badge,
  LastPurchasePriceBadge,
  PctChangeBadge,
} from "../Badges";
import { PriceTrendIcon } from "../Icons";
import { StateErrorBoundary } from "./BotStateErrorBoundary";
import { ToggleStateButton } from "./ToggleStateViewButton";

export function CompactStateView({
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
      <StateErrorBoundary>
        <ToggleStateButton
          onToggleViewClicked={onToggleViewClicked}
          state="expand"
        />
        <Badge color="dark" textColor="light">
          Zzz.. {4 - iteration!}h left
        </Badge>
      </StateErrorBoundary>
    );
  }

  return (
    <StateErrorBoundary>
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
    </StateErrorBoundary>
  );
}
