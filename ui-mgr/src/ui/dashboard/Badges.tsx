import Big from "big.js";
import React, { PropsWithChildren } from "react";
import type { ThemeColor } from "../../utils/types";
import { formatAsUsd } from "../../utils/format";
import { useAnimateNumber } from "../../utils/useAnimateNumber";

export function Badge({
  children,
  color,
  rounded = false,
  textColor,
  border = false,
  style,
  onClick,
}: PropsWithChildren<{
  color: ThemeColor;
  textColor?: ThemeColor;
  rounded?: boolean;
  style?: React.CSSProperties;
  border?: boolean;
  onClick?: () => void;
}>) {
  const bgColorClass = `bg-${color}`;
  const txtColorClass = textColor ? `text-${textColor}` : "";
  const roundedPillClass = rounded ? "rounded-pill" : "";
  const borderClass = border ? "border" : "";

  const className = [
    "badge",
    bgColorClass,
    txtColorClass,
    roundedPillClass,
    borderClass,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span onClick={onClick} style={style} className={className}>
      {children}
    </span>
  );
}

export const isSimulationIcon = (
  <Badge style={{ margin: "1px" }} rounded={true} color="warning">
    SIM
  </Badge>
);

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
const postSellStasisIcon = (
  <Badge rounded={true} color="dark" textColor="light">
    Zzz..
  </Badge>
);

export const AssetStateBadge = ({ assetState }: { assetState: string }) => {
  if (assetState.includes("HoldStable")) {
    return holdStableAssetIcon;
  } else if (assetState.includes("Order")) {
    return orderPlacedIcon;
  } else if (assetState.includes("Stasis")) {
    return postSellStasisIcon;
  } else {
    return holdVolatileAssetIcon;
  }
};

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

export const PctChangeBadge = ({
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
};

export const LastPurchasePriceBadge = ({
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
};
