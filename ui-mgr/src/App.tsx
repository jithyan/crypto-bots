import axiosDefault from "axios";
import React, { useState, useEffect, useRef } from "react";
import { TableExample } from "./TableExample";
import io from "socket.io-client";

const socket = io("ws://localhost:2000");

const axios = axiosDefault.create({
  baseURL: "http://localhost:2000",
});
function sendCommandToBot(path: string, id: string) {
  axios.post(path, { id });
}

function useBotStatus(): any[] {
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on("botstatus", (respData) => {
      const parsedData = respData.map((d: Record<string, any>) => {
        return {
          ...d,
          actions: Object.keys(d.actions).map((action) => {
            const path = d.actions[action];
            return (
              <button
                key={`${d.id}-${action}`}
                className="btn btn-primary btn-sm"
                style={{ margin: "4px 4px" }}
                onClick={() => sendCommandToBot(path, d.id)}
              >
                {action.toUpperCase()}
              </button>
            );
          }),
        };
      });
      setData(parsedData);
    });
  }, []);

  return data;
}

function shutdownAllBots() {
  axios.post("/bots/shutdown/all").then((resp) => {
    console.log("Success", resp);
  });
}

function startupAllBots() {
  axios.post("/bots/startup/all").then((resp) => {
    console.log("Success", resp);
  });
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
        <div className="container">
          <div className="row" style={{ paddingBottom: "24px" }}>
            <div className="col">
              <button className="btn btn-outline-info" onClick={startupAllBots}>
                Start all bots
              </button>
            </div>
            <div className="col">
              <button
                className="btn btn-outline-warning"
                onClick={shutdownAllBots}
              >
                Shutdown all bots
              </button>
            </div>
          </div>
        </div>
        <TableExample data={data} />
      </main>
    </div>
  );
}

export default App;
