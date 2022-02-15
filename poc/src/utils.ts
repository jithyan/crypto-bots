import Big, { BigSource } from "big.js";
import { generalLogger } from "./log";

export function roundTo3Dp(price: string | number | Big) {
  return new Big(price).toFixed(3, Big.roundHalfEven);
}

export function truncTo3Dp(price: string | number | Big) {
  return new Big(price).toFixed(3, Big.roundDown);
}

export async function sleep(minutes = 3.5) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), minutes * 60 * 1000);
  });
}

export function isBalanceGreaterThanZero(balance: string | Big) {
  if (new Big(truncTo3Dp(balance)).gt("0")) {
    return true;
  } else {
    generalLogger.error("Balance is not greater than zero", {
      balance: new Big(truncTo3Dp(balance)),
    });
    throw new Error("Balance is not greater than zero");
  }
}
