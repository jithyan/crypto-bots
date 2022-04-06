//@ts-ignore
import React, { useState, startTransition } from "react";
import { formatAsUsd, formatIsoDate } from "../../utils/format";
import { useIsUpdatingOnChange } from "./useIsUpdatingOnChange";
import { Badge } from "./Badges";
import { useAnimateNumber } from "../../utils/useAnimateNumber";
import { getBotInfo, useBotDetails } from "../../state";
import { ActionsMenu } from "./ActionsMenu";
import { BotState } from "./BotState";
import { BotUpdateCountdown } from "./BotUpdateCountdown";

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
    const actions = getBotInfo(bot, "actions");

    const sleepStrategy = lastState.state?.includes("Stasis")
      ? "1hr"
      : lastState.config.sleepStrategy;

    const isUpdating = useIsUpdatingOnChange(checkIn);
    const bgStyle = isUpdating ? "bg-info" : "bg-dark text-light";

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

    const profitBgColor = lastState.profit?.startsWith("-")
      ? "bg-danger"
      : "bg-success";

    const [borderColor, setBorderColor] = useState("dark");

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
              <Badge
                style={{ marginRight: "4px" }}
                rounded={true}
                color="dark"
                textColor="light"
              >
                <strong>{index}</strong>
              </Badge>
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
            <Profit value={lastState.profit} />
          </BotColItem>

          <BotColItem minWidth="128px" width="152px" classNames={bgStyle}>
            <CheckInAndSleepStrategy
              sleepStrategy={sleepStrategy}
              checkIn={checkIn}
            />
            <BotUpdateCountdown
              status={status}
              key={`${id}-${getBotInfo(bot, "lastCheckIn")}-${sleepStrategy}`}
              sleepStrategy={sleepStrategy as any}
              checkInIsoDate={getBotInfo(bot, "lastCheckIn")}
            />
          </BotColItem>

          <BotColItem minWidth="76px" width="76px" classNames={bgStyle}>
            <ActionsMenu id={id} actions={actions} />
          </BotColItem>

          <BotColItem minWidth="128px" classNames={bgStyle}>
            <BotState
              lastCheckIn={getBotInfo(bot, "lastCheckIn")}
              status={status}
              symbol={symbol}
              {...lastState}
            />
          </BotColItem>
        </ul>
      </div>
    );
  }
);

const Profit = React.memo(({ value }: { value: string }) => {
  const profit = useAnimateNumber(value ?? "0", 3);
  return <>{formatAsUsd(profit, 3)}</>;
});

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

export const CheckInAndSleepStrategy = React.memo(
  ({ sleepStrategy, checkIn }: Record<"sleepStrategy" | "checkIn", string>) => {
    return (
      <small>
        {checkIn}{" "}
        <Badge
          style={{ padding: "1px 2px" }}
          color="secondary"
          textColor="light"
        >
          {sleepStrategy}
        </Badge>
      </small>
    );
  }
);
