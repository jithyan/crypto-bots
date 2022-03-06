import express from "express";
import { Server } from "socket.io";
import { z } from "zod";
import helmet from "helmet";
import crypto from "crypto";

import { GaxiosOptions, request } from "gaxios";
import { spawn } from "child_process";
import cors from "cors";
import http from "http";
import {
  getIdFromData,
  botRegister,
  BotInfoReq,
  IBotInfo,
  getBotRegisterIds,
} from "./models.js";
import { logger } from "./log.js";
import { Config } from "./config.js";
import { getTimestampPepper } from "common-util";

const app = express();
export const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.emit("botstatus", getBotStatus());
});

const broadcastBotStatus = () => {
  io.emit("botstatus", getBotStatus());
};

type TBotActions = "shutdown" | "startup" | "remove";

const getBotStatus = () => {
  return getBotRegisterIds().map((id) => {
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
  });
};

app.use(cors());
app.use(helmet());
app.use(express.json());
app.disable("x-powered-by");

function recreateToken(path: string, salt: number): string {
  const password = "hello";
  const pepper = getTimestampPepper();
  const msg = [path, salt, password, pepper].join(":");
  const hash = crypto.createHash("sha512").update(msg).digest();
  return encodeURIComponent(new TextDecoder().decode(hash));
}

app.post("/register", (req, res) => {
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
    broadcastBotStatus();

    return res.status(201).json({ status: "SUCCESS" });
  } catch (err: any) {
    logger.error("Bot registration failed", err);
    return res.status(400).json({ status: "FAILURE" });
  }
});

app.use((req, res, next) => {
  try {
    const { token } = req.query;
    if (token && typeof token === "string") {
      const tokenStr = Buffer.from(token, "base64").toString();
      const tokenParsed = JSON.parse(tokenStr);
      const { salt, hash } = tokenParsed;
      if (typeof salt === "number" && typeof hash === "string" && hash) {
        const myHash = recreateToken(req.path, salt);
        if (myHash === hash) {
          return next();
        }
      }
    }
    throw new Error("Unauthorized");
  } catch (err) {
    return res.status(403).json({ code: 403, status: "Unauthorized" });
  }
});

const BotActionRequest = z.object({ id: z.string() });

app.post("/bots/remove", (req, res) => {
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
      broadcastBotStatus();
      return res.json({ status: "OK" });
    }
  } catch (err: any) {
    logger.error("Bot removal request failed", err);
    return res.status(400).json({ status: "FAILURE" });
  }
});

app.post("/bots/shutdown", async (req, res) => {
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

      broadcastBotStatus();
      return res.json({ status: "OK" });
    }
  } catch (err: any) {
    logger.error("Bot shutdown request failed", err);
    return res.status(400).json({ status: "FAILURE" });
  }
});

app.post("/bots/shutdown/all", async (req, res) => {
  const { token } = req.query;
  if (token && typeof token === "string") {
    const tokenStr = Buffer.from(token, "base64").toString();
    const tokenParsed = JSON.parse(tokenStr);
    const { salt, hash } = tokenParsed;
    console.log("path", req.path);
    const myHash = recreateToken(req.path, salt);

    console.log("token", { tokenParsed });
    console.log("isValid", myHash === hash);
  }
  try {
    const requestDetails = getBotRegisterIds()
      .filter((id) => botRegister.state[id].status === "ONLINE")
      .map((id) => ({
        details: buildBotRequest(botRegister.state[id], "/shutdown"),
        id,
      }));
    await Promise.all(
      requestDetails.map(({ details, id }) =>
        request(details).then(() => {
          botRegister.state[id].status = "SHUTTING DOWN";
          broadcastBotStatus();
        })
      )
    );
    return res.json({ status: "OK" });
  } catch (err) {
    logger.error("Failed to send mass bot shutdown request", err);
    return res.status(500).json({ status: "Some failure occurred" });
  }
});

app.post("/bots/startup", (req, res) => {
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
    .then(() => broadcastBotStatus())
    .catch(() => res.status(500).json({ status: "Failed to start bot" }));
});

app.post("/bots/startup/all", (req, res) => {
  getBotRegisterIds()
    .filter((id) => botRegister.state[id].status === "OFFLINE")
    .forEach((id) => {
      startupBot(botRegister.state[id]);
      broadcastBotStatus();
    });
  return res.json({ status: "sent startup signal" });
});

function startupBot(bot: IBotInfo): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const nohup = spawn("nohup", [`${Config.BOT_DIR}${bot.location}`, "&"], {
      cwd: `${Config.BOT_DIR}${bot.location?.split("/")[0]}`,
    });
    bot.status = "STARTING UP";
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
