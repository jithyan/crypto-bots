import React, { useState, useEffect } from "react";
import { TableExample } from "./TableExample";

function App() {
  return (
    <div className="container-fluid px-4">
      <header>
        <h1 style={{ color: "whitesmoke", paddingBottom: "32px" }}>
          Bot Manager
        </h1>
      </header>
      <main>
        <div className="container">
          <div className="row" style={{ paddingBottom: "24px" }}>
            <div className="col">
              <button className="btn btn-outline-success">
                Refresh bot status
              </button>
            </div>
            <div className="col">
              <button className="btn btn-outline-info">Start all bots</button>
            </div>
            <div className="col">
              <button className="btn btn-outline-warning">
                Shutdown all bots
              </button>
            </div>
          </div>
        </div>
        <TableExample />
      </main>
    </div>
  );
}

export default App;
