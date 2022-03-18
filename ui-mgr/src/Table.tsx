import React, { useState, useLayoutEffect } from "react";
import { useTable } from "react-table";

const cardHasJustBeenUpdatedStyle = "card text-white bg-warning mb-3";

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

function Td({ children, cell }: any) {
  const style: Partial<Record<"backgroundColor", string>> = {};

  if (cell.column.Header?.toString() === "Profit to Date") {
    if (cell.value.startsWith("-")) {
      style.backgroundColor = "red";
    } else {
      style.backgroundColor = "green";
    }
  }

  if (cell.column.Header?.toString() === "Status") {
    if (cell.value === "ONLINE") {
      style.backgroundColor = "#28a745";
    } else if (cell.value === "OFFLINE") {
      style.backgroundColor = "grey";
    } else if (cell.value === "SHUTTING DOWN" || cell.value === "STARTING UP") {
      style.backgroundColor = "#ffc107";
    } else if (cell.value === "NOT WORKING") {
      style.backgroundColor = "#dc3545";
    }
  }

  return (
    <td {...cell.getCellProps()} style={style}>
      {cell.render("Cell")}
    </td>
  );
}

export function Table({ data, columns }: any) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <table
      className="table table-sm table-dark table-hover"
      style={{ borderTop: "thin solid grey" }}
      {...getTableProps()}
    >
      <thead className="thead-dark">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th scope="col" {...column.getHeaderProps()}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td key={cell.getCellProps().key} cell={cell} />
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
