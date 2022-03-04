import express from "express";
import { z } from "zod";
import helmet from "helmet";
import { request } from "gaxios";
import { spawn } from "child_process";

import { getIdFromData, botRegister, BotInfoReq, IBotInfo } from "./models.js";
import { logger } from "./log.js";

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
      shutdown: "/bots/shutdown",
      startup: "/bots/startup",
      ...(botRegister.state[id] ?? {}),
    }))
  )
);

const BotActionRequest = z.object({ id: z.string() });

httpServer.post("/bots/shutdown", async (req, res) => {
  try {
    const { id } = BotActionRequest.parse(req.body);

    if (!botRegister.state.hasOwnProperty(id)) {
      return res.status(404).json({ status: "NOT FOUND", id });
    } else if (botRegister.state[id].status !== "ONLINE") {
      return res
        .status(400)
        .json({ status: "Bot has to be online to shutdown" });
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
    const requestDetails = getBotRegisterIds()
      .filter((id) => botRegister.state[id].status === "ONLINE")
      .map((id) => buildBotRequest(botRegister.state[id], "/shutdown"));
    await Promise.all(requestDetails.map((details) => request(details)));
    return res.json({ status: "OK" });
  } catch (err) {
    logger.error("Failed to send mass bot shutdown request", err);
    return res.status(500).json({ status: "Some failure occurred" });
  }
});

httpServer.post("/bots/startup", (req, res) => {
  const { id } = BotActionRequest.parse(req.body);
  if (!botRegister.state.hasOwnProperty(id)) {
    return res.status(404).json({ status: "Id not found" });
  } else if (botRegister.state[id].status !== "OFFLINE") {
    return res
      .status(400)
      .json({ status: "Bot needs to be offline to start up" });
  }

  return new Promise((resolve, reject) => {
    const nohup = spawn("nohup", [
      `/home/jithya_n/bots/${botRegister.state[id].location}`,
      "&",
    ]);
    nohup.on("error", (err) => {
      logger.error("Failed to start bot", { err, bot: botRegister.state[id] });
    });
    nohup.on("close", (code) => {
      if (code === 0) {
        logger.info("Successfully started bot", { bot: botRegister.state[id] });
        resolve(res.json({ status: "SUCCESS" }));
      } else {
        resolve(res.status(500).json({ status: "Failed to start bot" }));
      }
    });
  });
});

function buildBotRequest(bot: IBotInfo, path: string) {
  return {
    baseURL: `http://${bot.hostname}:${bot.port}`,
    url: path,
  };
}
