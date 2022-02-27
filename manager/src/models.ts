import { z } from "zod";
import h from "xxhashjs";

export interface IBotInfo extends TBotInfoReq {
  status: "ONLINE" | "SHUTTING DOWN" | "OFFLINE" | "NOT WORKING";
  hostname: string;
}
type TBotRegister = Record<string, IBotInfo>;
export const botRegister: TBotRegister = {};

export const BotInfoReq = z.object({
  version: z.string(),
  exchange: z.string(),
  symbol: z.string(),
  port: z.string(),
  location: z.string().optional(),
});
export type TBotInfoReq = z.infer<typeof BotInfoReq>;

const SEED = 10_240;
export function getIdFromData(botInfo: TBotInfoReq): string {
  return h
    .h64([botInfo.exchange, botInfo.port, botInfo.symbol].join(":"), SEED)
    .toString();
}
