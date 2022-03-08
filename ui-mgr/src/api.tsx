import io from "socket.io-client";
import axiosDefault from "axios";
import { getTimestampPepper } from "common-util";
import React, { useState, useEffect } from "react";

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

export function useBotStatus(): any[] {
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on("botstatus", (respData) => {
      console.log("botstatus", respData);
      const parsedData = respData.map((d: Record<string, any>) => {
        return {
          ...d,
          lastState: d.lastState ?? "Unknown",
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
