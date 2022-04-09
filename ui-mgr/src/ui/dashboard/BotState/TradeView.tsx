import React from "react";
import { selectorFamily, useRecoilValue } from "recoil";
import { TChangeViewState } from "./BotState";
import { ToggleTradeViewButton } from "./ToggleTradeViewButton";
import { ErrorBoundary } from "react-error-boundary";

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

const getTradeStats = selectorFamily<ITradeStatsResponse, string>({
  key: "getTradeStats",
  get: (symbol: string) => async () => {
    await new Promise((res) => setTimeout(res, 1000));
    return Promise.resolve({
      numSold: "10",
      numProfitableTrades: "9",
      trades: [
        {
          timestamp: "12:30PM",
          action: "BUY",
          price: "240",
          value: "24",
          profit: "0",
          amount: "0.1",
        },
        {
          timestamp: "2:30PM",
          action: "SELL",
          amount: "0.1",
          value: "48",
          price: "480",
          profit: "24",
        },
      ],
    });
  },
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

export function TradeView(props: {
  changeViewState: TChangeViewState;
  symbol: string;
}) {
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

export function TradeViewContainer({
  symbol,
  changeViewState,
}: {
  changeViewState: TChangeViewState;
  symbol: string;
}) {
  const stats = useRecoilValue(getTradeStats(symbol));

  return (
    <div className={"card bg-light text-dark mb-3"} style={{ width: "24rem" }}>
      <div className="card-header">
        <ToggleTradeViewButton
          state="back"
          onClick={() => changeViewState("compact")}
        />
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
    <table className="table table-sm">
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
              <small>{timestamp}</small>
            </th>
            <td>
              <small>{action}</small>
            </td>
            <td>
              <small>{price}</small>
            </td>
            <td>
              <small>{value}</small>
            </td>
            <td>
              <small>{profit}</small>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
