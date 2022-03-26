import h from "xxhashjs";
import { IBotInfo, TBotInfoReq } from "common-util";

export type TBotRegister = Record<string, IBotInfo>;
export const botRegister: { state: TBotRegister } = { state: {} };

const SEED = 10_240;
export function getIdFromData(botInfo: TBotInfoReq): string {
  return h
    .h64([botInfo.exchange, botInfo.port, botInfo.symbol].join(":"), SEED)
    .toString();
}

export const getBotRegisterIds = (): string[] => Object.keys(botRegister.state);
