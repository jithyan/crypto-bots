import { z } from "zod";

export const BotInfoReq = z.object({
  version: z.string(),
  exchange: z.string(),
  symbol: z.string(),
  port: z.string(),
  location: z.string().optional(),
  status: z
    .union([
      z.literal("ONLINE"),
      z.literal("OFFLINE"),
      z.literal("SHUTTING DOWN"),
      z.literal("NOT WORKING"),
      z.literal("STARTING UP"),
    ])
    .optional(),
  lastState: z.any().optional(),
});

export type TBotInfoReq = z.infer<typeof BotInfoReq>;

export type TBotStatus =
  | "ONLINE"
  | "SHUTTING DOWN"
  | "OFFLINE"
  | "NOT WORKING"
  | "STARTING UP";

export interface IBotInfo extends TBotInfoReq {
  status: TBotStatus;
  hostname: string;
  lastCheckIn: Date;
}
