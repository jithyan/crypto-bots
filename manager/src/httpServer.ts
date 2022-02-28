import express from "express";
import { z } from "zod";
import { request } from "gaxios";
import { getIdFromData, botRegister, BotInfoReq, IBotInfo } from "./models.js";
import { logger } from "./log.js";

export const httpServer = express();
httpServer.use(express.json());

httpServer.post("/register", (req, res) => {
  try {
    const botInfo = BotInfoReq.parse(req.body);

    const id = getIdFromData(botInfo);

    const data: IBotInfo = {
      ...botInfo,
      hostname: req.hostname,
      status: "ONLINE",
      lastCheckIn: new Date(),
    };

    botRegister[id] = data;

    return res.status(201).json({ status: "SUCCESS" });
  } catch (err: any) {
    logger.error("Bot registration failed", err);
    return res.status(400).json({ status: "FAILURE" });
  }
});

httpServer.get("/bots", (req, res) =>
  res.json(
    Object.keys(botRegister).map((id) => ({ id, ...(botRegister[id] ?? {}) }))
  )
);

const ShutdownRequest = z.object({ id: z.string() });

httpServer.post("/bots/shutdown", async (req, res) => {
  try {
    const { id } = ShutdownRequest.parse(req.body);

    if (!botRegister.hasOwnProperty(id)) {
      return res.status(404).json({ status: "NOT FOUND", id });
    } else {
      const { port, hostname } = botRegister[id];
      await request({
        baseURL: `http://${hostname}:${port}`,
        url: `/shutdown`,
      });
      botRegister[id].status = "SHUTTING DOWN";
      return res.json({ status: "OK" });
    }
  } catch (err: any) {
    logger.error("Bot shutdown request failed", err);
    return res.status(400).json({ status: "FAILURE" });
  }
});
