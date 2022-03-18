import React, { useLayoutEffect, useState } from "react";
import { ActionButton } from "./helper";
import { Table } from "./Table";

function ArrowUp() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-arrow-up"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"
      />
    </svg>
  );
}

function ArrowUpCircleFill() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-arrow-up-circle-fill"
      viewBox="0 0 16 16"
    >
      <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z" />
    </svg>
  );
}

function ArrowDown() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-arrow-down"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"
      />
    </svg>
  );
}

const columnHeaders = [
  {
    Header: "Symbol",
    accessor: "symbol",
  },
  {
    Header: "Exchange",
    accessor: "exchange",
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

function parseBotData(d: Record<string, any>) {
  return {
    ...d,
    profitToDate: d.lastState?.stats?.usdProfitToDate ?? "0",
    lastState: (
      <CompactView
        status={d.status}
        lastState={d.lastState}
        lastCheckIn={d.lastCheckIn}
      />
    ),
    actions: Object.keys(d.actions).map((action) => (
      <ActionButton
        key={`${d.id}-${action}`}
        id={d.id}
        path={d.actions[action]}
        action={action}
      />
    )),
  };
}

const cardHasJustBeenUpdatedStyle = "card text-white bg-warning mb-3";

function CompactView({ lastState, lastCheckIn, status }: any) {
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
    <ArrowUp />
  ) : (
    <ArrowDown />
  );

  return (
    <ul className="list-group list-group-horizontal">
      <li className="list-group-item">
        <span className="badge bg-info text-dark">{TrendIcon}</span>
        {checkIn}
      </li>
      <li className="list-group-item">
        ${lastTickerPrice}{" "}
        {holdsVolatileAsset && (
          <span className="badge bg-secondary">${lastPurchasePrice}</span>
        )}
      </li>
    </ul>
  );
}

export function LastState({
  lastState,
  lastCheckIn,
  status,
}: any): JSX.Element {
  const isNotPriceBot = lastState.state !== "PriceBot";
  console.log(lastState.state, isNotPriceBot);
  const cardNormalStyle =
    status === "ONLINE"
      ? "card bg-light text-dark mb-3"
      : "card text-white bg-secondary mb-3";
  const [cardStyle, setCardStyle] = useState(cardHasJustBeenUpdatedStyle);
  const [prevKnownCheckIn, setPrevKnownCheckIn] = useState(lastCheckIn);
  const {
    PRICE_HAS_DECREASED_THRESHOLD = "missing",
    PRICE_HAS_INCREASED_THRESHOLD = "missing",
    STOP_LOSS_THRESHOLD = "missing",
  } = lastState?.decisionEngine?.decisionConfig ?? {};

  useLayoutEffect(() => {
    if (prevKnownCheckIn !== lastCheckIn) {
      setCardStyle(() => cardHasJustBeenUpdatedStyle);
      setPrevKnownCheckIn(lastCheckIn);
    }
    const id = setTimeout(() => {
      setCardStyle(() => cardNormalStyle);
    }, 5000);
    return () => clearTimeout(id);
  }, [lastCheckIn]);

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
                  <strong>Last ticker price:</strong>{" "}
                  {parseFloat(
                    lastState?.decisionEngine?.lastTickerPrice
                  ).toFixed(3)}
                </li>
                {lastState?.state !== "HoldStableAsset" && (
                  <li className="list-group-item">
                    <strong>Last purchase price:</strong>{" "}
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
                  Stop loss: {parseFloat(STOP_LOSS_THRESHOLD) * 100}%
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
