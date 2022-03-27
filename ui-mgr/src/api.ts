import io from "socket.io-client";
import axiosDefault from "axios";
import { getTimestampPepper } from "common-util";
import { useLayoutEffect } from "react";
import type { PossibleSocketEvents } from "./botState";
import { Password } from "./PasswordContext";

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
  const password = Password.current;
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

export function useBotStream(
  updateOnEvent: (event: PossibleSocketEvents) => void
): void {
  useLayoutEffect(() => {
    socket.on("allbots", (data) => {
      console.log("allbots", data);
      updateOnEvent({ event: "allbots", data });
    });

    socket.on("botremove", (data) => {
      console.log("botremove", data);
      updateOnEvent({ event: "botremove", data });
    });

    socket.on("botstatus", (data) => {
      console.log("botstatus", data);
      updateOnEvent({ event: "botstatus", data });
    });

    socket.on("botupdate", (data) => {
      console.log("botupdate", data);
      updateOnEvent({ event: "botupdate", data });
    });
  }, []);
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
