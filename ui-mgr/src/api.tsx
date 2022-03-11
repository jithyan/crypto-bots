import io from "socket.io-client";
import axiosDefault from "axios";
import { getTimestampPepper } from "common-util";
import React, { useState, useEffect, useLayoutEffect } from "react";

const socket = io("ws://35.243.104.152:2000");

const axios = axiosDefault.create({
  baseURL: "http://35.243.104.152:2000",
});

axios.interceptors.request.use(
  async function (config) {
    const token = await getToken(config.url ?? "");
    config.params = {
      token,
    };
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export async function sendCommandToBot(path: string, id: string) {
  const token = await getToken(path);
  axios.post(`${path}`, { id });
}

export async function getToken(path: string) {
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

function ActionButton({
  action,
  id,
  path,
}: Record<"action" | "id" | "path", string>): JSX.Element {
  return (
    <button
      className="btn btn-primary btn-sm"
      style={{ margin: "4px 4px" }}
      onClick={() => sendCommandToBot(path, id)}
    >
      {action.toUpperCase()}
    </button>
  );
}

const cardHasJustBeenUpdatedStyle = "card text-white bg-warning mb-3";

export function LastState({
  lastState,
  lastCheckIn,
  status,
}: any): JSX.Element {
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
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <em>{lastState?.decisionEngine?.state}</em>
            </li>
            <li className="list-group-item">
              <strong>Last ticker price:</strong>{" "}
              {parseFloat(lastState?.decisionEngine?.lastTickerPrice).toFixed(
                3
              )}
            </li>
            <li className="list-group-item">
              <strong>Last purchase price:</strong>{" "}
              {parseFloat(lastState?.decisionEngine?.lastPurchasePrice).toFixed(
                3
              )}
            </li>
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
            Using <mark>{lastState?.sleep?.sleepStrategy}</mark> sleep strategy
            <br />
            <small>
              Inc: {parseFloat(PRICE_HAS_INCREASED_THRESHOLD).toFixed(4)} | Dec:{" "}
              {parseFloat(PRICE_HAS_DECREASED_THRESHOLD).toFixed(4)} | Stop
              loss: {parseFloat(STOP_LOSS_THRESHOLD) * 100}%
            </small>
          </p>
        </div>
      </div>
    );
  } else {
    return <span>Unknown</span>;
  }
}

export function useBotStatus(): any[] {
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on("botstatus", (respData) => {
      console.log("botstatus", respData);
      const parsedData = respData.map((d: Record<string, any>) => {
        return {
          ...d,
          profitToDate: d.lastState?.stats?.usdProfitToDate ?? "0",
          lastState: (
            <LastState
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
      });
      setData(parsedData);
    });
  }, []);

  return data;
}

export async function shutdownAllBots() {
  //const token = await getToken("/bots/shutdown/all");

  axios.post("/bots/shutdown/all").then((resp) => {
    console.log("Success", resp);
  });
}

export async function startupAllBots() {
  //const token = await getToken("/bots/startup/all");

  axios.post("/bots/startup/all").then((resp) => {
    console.log("Success", resp);
  });
}

export async function shutdownManager() {
  //const token = await getToken("/mgr-shutdown");

  axios.post("/mgr-shutdown").then((resp) => {
    console.log("Success", resp);
  });
}
