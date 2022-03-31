import { axios } from "./axios";

export async function sendCommandToBot(path: string, id: string) {
  axios.post(`${path}`, { id });
}

export async function shutdownAllBots() {
  axios.post("/bots/shutdown/all").then((resp: any) => {
    console.log("Success", resp);
  });
}

export async function startupAllBots() {
  axios.post("/bots/startup/all").then((resp: any) => {
    console.log("Success", resp);
  });
}

export async function shutdownManager() {
  axios.post("/mgr-shutdown").then((resp: any) => {
    console.log("Success", resp);
  });
}
