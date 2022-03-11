import React, { useState, useEffect, useRef } from "react";
import {
  shutdownAllBots,
  shutdownManager,
  startupAllBots,
  useBotStatus,
} from "./api";
import { TableExample } from "./TableExample";

export function ControlPanel({ data }: { data: any[] }) {
  const totalProfit = data
    .reduce((acc, curr) => acc + Number(curr.profitToDate), 0)
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
                totalProfit >= 0 ? "success" : "danger"
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

function App() {
  const data = useBotStatus();

  return (
    <div className="container-fluid px-4">
      <header>
        <h1 style={{ color: "whitesmoke", paddingBottom: "32px" }}>
          Bot Manager
        </h1>
      </header>
      <main>
        <ControlPanel data={data} />
        <TableExample data={data} />
      </main>
    </div>
  );
}

export default App;
