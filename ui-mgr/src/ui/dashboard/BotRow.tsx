import React, { useState, startTransition, useLayoutEffect } from "react";
import { formatAsUsd, formatIsoDate } from "../../utils/format";
import { useIsUpdatingOnChange } from "./useIsUpdatingOnChange";
import { Badge } from "./Badges";
import { useAnimateNumber } from "../../utils/useAnimateNumber";
import { getBotInfo, useBotDetails } from "../../state";
import { ActionsMenu } from "./ActionsMenu";
import { BotState } from "./BotState";
import { BotUpdateCountdown } from "./BotUpdateCountdown";
import { ErrorBoundary } from "react-error-boundary";

interface IBotRowProps {
  id: string;
  index: number;
}

const errorRow = (
  <div className="row" style={{ padding: "4px" }}>
    <ul className={`list-group border border-dark list-group-horizontal`}>
      <li className={`list-group-item flex-fill bg-danger text-light`}>
        Something went wrong.
      </li>
    </ul>
  </div>
);

export function BotRow(props: IBotRowProps) {
  return (
    <ErrorBoundary fallback={errorRow}>
      <BotRowNoErrorBoundary {...props} />
    </ErrorBoundary>
  );
}

function useHighlightOnMount(): boolean {
  const [highlightOnMount, setHighlightOnMount] = useState(true);

  useLayoutEffect(() => {
    setTimeout(() => {
      startTransition(() => setHighlightOnMount(false));
    }, 1000);
  }, []);

  return highlightOnMount;
}

function BotSymbolAndIndex({
  index,
  symbol,
}: {
  index: number;
  symbol: string;
}) {
  const highlightOnMount = useHighlightOnMount();

  return (
    <>
      <small>
        <Badge
          style={{ marginRight: "4px" }}
          rounded={true}
          color={highlightOnMount ? "light" : "dark"}
          textColor={highlightOnMount ? "dark" : "light"}
        >
          <strong>{index}</strong>
        </Badge>
      </small>
      <span
        className={`text-${highlightOnMount ? "warning" : "light"}`}
        style={{ paddingTop: "8px" }}
      >
        {symbol}
      </span>
    </>
  );
}

export function BotHeader() {
  return (
    <Row>
      <Col
        minWidth="128px"
        width="168px"
        classNames={"bg-secondary text-light border-dark"}
      >
        Bot Symbol
      </Col>
      <Col
        minWidth="104px"
        width="144px"
        classNames={"bg-secondary text-light border-dark"}
      >
        Status
      </Col>
      <Col
        minWidth="92px"
        width="104px"
        classNames={"bg-secondary text-light border-dark"}
      >
        Version
      </Col>
      <Col width="86px" classNames={"bg-secondary text-light border-dark"}>
        Profit
      </Col>
      <Col
        minWidth="128px"
        width="152px"
        classNames={"bg-secondary text-light border-dark"}
      >
        Last check in
      </Col>
      <Col
        minWidth="76px"
        width="76px"
        classNames={"bg-secondary text-light border-dark"}
      >
        Actions
      </Col>
      <Col minWidth="128px" classNames={"bg-secondary text-light border-dark"}>
        State
      </Col>
    </Row>
  );
}

const BotRowNoErrorBoundary = React.memo(({ id, index }: IBotRowProps) => {
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

  return (
    <Row>
      <Col minWidth="128px" width="168px" classNames={bgStyle}>
        <BotSymbolAndIndex index={index} symbol={symbol} />
      </Col>

      <Col
        bgColor={statusBgColor}
        minWidth="104px"
        width="144px"
        classNames={"text-light"}
      >
        {status}
      </Col>

      <Col minWidth="92px" width="104px" classNames={bgStyle}>
        {version}
      </Col>

      <Col width="86px" classNames={`${profitBgColor} text-light`}>
        <Profit value={lastState.profit} />
      </Col>

      <Col minWidth="128px" width="152px" classNames={bgStyle}>
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
      </Col>

      <Col minWidth="76px" width="76px" classNames={bgStyle}>
        <ActionsMenu id={id} actions={actions} />
      </Col>

      <Col minWidth="128px" classNames={bgStyle}>
        <BotState
          lastCheckIn={getBotInfo(bot, "lastCheckIn")}
          status={status}
          symbol={symbol}
          {...lastState}
        />
      </Col>
    </Row>
  );
});

function Row({ children }: React.PropsWithChildren<{}>) {
  const [borderColor, setBorderColor] = useState("dark");
  const highlightOnMount = useHighlightOnMount();

  return (
    <div
      onMouseEnter={() => startTransition(() => setBorderColor("light"))}
      onMouseLeave={() => startTransition(() => setBorderColor("dark"))}
      className="row"
      style={{ padding: "4px" }}
    >
      <ul
        className={`list-group border border-${
          highlightOnMount ? "secondary" : borderColor
        } list-group-horizontal`}
      >
        {children}
      </ul>
    </div>
  );
}

const Profit = ({ value }: { value: string }) => {
  const profit = useAnimateNumber(value ?? "0", 3);
  return <>{formatAsUsd(profit, 3)}</>;
};

export function Col({
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

export const CheckInAndSleepStrategy = ({
  sleepStrategy,
  checkIn,
}: Record<"sleepStrategy" | "checkIn", string>) => {
  return (
    <small>
      {checkIn}{" "}
      <Badge
        title="How long the bot sleeps between price updates"
        style={{ padding: "1px 2px" }}
        color="secondary"
        textColor="light"
      >
        {sleepStrategy}
      </Badge>
    </small>
  );
};
