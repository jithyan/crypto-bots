import axiosDefault from "axios";
import React, { useState, useEffect, useRef } from "react";
import { TableExample } from "./TableExample";
import { getTimestampPepper } from "common-util";
import io from "socket.io-client";

const socket = io("ws://35.243.104.152:2000");

const axios = axiosDefault.create({
  baseURL: "http://35.243.104.152:2000",
});

async function sendCommandToBot(path: string, id: string) {
  const token = await getToken(path);
  axios.post(`${path}?token=${token}`, { id });
}

async function getToken(path: string) {
  //@ts-ignore
  const password = __SNOWPACK_ENV__.SNOWPACK_PUBLIC_MGR_PWD?.trim();
  const salt = window.crypto.getRandomValues(new Uint32Array(1))[0];
  const pepper = getTimestampPepper();
  const hash = encodeURIComponent(
    new TextDecoder().decode(
      await window.crypto.subtle.digest(
        "SHA-512",
        new TextEncoder().encode([path, salt, password, pepper].join(":"))
      )
    )
  );
  return btoa(JSON.stringify({ hash: hash, salt }));
}

function useBotStatus(): any[] {
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on("botstatus", (respData) => {
      const parsedData = respData.map((d: Record<string, any>) => {
        return {
          ...d,
          lastState: d.lastState?.state ?? "Unknown",
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

async function shutdownAllBots() {
  const token = await getToken("/bots/shutdown/all");

  axios.post("/bots/shutdown/all" + "?token=" + token).then((resp) => {
    console.log("Success", resp);
  });
}

async function startupAllBots() {
  const token = await getToken("/bots/startup/all");

  axios.post("/bots/startup/all" + "?token=" + token).then((resp) => {
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
