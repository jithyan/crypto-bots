import { z } from "zod";

export const BotStatus = z.union([
  z.literal("ONLINE"),
  z.literal("SHUTTING DOWN"),
  z.literal("OFFLINE"),
  z.literal("NOT WORKING"),
  z.literal("STARTING UP"),
]);
export type TBotStatus = z.infer<typeof BotStatus>;

export const BotInfoReq = z.object({
  version: z.string(),
  exchange: z.string(),
  symbol: z.string(),
  port: z.string(),
  location: z.string().optional(),
  status: BotStatus.optional(),
  lastState: z.any().optional(),
});
export type TBotInfoReq = z.infer<typeof BotInfoReq>;

export type TBotStatusEvent =
  | "allbots"
  | "botstatus"
  | "botremove"
  | "botupdate";

export const BotActions = z.union([
  z.literal("shutdown"),
  z.literal("startup"),
  z.literal("remove"),
]);
export type TBotActions = z.infer<typeof BotActions>;

export const BotActionsPath = z.union([
  z.literal("/bots/shutdown"),
  z.literal("/bots/startup"),
  z.literal("/bots/remove"),
]);
export type TBotActionsPath = z.infer<typeof BotActionsPath>;

export const BotAvailableActions = z.record(BotActions, BotActionsPath);
export type TBotAvailableActions = z.infer<typeof BotAvailableActions>;

export const BotStatusUpdate = z.object({
  id: z.string(),
  status: BotStatus,
});
export type IBotStatusUpdate = z.infer<typeof BotStatusUpdate>;

export const BotInfoStream = z
  .object({
    lastCheckIn: z.string(),
    actions: BotAvailableActions,
    id: z.string(),
    status: BotStatus,
    hostname: z.string(),
  })
  .merge(BotInfoReq);

export type IBotInfoStream = z.infer<typeof BotInfoStream>;

export const BotRemovalUpdate = z.object({
  id: z.string(),
});
export type IBotRemovalUpdate = z.infer<typeof BotRemovalUpdate>;
