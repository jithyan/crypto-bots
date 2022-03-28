import type { IBotInfoStream, TBotActions } from "common-util";
import React, { useLayoutEffect, useState } from "react";
import { ActionButton } from "./helper";
import { ArrowUpCircleFill, ArrowUpCircle, ArrowDownCircle } from "./Icons";
import { Table } from "./Table";

const columnHeaders = [
  {
    Header: "#",
    id: "row",
    maxWidth: 10,
    filterable: false,
    Cell: (rows: any) => {
      return <div>{rows.row.index}</div>;
    },
  },
  {
    Header: "Symbol",
    accessor: "symbol",
  },
  {
    Header: "Version",
    accessor: "version",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Actions",
    accessor: "actions",
  },
  {
    Header: "Last State",
    accessor: "lastState",
  },
  {
    Header: "Profit to Date",
    accessor: "profitToDate",
  },
];

function parseBotData(d: IBotInfoStream) {
  return {
    ...d,
    profitToDate: d.lastState?.stats?.usdProfitToDate ?? "0",
    lastState: (
      <ToggleOnClick
        status={d.status}
        lastState={d.lastState}
        lastCheckIn={d.lastCheckIn}
        symbol={d.symbol}
      />
    ),
    actions: Object.keys(d.actions).map((action) => (
      <ActionButton
        key={`${d.id}-${action}`}
        id={d.id}
        path={d.actions[action as TBotActions] ?? ""}
        action={action}
      />
    )),
  };
}

const cardHasJustBeenUpdatedStyle = "card text-white bg-warning mb-3";

function ToggleOnClick(props: any) {
  const [showCompact, setShowCompact] = useState(true);

  return (
    <div onClick={() => setShowCompact((prev) => !prev)}>
      {showCompact ? <CompactView {...props} /> : <LastState {...props} />}
    </div>
  );
}

function CompactView({
  lastState,
  lastCheckIn,
  status,
  symbol,
}: IBotInfoStream) {
  const lastTickerPrice = parseFloat(
    lastState?.decisionEngine?.lastTickerPrice
  ).toFixed(3);

  const checkIn = new Date(lastCheckIn)
    .toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
    })
    .split(", ")[1];

  const holdsVolatileAsset = lastState.state === "HoldVolatileAsset";

  const lastPurchasePrice = parseFloat(
    lastState?.decisionEngine?.lastPurchasePrice
  ).toFixed(3);

  const trendState = lastState?.decisionEngine?.state?.toLowerCase() ?? "";

  const TrendIcon = trendState.includes("confirm") ? (
    <ArrowUpCircleFill />
  ) : trendState.startsWith("up") ? (
    <ArrowUpCircle />
  ) : (
    <ArrowDownCircle />
  );

  const bgStyle = useUpdateStyleOnCheckIn(lastCheckIn, {
    normalStyle: "",
    updatedStyle: "bg-warning",
  });

  if (lastState.state === "PostSellStasis") {
    return (
      <div>
        <ul className="list-group list-group-horizontal-sm">
          <li className={`list-group-item ${bgStyle}`}>
            <span className="badge bg-dark text-light">
              Zzz.. {4 - lastState.iteration}h left
            </span>
          </li>
          <li className={`list-group-item ${bgStyle}`}>
            {checkIn} <mark>1h</mark>
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
            <small>{checkIn}</small>
          </li>
        </ul>
      </div>
    );
  }

  const HoldAsset = <span className="badge rounded-pill bg-primary">H</span>;
  const OrderPlaced = (
    <span className="badge rounded-pill bg-secondary">O</span>
  );

  const assetState = lastState.state.includes("Hold") ? HoldAsset : OrderPlaced;

  const purchasePriceBgColor =
    lastPurchasePrice === lastTickerPrice
      ? "secondary"
      : Number(lastPurchasePrice) < Number(lastTickerPrice)
      ? "success"
      : "danger";

  const pctChange =
    (1 - Number(lastTickerPrice) / Number(lastPurchasePrice)) * -100;

  return (
    <div>
      <ul className="list-group list-group-horizontal-sm">
        <li className={`list-group-item ${bgStyle}`}>
          {assetState} {TrendIcon} ${lastTickerPrice}{" "}
          {holdsVolatileAsset && (
            <>
              <span className={`badge bg-${purchasePriceBgColor}`}>
                ${lastPurchasePrice}
              </span>
              <span
                className={`badge rounded-pill bg-light text-${purchasePriceBgColor}`}
              >
                {pctChange.toFixed(2)}%
              </span>
            </>
          )}
        </li>
        <li className={`list-group-item ${bgStyle}`}>
          <small>
            {checkIn} <mark>{lastState?.sleep?.sleepStrategy}</mark>
          </small>
        </li>
      </ul>
    </div>
  );
}

function useUpdateStyleOnCheckIn(
  lastCheckIn: string,
  { normalStyle, updatedStyle }: { normalStyle: string; updatedStyle: string }
) {
  const [style, setStyle] = useState(normalStyle);
  const [prevKnownCheckIn, setPrevKnownCheckIn] = useState(lastCheckIn);

  useLayoutEffect(() => {
    if (prevKnownCheckIn !== lastCheckIn) {
      setStyle(() => updatedStyle);
      setPrevKnownCheckIn(lastCheckIn);
    }
    const id = setTimeout(() => {
      setStyle(() => normalStyle);
    }, 5000);
    return () => clearTimeout(id);
  }, [lastCheckIn]);

  return style;
}

export function LastState({
  lastState,
  lastCheckIn,
  status,
}: IBotInfoStream): JSX.Element {
  const isNotPriceBot = lastState.state !== "PriceBot";
  console.log(lastState.state, isNotPriceBot);
  const cardNormalStyle =
    status === "ONLINE"
      ? "card bg-light text-dark mb-3"
      : "card text-white bg-secondary mb-3";
  const cardStyle = useUpdateStyleOnCheckIn(lastCheckIn, {
    normalStyle: cardNormalStyle,
    updatedStyle: cardHasJustBeenUpdatedStyle,
  });
  const {
    PRICE_HAS_DECREASED_THRESHOLD = "missing",
    PRICE_HAS_INCREASED_THRESHOLD = "missing",
    STOP_LOSS_THRESHOLD = "missing",
    MIN_PERCENT_INCREASE_FOR_SELL = "missing",
  } = lastState?.decisionEngine?.decisionConfig ?? {};

  if (lastState && typeof lastState !== "string") {
    return (
      <div className={cardStyle} style={{ width: "18rem" }}>
        <div className="card-header">
          <strong>{lastState.state}</strong>
        </div>
        {isNotPriceBot ? (
          <>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <em>{lastState?.decisionEngine?.state}</em>
                </li>
                <li className="list-group-item">
                  <strong>Last ticker price:</strong> $
                  {parseFloat(
                    lastState?.decisionEngine?.lastTickerPrice
                  ).toFixed(3)}
                </li>
                {lastState?.state !== "HoldStableAsset" && (
                  <li className="list-group-item">
                    <strong>Last purchase price:</strong> $
                    {parseFloat(
                      lastState?.decisionEngine?.lastPurchasePrice
                    ).toFixed(3)}
                  </li>
                )}
                <li className="list-group-item">
                  <strong>Last check in:</strong>{" "}
                  <mark>
                    {
                      new Date(lastCheckIn)
                        .toLocaleString("en-AU", {
                          timeZone: "Australia/Sydney",
                        })
                        .split(", ")[1]
                    }
                  </mark>
                </li>
              </ul>
            </div>
            <div className="card-footer">
              <p>
                Using <mark>{lastState?.sleep?.sleepStrategy}</mark> sleep
                strategy
                <br />
                <small>
                  Inc: {parseFloat(PRICE_HAS_INCREASED_THRESHOLD).toFixed(4)} |
                  Dec: {parseFloat(PRICE_HAS_DECREASED_THRESHOLD).toFixed(4)} |
                  Stop loss:{" "}
                  {(parseFloat(STOP_LOSS_THRESHOLD) * 100).toFixed(0)}% | Min
                  inc:{" "}
                  {(
                    parseFloat(MIN_PERCENT_INCREASE_FOR_SELL) * 100 -
                    100
                  ).toFixed(1)}
                  %
                </small>
              </p>
            </div>
          </>
        ) : null}
      </div>
    );
  } else {
    return <span>Unknown</span>;
  }
}

export function Dashboard({ data }: any) {
  return (
    <>
      <Table columns={columnHeaders} data={data.map(parseBotData)} />
    </>
  );
}
