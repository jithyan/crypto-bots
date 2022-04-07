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
  getBotRegisterIds,
  IBotInfo,
} from "./models.js";
import { logger } from "./log.js";
import { Config } from "./config.js";
import {
  BotInfoReq,
  getTimestampPepper,
  TBotStatus,
  TBotStatusEvent,
} from "common-util";
import { saveState } from "./tasks/saveState.js";
import {
  getBotRemovalUpdate,
  getBotStatusUpdate,
  getAllBotInfo,
  getBotUpdate,
} from "./socketStream.js";
import rateLimit from "express-rate-limit";
import { getAllTimeProfit, getProfitForSymbol } from "./tradeDb.js";

const apiLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
export const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:8080", "http://ponzibots.com"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit<TBotStatusEvent>("allbots", getAllBotInfo());
});

export const broadcastBotStatusUpdate = (id: string, status: TBotStatus) => {
  io.emit<TBotStatusEvent>("botstatus", getBotStatusUpdate(id, status));
};

const broadcastBotRemoval = (id: string) => {
  io.emit<TBotStatusEvent>("botremove", getBotRemovalUpdate(id));
};

const broadcastBotUpdate = (id: string) => {
  io.emit<TBotStatusEvent>("botupdate", getBotUpdate(id));
};

app.use(cors({ origin: ["http://localhost:8080", "http://ponzibots.com"] }));
app.use(helmet());
app.use(apiLimiter);
app.use(express.json());
app.disable("x-powered-by");

function recreateToken(path: string, salt: number): string {
  const password = Config.PASSWORD;
  const pepper = getTimestampPepper();
  const msg = [path, salt, password, pepper].join(":");
  const hash = crypto.createHash("sha512").update(msg).digest();
  return encodeURIComponent(new TextDecoder().decode(hash));
}

app.post("/register", async (req, res) => {
  try {
    const botInfo = BotInfoReq.parse(req.body);

    const id = getIdFromData(botInfo);

    const data: IBotInfo = {
      ...botInfo,
      hostname: req.hostname,
      status: botInfo.status ?? "ONLINE",
      lastCheckIn: new Date(),
    };
    const profit = await getProfitForSymbol(data.symbol);
    data.lastState.stats.usdProfitToDate = profit;

    botRegister.state[id] = data;
    saveState();
    broadcastBotUpdate(id);

    return res.status(201).json({ status: "SUCCESS" });
  } catch (err: any) {
    logger.error("Bot registration failed", err);
    return res.status(400).json({ status: "FAILURE" });
  }
});

app.get("/db/profit", async (req, res) => {
  try {
    const profit = await getAllTimeProfit();
    res.status(200).json({ profit });
  } catch (err) {
    logger.error("Failed getting total profit", err);
    return res.status(500).json({ status: "Failed" });
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

app.post("/mgr-shutdown", (req, res) => {
  logger.info("Received shutdown request for manager");
  setImmediate(() => {
    logger.info("Shutting down manager");
    process.exit(0);
  });
  return res.status(200).json({ status: "SUCCESS" });
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
      broadcastBotRemoval(id);
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
      await request(buildBotRequest(botRegister.state[id], "/shutdown")).catch(
        (e) => {
          botRegister.state[id].status = "NOT WORKING";
          broadcastBotStatusUpdate(id, "NOT WORKING");
          throw e;
        }
      );
      botRegister.state[id].status = "SHUTTING DOWN";

      broadcastBotStatusUpdate(id, "SHUTTING DOWN");
      return res.json({ status: "OK" });
    }
  } catch (err: any) {
    logger.error("Bot shutdown request failed", err);
    return res.status(400).json({ status: "FAILURE" });
  }
});

app.post("/bots/shutdown/all", async (req, res) => {
  try {
    const shutdownRequestDetails = getBotRegisterIds()
      .filter(
        (id) =>
          botRegister.state[id].status === "ONLINE" &&
          botRegister.state[id].symbol.toUpperCase() !== "PRICEBOT"
      )
      .map((id) => ({
        details: buildBotRequest(botRegister.state[id], "/shutdown"),
        id,
      }));
    await Promise.all(
      shutdownRequestDetails.map(({ details, id }) =>
        request(details).then(() => {
          botRegister.state[id].status = "SHUTTING DOWN";
          broadcastBotStatusUpdate(id, "SHUTTING DOWN");
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

  return startupBot(botRegister.state[id], 0)
    .then(() => res.json({ status: "SUCCESS" }))
    .then(() => broadcastBotStatusUpdate(id, "STARTING UP"))
    .catch(() => {
      broadcastBotStatusUpdate(id, "NOT WORKING");
      return res.status(500).json({ status: "Failed to start bot" });
    });
});

app.post("/bots/startup/all", (req, res) => {
  getBotRegisterIds()
    .filter((id) => botRegister.state[id].status === "OFFLINE")
    .forEach((id, index) => {
      startupBot(botRegister.state[id], index).then(() =>
        broadcastBotStatusUpdate(id, "STARTING UP")
      );
    });
  return res.json({ status: "sent startup signal" });
});

function startupBot(bot: IBotInfo, seconds: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
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
    }, seconds * 1000);
  });
}

function buildBotRequest(bot: IBotInfo, path: string): GaxiosOptions {
  return {
    baseURL: `http://${bot.hostname}:${bot.port}`,
    url: path,
    method: "POST",
  };
}
