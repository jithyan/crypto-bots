import express from "express";
import { z } from "zod";
import h from "xxhashjs";
import { request } from "gaxios";

const SEED = 10_240;

const BotInfoReq = z.object({
  version: z.string(),
  exchange: z.string(),
  symbol: z.string(),
  port: z.string(),
  location: z.string().optional(),
});

type TBotInfoReq = z.infer<typeof BotInfoReq>;

interface IBotInfo extends TBotInfoReq {
  status: "HEALTHY" | "MIA" | "SHUTDOWN";
  hostname: string;
}

export const botRegister: Record<string, IBotInfo> = {};

function getIdFromData(botInfo: TBotInfoReq): string {
  return h
    .h64([botInfo.exchange, botInfo.port, botInfo.symbol].join(":"), SEED)
    .toString();
}

const server = express();
server.use(express.json());

server.post("/register", (req, res) => {
  const botInfo = BotInfoReq.parse(req.body);
  const id = getIdFromData(botInfo);

  const data: IBotInfo = {
    ...botInfo,
    hostname: req.hostname,
    status: "HEALTHY",
  };

  console.log("Received registration", { ...data, id });
  botRegister[id] = data;

  return res.status(201).json({ status: "SUCCESS" });
});

server.get("/bots", (req, res) =>
  res.json(
    Object.keys(botRegister).map((id) => ({ id, ...(botRegister[id] ?? {}) }))
  )
);

const ShutdownRequest = z.object({ id: z.string() });

server.post("/bots/shutdown", async (req, res) => {
  const { id } = ShutdownRequest.parse(req.body);

  if (!id || !botRegister.hasOwnProperty(id)) {
    return res.status(404).json({ status: "NOT FOUND", id });
  } else {
    const { port, hostname } = botRegister[id];
    await request({
      baseURL: `http://${hostname}:${port}`,
      url: `/shutdown`,
    });
    botRegister[id].status = "SHUTDOWN";
    return res.json({ status: "OK" });
  }
});

const port = Number(process.env.PORT ?? "2000");
const hostname = process.env.HOSTNAME ?? "localhost";

server.listen(port, hostname, () => {
  console.log(`Listening on ${hostname}:${port}`);
});
