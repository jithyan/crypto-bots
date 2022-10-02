import { axios } from "./axios";

export async function sendCommandToBot(
  path: string,
  id: string
): Promise<void> {
  axios.post(`${path}`, { id });
}

export async function shutdownAllBots(): Promise<void> {
  axios.post("/bots/shutdown/all").then((resp: any) => {
    console.log("Success", resp);
  });
}

export async function startupAllBots(): Promise<void> {
  axios.post("/bots/startup/all").then((resp: any) => {
    console.log("Success", resp);
  });
}

export async function shutdownManager(): Promise<void> {
  axios.post("/mgr-shutdown").then((resp: any) => {
    console.log("Success", resp);
  });
}
