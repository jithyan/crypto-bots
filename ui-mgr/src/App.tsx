import axiosDefault from "axios";
import React, { useState, useEffect, useRef } from "react";
import { TableExample } from "./TableExample";
import { getTimeSalt } from "common-util";
import io from "socket.io-client";

const socket = io("ws://localhost:2000");

const axios = axiosDefault.create({
  baseURL: "http://localhost:2000",
});
function sendCommandToBot(path: string, id: string) {
  axios.post(path, { id });
}

async function generateToken() {
  let iv = window.crypto.getRandomValues(new Uint8Array(16));
  let key = new TextEncoder().encode("01234567890123456789012345678912");
  const pepper = `/botstatus/${getTimeSalt()}`;
  const hash = await window.crypto.subtle.digest(
    "SHA-512",
    new TextEncoder().encode(pepper)
  );
  //crypto functions are wrapped in promises so we have to use await and make sure the function that
  //contains this code is an async function
  //encrypt function wants a cryptokey object
  const key_encoded = await crypto.subtle.importKey(
    "raw",
    key.buffer,
    "AES-CTR",
    false,
    ["encrypt", "decrypt"]
  );
  const encrypted_content = await window.crypto.subtle.encrypt(
    {
      name: "AES-CTR",
      counter: iv,
      length: 128,
    },
    key_encoded,
    hash
  );
  return btoa(encodeURIComponent(encrypted_content));
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

async function shutdownAllBots() {
  const token = await generateToken();

  axios.post("/bots/shutdown/all" + "?token=" + token).then((resp) => {
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
