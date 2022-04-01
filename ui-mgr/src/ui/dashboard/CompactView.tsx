//@ts-ignore
import React, { useEffect, useState, startTransition } from "react";
import { formatAsUsd, formatIsoDate } from "../../utils/format";
import { PriceTrendIcon } from "./Icons";
import type { IStateProps } from "./Dashboard";
import { useUpdateStyleOnCheckIn } from "./useUpdateStyleOnCheckIn";
import {
  AssetStateBadge,
  LastPurchasePriceBadge,
  PctChangeBadge,
} from "./Badges";
import { useAnimateNumber } from "../../utils/useAnimateNumber";
import { getBotInfo, useBotDetails } from "../../state";
import Big from "big.js";

export const CompactView = React.memo(CompactViewNoMemo);

export function BotRow({ id, index }: { id: string; index: number }) {
  const bot = useBotDetails(id);

  if (!bot) {
    return null;
  }

  const checkIn = formatIsoDate(getBotInfo(bot, "lastCheckIn"));
  const status = getBotInfo(bot, "status");
  const symbol = getBotInfo(bot, "symbol");
  const lastState = getBotInfo(bot, "state");
  const version = getBotInfo(bot, "version");
  const profit = useAnimateNumber(lastState.profit ?? "0", 3);

  const sleepStrategy = lastState.state?.includes("Stasis")
    ? "1hr"
    : lastState.config.sleepStrategy;

  const bgStyle = useUpdateStyleOnCheckIn(checkIn, {
    normalStyle: "bg-dark text-light",
    updatedStyle: "bg-light",
  });

  let statusBgColor = "";
  if (status === "ONLINE") {
    statusBgColor = "#459457";
  } else if (status === "OFFLINE") {
    statusBgColor = "grey";
  } else if (status === "SHUTTING DOWN" || status === "STARTING UP") {
    statusBgColor = "#ffc412";
  } else if (status === "NOT WORKING") {
    statusBgColor = "#dc3545";
  }

  const profitBgColor = profit.startsWith("-") ? "bg-danger" : "bg-success";

  return (
    <div className="row" style={{ padding: "4px" }}>
      <ul className="list-group border border-dark list-group-horizontal">
        <BotColItem minWidth="128px" width="168px" classNames={bgStyle}>
          <small>
            <span
              style={{ marginRight: "4px" }}
              className="badge rounded-pill bg-dark text-light"
            >
              <strong>{index}</strong>
            </span>
          </small>
          <span style={{ paddingTop: "8px" }}>{symbol}</span>
        </BotColItem>
        <BotColItem
          bgColor={statusBgColor}
          minWidth="104px"
          width="144px"
          classNames={"text-light"}
        >
          {status}
        </BotColItem>
        <BotColItem minWidth="92px" width="104px" classNames={bgStyle}>
          {version}
        </BotColItem>
        <BotColItem width="96px" classNames={`${profitBgColor} text-light`}>
          {formatAsUsd(profit, 3)}
        </BotColItem>
        <BotColItem width="160px" classNames={bgStyle}>
          <CheckInAndSleepStrategy
            sleepStrategy={sleepStrategy}
            checkIn={checkIn}
          />
        </BotColItem>
        <BotColItem minWidth="128px" classNames={bgStyle}>
          <BotState
            tickerPrice={lastState?.tickerPrice ?? ""}
            assetState={lastState?.state}
            priceTrendState={lastState?.priceTrendState}
            symbol={symbol}
            lastPurchasePrice={lastState?.lastPurchasePrice ?? ""}
          />
        </BotColItem>
      </ul>
    </div>
  );
}

function BotState({
  priceTrendState,
  assetState,
  tickerPrice,
  lastPurchasePrice,
  symbol,
}: {
  symbol: string;
  priceTrendState: string;
  assetState: string;
  tickerPrice: string;
  lastPurchasePrice: string;
}) {
  const holdsVolatileAsset = assetState.includes("Volatile");
  const formattedTickerPrice = useAnimateNumber(tickerPrice, 3);

  const isPriceBot = symbol === "PRICEBOT";

  if (isPriceBot) {
    return null;
  } else if (assetState.includes("Stasis")) {
    return (
      <span className="badge bg-dark text-light">Zzz.. {4 - 1}h left</span>
    );
  }

  return (
    <>
      {" "}
      <AssetStateBadge assetState={assetState} />{" "}
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

export function BotColItem({
  bgColor,
  width,
  children,
  classNames = "",
  minWidth,
}: React.PropsWithChildren<{
  classNames?: string;
  width?: string;
  minWidth?: string;
  bgColor?: string;
}>) {
  return (
    <li
      style={{ maxWidth: width, minWidth, backgroundColor: bgColor }}
      className={`list-group-item flex-fill ${classNames}`}
    >
      {children}
    </li>
  );
}

function CompactViewNoMemo({ id, index }: IStateProps) {
  const bot = useBotDetails(id);

  if (!bot) {
    return null;
  }

  const lastCheckIn = getBotInfo(bot, "lastCheckIn");
  const status = getBotInfo(bot, "status");
  const symbol = getBotInfo(bot, "symbol");
  const lastState = getBotInfo(bot, "state");
  const version = getBotInfo(bot, "version");
  const profit = lastState.profit ?? "0";

  const lastTickerPrice = useAnimateNumber(lastState.tickerPrice, 3);
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
        <li className={`list-group-item ${bgStyle}`}>{index}</li>
        <li className={`list-group-item ${bgStyle}`}>{symbol}</li>
        <li className={`list-group-item ${bgStyle}`}>{status}</li>
        <li className={`list-group-item ${bgStyle}`}>{version}</li>

        <li className={`list-group-item ${bgStyle}`}>
          <AssetStateBadge assetState={lastState.state} />{" "}
          <PriceTrendIcon trendState={lastState.priceTrendState} /> $
          {lastTickerPrice}{" "}
          {holdsVolatileAsset && (
            <>
              <LastPurchasePriceBadge
                lastPurchasePrice={lastState.lastPurchasePrice}
                tickerPrice={lastState.tickerPrice}
              />{" "}
              <PctChangeBadge
                lastPurchasePrice={lastState.lastPurchasePrice}
                tickerPrice={lastState.tickerPrice}
              />{" "}
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
        {checkIn}{" "}
        <span
          style={{ padding: "1px 2px" }}
          className="bg-secondary text-light"
        >
          {sleepStrategy}
        </span>
      </small>
    );
  }
);
