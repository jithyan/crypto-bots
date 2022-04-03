import Big from "big.js";
import React, { PropsWithChildren } from "react";
import type { ThemeColor } from "src/utils/types";
import { formatAsUsd } from "../../utils/format";
import { useAnimateNumber } from "../../utils/useAnimateNumber";

export function Badge({
  children,
  color,
  rounded = false,
  textColor,
  style,
}: PropsWithChildren<{
  color: ThemeColor;
  textColor?: ThemeColor;
  rounded?: boolean;
  style?: React.CSSProperties;
}>) {
  const bgColorClass = `bg-${color}`;
  const txtColorClass = textColor ? `text-${textColor}` : "";
  const roundedPillClass = rounded ? "rounded-pill" : "";

  const className = ["badge", bgColorClass, txtColorClass, roundedPillClass]
    .filter(Boolean)
    .join(" ");

  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
}

const holdStableAssetIcon = (
  <Badge style={{ margin: "1px" }} rounded={true} color="secondary">
    S
  </Badge>
);
const orderPlacedIcon = (
  <Badge style={{ margin: "1px" }} rounded={true} color="warning">
    O
  </Badge>
);
const holdVolatileAssetIcon = (
  <Badge style={{ margin: "1px" }} rounded={true} color="primary">
    V
  </Badge>
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
  }: Record<"lastPurchasePrice" | "tickerPrice", string | undefined>) => {
    if (!tickerPrice || !lastPurchasePrice) {
      console.error("PctChangeBadge called with no required args", {
        lastPurchasePrice,
        tickerPrice,
      });
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
      <Badge
        style={{ margin: "1px" }}
        rounded={true}
        color="light"
        textColor={purchasePriceBgColor}
      >
        {pctChange}%
      </Badge>
    );
  }
);

export const LastPurchasePriceBadge = React.memo(
  ({
    lastPurchasePrice,
    tickerPrice,
  }: Record<"lastPurchasePrice" | "tickerPrice", string | undefined>) => {
    if (!tickerPrice || !lastPurchasePrice) {
      console.error("LastPurchasePriceBadge called with no required args", {
        lastPurchasePrice,
        tickerPrice,
      });
      return null;
    }

    const lastPurchasePriceAsBig = new Big(lastPurchasePrice);
    const purchasePriceBgColor = getBgColorFromPriceDifference({
      lastPurchasePrice: lastPurchasePriceAsBig,
      tickerPrice: new Big(tickerPrice),
    });

    return (
      <Badge style={{ margin: "1px" }} color={purchasePriceBgColor}>
        {formatAsUsd(lastPurchasePriceAsBig.toString(), 3)}
      </Badge>
    );
  }
);
