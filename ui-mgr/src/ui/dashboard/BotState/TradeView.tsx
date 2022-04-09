import React from "react";
import {
  selectorFamily,
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
} from "recoil";
import { TChangeViewState } from "./BotState";
import { ToggleTradeViewButton } from "./ToggleTradeViewButton";
import { ErrorBoundary } from "react-error-boundary";
import axios from "axios";
import Big from "big.js";
import { Badge } from "../Badges";

export interface ITradeStatsResponse extends IAggregateTradeStats {
  trades: ITradeResponse;
}
export type IAggregateTradeStats = Record<
  "numSold" | "numProfitableTrades",
  string
>;
export type ITradeResponse = Record<
  "timestamp" | "action" | "price" | "value" | "profit" | "amount",
  string
>[];

export const getTradeStats = selectorFamily<ITradeStatsResponse, string>({
  key: "getTradeStats",
  get: (symbol: string) => () =>
    axios
      .get<ITradeStatsResponse>(
        `http://35.243.104.152:2000/db/tradestats/${symbol}`
      )
      .then((resp) => resp.data),
});

const spinner = (
  <div
    className="text-center"
    style={{ paddingTop: "4px", paddingBottom: "4px" }}
  >
    <div
      style={{ margin: "4px" }}
      className="spinner-grow text-primary"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
    <div
      style={{ margin: "4px" }}
      className="spinner-grow text-secondary"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
    <div
      style={{ margin: "4px" }}
      className="spinner-grow text-success"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export const TradeView = React.memo(
  (props: { changeViewState: TChangeViewState; symbol: string }) => {
    return (
      <ErrorBoundary
        fallback={
          <div
            className={"card bg-danger text-light mb-3"}
            style={{ width: "24rem" }}
          >
            <div className="card-header">
              <ToggleTradeViewButton
                state="back"
                onClick={() => props.changeViewState("compact")}
              />
              Something went wrong loading trade data
            </div>
          </div>
        }
      >
        <React.Suspense fallback={spinner}>
          <TradeViewContainer {...props} />
        </React.Suspense>
      </ErrorBoundary>
    );
  }
);

function RefreshButton(props: { onClick: () => void }) {
  return (
    <Badge
      color="light"
      textColor="info"
      border={true}
      style={{ padding: "2px", marginRight: "4px" }}
      onClick={props.onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-arrow-clockwise"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
        />
        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
      </svg>
    </Badge>
  );
}

export function TradeViewContainer({
  symbol,
  changeViewState,
}: {
  changeViewState: TChangeViewState;
  symbol: string;
}) {
  const stats = useRecoilValue(getTradeStats(symbol));
  const refreshTradeStats = useRecoilRefresher_UNSTABLE(getTradeStats(symbol));

  return (
    <div className={"card bg-light text-dark mb-3"} style={{ width: "24rem" }}>
      <div className="card-header">
        <ToggleTradeViewButton
          state="back"
          onClick={() => changeViewState("compact")}
        />
        <RefreshButton onClick={refreshTradeStats} />
        <strong>Today's trades</strong>
      </div>
      <div className="card-body">
        <TodaysTrades {...stats} />
      </div>
      <div className="card-footer">
        <table className="table table-sm">
          <strong>All time stats</strong>
          <tbody>
            <tr>
              <th scope="row">
                <small># Sell trades</small>
              </th>
              <td>
                <small>{stats.numSold}</small>
              </td>
            </tr>

            <tr>
              <th scope="row">
                <small># Profitable sell trades</small>
              </th>
              <td>
                <small>{stats.numProfitableTrades}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TodaysTrades({ trades }: { trades: ITradeResponse }) {
  return (
    <table className="table table-striped table-sm">
      <thead>
        <th>
          <small>Time</small>
        </th>
        <th>
          <small>Action</small>
        </th>
        <th>
          <small>Price</small>
        </th>
        <th>
          <small>Value</small>
        </th>
        <th>
          <small>Profit</small>
        </th>
      </thead>
      <tbody>
        {trades.map(({ timestamp, value, price, profit, action }) => (
          <tr>
            <th scope="row">
              <small>{timestamp.split("T")[1].split(".")[0]}</small>
            </th>
            <td>
              <small>{action}</small>
            </td>
            <td>
              <small>{new Big(price).round(4).toString()}</small>
            </td>
            <td>
              <small>{new Big(value).round(2).toString()}</small>
            </td>
            <td>
              <small>
                {action === "BUY" ? "N/A" : new Big(profit).round(3).toString()}
              </small>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}