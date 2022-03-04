import express from "express";
import { z } from "zod";
import { request } from "gaxios";
import { getIdFromData, botRegister, BotInfoReq, IBotInfo } from "./models.js";
import { logger } from "./log.js";
import helmet from "helmet";

export const httpServer = express();
httpServer.use(helmet());
httpServer.use(express.json());
httpServer.disable("x-powered-by");

const getBotRegisterIds = (): string[] => Object.keys(botRegister.state);

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

    botRegister.state[id] = data;

    return res.status(201).json({ status: "SUCCESS" });
  } catch (err: any) {
    logger.error("Bot registration failed", err);
    return res.status(400).json({ status: "FAILURE" });
  }
});

httpServer.get("/bots", (req, res) =>
  res.json(
    getBotRegisterIds().map((id) => ({
      id,
      ...(botRegister.state[id] ?? {}),
    }))
  )
);

const ShutdownRequest = z.object({ id: z.string() });

httpServer.post("/bots/shutdown", async (req, res) => {
  try {
    const { id } = ShutdownRequest.parse(req.body);

    if (!botRegister.state.hasOwnProperty(id)) {
      return res.status(404).json({ status: "NOT FOUND", id });
    } else {
      const { port, hostname } = botRegister.state[id];
      await request({
        baseURL: `http://${hostname}:${port}`,
        url: `/shutdown`,
      });
      botRegister.state[id].status = "SHUTTING DOWN";
      return res.json({ status: "OK" });
    }
  } catch (err: any) {
    logger.error("Bot shutdown request failed", err);
    return res.status(400).json({ status: "FAILURE" });
  }
});

httpServer.post("/bots/shutdown/all", async (req, res) => {
  try {
    const requestDetails = getBotRegisterIds().map((id) => ({
      baseURL: `http://${botRegister.state[id].hostname}:${botRegister.state[id].port}`,
      url: `/shutdown`,
    }));
    await Promise.all(requestDetails.map((details) => request(details)));
    return res.json({ status: "OK" });
  } catch (err) {
    logger.error("Failed to send mass bot shutdown request", err);
    return res.status(500).json({ status: "Some failure occurred" });
  }
});
