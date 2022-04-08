import { useMemo } from "react";
import { selector, useRecoilValue } from "recoil";
import { botRegistry, getBotInfo } from "./botRegistry";

const getBotStats = selector<{
  totalBots: number;
  onlineBots: number;
  botsNotWorking: number;
  offlineBots: number;
  numBotsHoldStable: number;
  numBotsPlacedOrders: number;
  numBotsHoldingVolatileAssets: number;
  numBotsSleeping: number;
  capitalDeployed: number;
  capitalFree: number;
}>({
  key: "botStats",
  get: ({ get }) => {
    const bots = get(botRegistry);

    const totalBots = bots.size;
    const onlineBots = bots.filter(
      (b) => getBotInfo(b, "status") === "ONLINE"
    ).size;
    const offlineBots = bots.filter(
      (b) => getBotInfo(b, "status") === "OFFLINE"
    ).size;
    const botsNotWorking = bots.filter(
      (b) => getBotInfo(b, "status") === "NOT WORKING"
    ).size;

    const numBotsHoldingVolatileAssets = bots.reduce((prev, curr) => {
      const state = getBotInfo(curr, "state")?.state ?? "";
      const status = getBotInfo(curr, "status");

      if (state.includes("HoldVolatile") && status === "ONLINE") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    const numBotsPlacedOrders = bots.reduce((prev, curr) => {
      if (getBotInfo(curr, "state")?.state?.includes("Order")) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    const numBotsHoldStable = bots.reduce((prev, curr) => {
      const state = getBotInfo(curr, "state")?.state ?? "";
      const status = getBotInfo(curr, "status");

      if (state.includes("HoldStable") && status === "ONLINE") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    const numBotsSleeping = bots.reduce((prev, curr) => {
      const state = getBotInfo(curr, "state")?.state ?? "";
      const status = getBotInfo(curr, "status");

      if (state.includes("PostSell") && status === "ONLINE") {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);

    let i = 0;
    const capitalDeployed = bots.reduce((prev, curr) => {
      const symbol = getBotInfo(curr, "symbol").toUpperCase();
      const state = getBotInfo(curr, "state")?.state ?? "";
      const status = getBotInfo(curr, "status");
      const maxBuyAmount = parseInt(
        getBotInfo(curr, "state").config?.maxBuyAmount ?? "0"
      );

      if (
        state.includes("Volatile") &&
        status === "ONLINE" &&
        symbol !== "PRICEBOT"
      ) {
        return prev + maxBuyAmount;
      } else {
        return prev;
      }
    }, 0);

    const capitalFree = bots.reduce((prev, curr) => {
      const symbol = getBotInfo(curr, "symbol").toUpperCase();
      const state = getBotInfo(curr, "state")?.state ?? "";
      const status = getBotInfo(curr, "status");
      const maxBuyAmount = parseInt(
        getBotInfo(curr, "state").config?.maxBuyAmount ?? "0"
      );

      if (
        (state.includes("HoldStable") || state.includes("Stasis")) &&
        status === "ONLINE" &&
        symbol !== "PRICEBOT"
      ) {
        return prev + maxBuyAmount;
      } else {
        return prev;
      }
    }, 0);

    return {
      totalBots,
      onlineBots,
      botsNotWorking,
      offlineBots,
      numBotsHoldStable,
      numBotsPlacedOrders,
      numBotsHoldingVolatileAssets,
      numBotsSleeping,
      capitalDeployed,
      capitalFree,
    };
  },
});

export function useBotStats() {
  const botStats = useRecoilValue(getBotStats);

  return useMemo(() => botStats, Object.values(botStats));
}
