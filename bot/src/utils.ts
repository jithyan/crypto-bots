import Big from "big.js";
import { generalLogger } from "./log/index.js";

export function roundTo4Dp(price: string | number | Big) {
  return new Big(price).toFixed(4, Big.roundHalfUp);
}

export function truncTo4Dp(price: string | number | Big) {
  return new Big(price).toFixed(4, Big.roundDown);
}

export function roundTo3Dp(price: string | number | Big) {
  return new Big(price).toFixed(3, Big.roundHalfUp);
}

export function truncTo3Dp(price: string | number | Big) {
  return new Big(price).toFixed(3, Big.roundDown);
}

export async function sleep(minutes = 3) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), minutes * 60 * 1000);
  });
}

export function isMinimumTradeableBalance(balance: string | Big): boolean {
  return new Big(truncTo4Dp(balance)).gt("20");
}
