import React from "react";
import { startupAllBots, shutdownAllBots, shutdownManager } from "./api";

export function ControlPanel({ data }: { data: any[] }) {
  const totalProfit = data
    .reduce(
      (acc, curr) =>
        acc + Number(curr.lastState?.stats?.usdProfitToDate ?? "0"),
      0
    )
    .toFixed(3);

  return (
    <div className="container">
      <div className="row" style={{ paddingBottom: "24px" }}>
        <div className="col">
          <button className="btn btn-outline-info" onClick={startupAllBots}>
            Start all bots
          </button>
        </div>
        <div className="col">
          <button className="btn btn-outline-warning" onClick={shutdownAllBots}>
            Shutdown all bots
          </button>
        </div>
        <div className="col">
          <button className="btn btn-outline-warning" onClick={shutdownManager}>
            Shutdown Manager
          </button>
        </div>
        <div className="col">
          <h4>
            <span
              className={`badge rounded-pill  bg-${
                Number(totalProfit) >= 0 ? "success" : "danger"
              }`}
            >
              Total profit: {totalProfit}
            </span>
          </h4>
        </div>
      </div>
    </div>
  );
}
