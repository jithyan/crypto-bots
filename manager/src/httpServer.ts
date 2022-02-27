import express from "express";
import { z } from "zod";
import { request } from "gaxios";
import { getIdFromData, botRegister, BotInfoReq, IBotInfo } from "./models.js";

export const httpServer = express();
httpServer.use(express.json());

httpServer.post("/register", (req, res) => {
  const botInfo = BotInfoReq.parse(req.body);
  const id = getIdFromData(botInfo);

  const data: IBotInfo = {
    ...botInfo,
    hostname: req.hostname,
    status: "ONLINE",
    lastCheckIn: new Date(),
  };

  console.log("Received registration", { ...data, id });
  botRegister[id] = data;

  return res.status(201).json({ status: "SUCCESS" });
});

httpServer.get("/bots", (req, res) =>
  res.json(
    Object.keys(botRegister).map((id) => ({ id, ...(botRegister[id] ?? {}) }))
  )
);

const ShutdownRequest = z.object({ id: z.string() });

httpServer.post("/bots/shutdown", async (req, res) => {
  const { id } = ShutdownRequest.parse(req.body);

  if (!id || !botRegister.hasOwnProperty(id)) {
    return res.status(404).json({ status: "NOT FOUND", id });
  } else {
    const { port, hostname } = botRegister[id];
    await request({
      baseURL: `http://${hostname}:${port}`,
      url: `/shutdown`,
    });
    botRegister[id].status = "OFFLINE";
    return res.json({ status: "OK" });
  }
});
