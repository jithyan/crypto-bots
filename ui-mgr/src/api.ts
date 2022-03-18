import io from "socket.io-client";
import axiosDefault from "axios";
import { getTimestampPepper } from "common-util";
import { useState, useEffect } from "react";

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

export function useBotStatus(): any[] {
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.timeout(5000).emit("timeout", (err: any) => {
      if (err) {
        console.error(err);
        //setData([]);
      }
    });
    socket.on("botstatus", (respData) => {
      console.log("botstatus", respData);
      setData(respData);
    });
  }, []);

  return data;
}

export async function sendCommandToBot(path: string, id: string) {
  axios.post(`${path}`, { id });
}

export async function shutdownAllBots() {
  axios.post("/bots/shutdown/all").then((resp) => {
    console.log("Success", resp);
  });
}

export async function startupAllBots() {
  axios.post("/bots/startup/all").then((resp) => {
    console.log("Success", resp);
  });
}

export async function shutdownManager() {
  axios.post("/mgr-shutdown").then((resp) => {
    console.log("Success", resp);
  });
}
