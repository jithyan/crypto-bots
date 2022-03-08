import React, { useState, useEffect, useRef } from "react";
import {
  shutdownAllBots,
  shutdownManager,
  startupAllBots,
  useBotStatus,
} from "./api";
import { TableExample } from "./TableExample";

export function ControlPanel() {
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
        <ControlPanel />
        <TableExample data={data} />
      </main>
    </div>
  );
}

export default App;
