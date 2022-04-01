import Big from "big.js";
import React from "react";
import { formatAsUsd } from "../../utils/format";
import { useAnimateNumber } from "../../utils/useAnimateNumber";
import type { IStateProps } from "./Dashboard";

const holdStableAssetIcon = (
  <span style={{ margin: "1px" }} className="badge rounded-pill bg-secondary">
    S
  </span>
);
const orderPlacedIcon = (
  <span style={{ margin: "1px" }} className="badge rounded-pill bg-warning">
    O
  </span>
);
const holdVolatileAssetIcon = (
  <span style={{ margin: "1px" }} className="badge rounded-pill bg-primary">
    V
  </span>
);

export const AssetStateBadge = React.memo(
  ({ assetState }: { assetState: string }) => {
    if (assetState.includes("HoldStable")) {
      return holdStableAssetIcon;
    } else if (assetState.includes("Order")) {
      return orderPlacedIcon;
    } else {
      return holdVolatileAssetIcon;
    }
  }
);

function getBgColorFromPriceDifference({
  lastPurchasePrice,
  tickerPrice,
}: {
  lastPurchasePrice: Big;
  tickerPrice: Big;
}) {
  if (lastPurchasePrice.eq(tickerPrice)) {
    return "secondary";
  } else if (lastPurchasePrice.lt(tickerPrice)) {
    return "success";
  } else {
    return "danger";
  }
}

export const PctChangeBadge = React.memo(
  ({
    lastPurchasePrice,
    tickerPrice,
  }: Pick<IStateProps["lastState"], "lastPurchasePrice" | "tickerPrice">) => {
    if (!tickerPrice || !lastPurchasePrice) {
      return null;
    }

    const lastTickerPriceAsBig = new Big(tickerPrice);
    const lastPurchasePriceAsBig = new Big(lastPurchasePrice);
    const purchasePriceBgColor = getBgColorFromPriceDifference({
      lastPurchasePrice: lastPurchasePriceAsBig,
      tickerPrice: lastTickerPriceAsBig,
    });

    const pctChange = useAnimateNumber(
      new Big("1")
        .minus(lastTickerPriceAsBig.div(lastPurchasePriceAsBig))
        .mul("-100")
        .toString(),
      2
    );

    return (
      <span
        style={{ margin: "1px" }}
        className={`badge rounded-pill bg-light text-${purchasePriceBgColor}`}
      >
        {pctChange}%
      </span>
    );
  }
);

export const LastPurchasePriceBadge = React.memo(
  ({
    lastPurchasePrice,
    tickerPrice,
  }: Pick<IStateProps["lastState"], "lastPurchasePrice" | "tickerPrice">) => {
    if (!tickerPrice || !lastPurchasePrice) {
      return null;
    }

    const lastPurchasePriceAsBig = new Big(lastPurchasePrice);
    const purchasePriceBgColor = getBgColorFromPriceDifference({
      lastPurchasePrice: lastPurchasePriceAsBig,
      tickerPrice: new Big(tickerPrice),
    });

    return (
      <span
        style={{ margin: "1px" }}
        className={`badge bg-${purchasePriceBgColor}`}
      >
        {formatAsUsd(lastPurchasePriceAsBig.toString(), 3)}
      </span>
    );
  }
);
