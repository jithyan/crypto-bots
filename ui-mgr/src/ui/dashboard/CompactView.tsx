//@ts-ignore
import React, { useEffect, useState, startTransition } from "react";
import { formatAsUsd, formatIsoDate } from "../../utils/format";
import { PriceTrendIcon, ThreeDotsVertical } from "./Icons";
import type { IStateProps } from "./Dashboard";
import { useUpdateStyleOnCheckIn } from "./useUpdateStyleOnCheckIn";
import {
  AssetStateBadge,
  LastPurchasePriceBadge,
  PctChangeBadge,
} from "./Badges";
import { useAnimateNumber } from "../../utils/useAnimateNumber";
import { getBotInfo, useBotDetails } from "../../state";
import type { TBotActions } from "common-util";
import { ActionButton } from "./ActionButton";
import { ExpandedView } from "./ExpandedView";
import { parseISO, formatDistanceStrict, add, isEqual } from "date-fns";

export function TillNextUpdateCountdown({
  sleepStrategy,
  checkInIsoDate,
  status,
}: {
  sleepStrategy: "3m" | "6m" | "9m" | "15m" | "30m" | "1hr";
  checkInIsoDate: string;
  status: string;
}) {
  const checkIn = parseISO(checkInIsoDate);
  const addConfig =
    sleepStrategy === "1hr"
      ? { hours: 1 }
      : { minutes: parseInt(sleepStrategy) };

  const nextCheckIn = add(checkIn, addConfig);
  const [nextCheckInFormatted, setNextCheckIn] = useState(
    formatDistanceStrict(new Date(), nextCheckIn, { unit: "second" })
  );

  useEffect(() => {
    if (nextCheckInFormatted !== "0 seconds") {
      const id = setTimeout(
        () =>
          startTransition(() =>
            setNextCheckIn(`${parseInt(nextCheckInFormatted) - 1} seconds`)
          ),
        1000
      );
      return () => clearTimeout(id);
    }
  }, [nextCheckInFormatted]);

  const seconds = `${parseInt(nextCheckInFormatted) % 60}s`;
  const minutes = `${Math.trunc(parseInt(nextCheckInFormatted) / 60)}m`;

  return status !== "OFFLINE" ? (
    <span
      style={{ marginRight: "4px" }}
      className={`badge rounded-pill bg-${
        nextCheckInFormatted === "0 seconds" ? "danger" : "primary"
      } text-light`}
    >
      {`${minutes === "0m" ? "" : `${minutes} `}${seconds}`}
    </span>
  ) : null;
}

export const BotRow = React.memo(
  ({ id, index }: { id: string; index: number }) => {
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
    const actions = getBotInfo(bot, "actions");

    const sleepStrategy = lastState.state?.includes("Stasis")
      ? "1hr"
      : lastState.config.sleepStrategy;

    const bgStyle = useUpdateStyleOnCheckIn(checkIn, {
      normalStyle: "bg-dark text-light",
      updatedStyle: "bg-info",
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

    const [borderColor, setBorderColor] = useState("dark");
    const [showCompact, setShowCompact] = useState(true);

    return (
      <div
        onMouseEnter={() => startTransition(() => setBorderColor("light"))}
        onMouseLeave={() => startTransition(() => setBorderColor("dark"))}
        className="row"
        style={{ padding: "4px" }}
      >
        <ul
          className={`list-group border border-${borderColor} list-group-horizontal`}
        >
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
          <BotColItem width="86px" classNames={`${profitBgColor} text-light`}>
            {formatAsUsd(profit, 3)}
          </BotColItem>
          <BotColItem minWidth="128px" width="152px" classNames={bgStyle}>
            <CheckInAndSleepStrategy
              sleepStrategy={sleepStrategy}
              checkIn={checkIn}
            />
            <TillNextUpdateCountdown
              status={status}
              key={`${id}-${getBotInfo(bot, "lastCheckIn")}-${sleepStrategy}`}
              sleepStrategy={sleepStrategy as any}
              checkInIsoDate={getBotInfo(bot, "lastCheckIn")}
            />
          </BotColItem>
          <BotColItem minWidth="76px" width="76px" classNames={bgStyle}>
            <div className="dropdown">
              <button
                className="btn btn-dark dropdown-toggle text-light"
                type="button"
                id={`${id}-bot-actions`}
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <ThreeDotsVertical />
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby={`${id}-bot-actions`}
              >
                {Object.keys(actions).map((action) => (
                  <li>
                    <ActionButton
                      key={`${id}-${action}`}
                      id={id}
                      path={actions[action as TBotActions] ?? ""}
                      action={action}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </BotColItem>

          <BotColItem
            onClick={() => setShowCompact((prev) => !prev)}
            minWidth="128px"
            classNames={bgStyle}
          >
            {showCompact ? (
              <BotState
                tickerPrice={lastState?.tickerPrice ?? ""}
                assetState={lastState?.state}
                priceTrendState={lastState?.priceTrendState}
                symbol={symbol}
                lastPurchasePrice={lastState?.lastPurchasePrice ?? ""}
              />
            ) : (
              <ExpandedView
                lastCheckIn={getBotInfo(bot, "lastCheckIn")}
                lastState={lastState}
                status={status}
                symbol={symbol}
                index={index}
                id={id}
              />
            )}
          </BotColItem>
        </ul>
      </div>
    );
  }
);

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
  onClick,
}: React.PropsWithChildren<{
  classNames?: string;
  width?: string;
  minWidth?: string;
  bgColor?: string;
  onClick?: () => void;
}>) {
  return (
    <li
      onClick={onClick}
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
          className="badge rounded-pill bg-secondary text-light"
        >
          {sleepStrategy}
        </span>
      </small>
    );
  }
);
