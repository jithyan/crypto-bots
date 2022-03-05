import express from "express";
import { z } from "zod";
import helmet from "helmet";
import { GaxiosOptions, request } from "gaxios";
import { spawn } from "child_process";

import { getIdFromData, botRegister, BotInfoReq, IBotInfo } from "./models.js";
import { logger } from "./log.js";
import { Config } from "./config.js";
import cors from "cors";

export const httpServer = express();
httpServer.use(cors());
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
      status: botInfo.status ?? "ONLINE",
      lastCheckIn: new Date(),
    };

    botRegister.state[id] = data;

    return res.status(201).json({ status: "SUCCESS" });
  } catch (err: any) {
    logger.error("Bot registration failed", err);
    return res.status(400).json({ status: "FAILURE" });
  }
});

type TBotActions = "shutdown" | "startup" | "remove";

httpServer.get("/bots", (req, res) =>
  res.json(
    getBotRegisterIds().map((id) => {
      const bot = botRegister.state[id] ?? {};
      const actions: Partial<Record<TBotActions, `/bots/${TBotActions}`>> = {};

      if (bot.status === "ONLINE") {
        actions.shutdown = "/bots/shutdown";
      }
      if (bot.status === "OFFLINE") {
        actions.startup = "/bots/startup";
        actions.remove = "/bots/remove";
      }

      return {
        id,
        actions,
        ...bot,
      };
    })
  )
);

const BotActionRequest = z.object({ id: z.string() });

httpServer.post("/bots/remove", (req, res) => {
  try {
    const { id } = BotActionRequest.parse(req.body);

    if (!botRegister.state.hasOwnProperty(id)) {
      return res.status(404).json({ status: "NOT FOUND", id });
    } else if (botRegister.state[id].status === "ONLINE") {
      return res
        .status(400)
        .json({ status: "Bot cannot be removed if online. Shutdown first." });
    } else {
      delete botRegister.state[id];
    }
  } catch (err: any) {
    logger.error("Bot removal request failed", err);
    return res.status(400).json({ status: "FAILURE" });
  }
});

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
      await request(buildBotRequest(botRegister.state[id], "/shutdown"));
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

  return startupBot(botRegister.state[id])
    .then(() => res.json({ status: "SUCCESS" }))
    .catch(() => res.status(500).json({ status: "Failed to start bot" }));
});

httpServer.post("/bots/startup/all", (req, res) => {
  getBotRegisterIds()
    .filter((id) => botRegister.state[id].status === "ONLINE")
    .forEach((id) => {
      startupBot(botRegister.state[id]);
    });
  return res.json({ status: "sent startup signal" });
});

function startupBot(bot: IBotInfo): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const nohup = spawn("nohup", [`${Config.BOT_DIR}${bot.location}`, "&"], {
      cwd: `${Config.BOT_DIR}${bot.location?.split("/")[0]}`,
    });
    nohup.on("error", (err) => {
      logger.error("Failed to start bot", { err, bot: bot });
    });
    nohup.on("close", (code) => {
      if (code !== 0) {
        logger.error("Failed to start bot", { bot: bot, code });
      }
    });
    setImmediate(resolve);
  });
}

function buildBotRequest(bot: IBotInfo, path: string): GaxiosOptions {
  return {
    baseURL: `http://${bot.hostname}:${bot.port}`,
    url: path,
    method: "POST",
  };
}
