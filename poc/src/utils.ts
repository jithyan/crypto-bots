import Big from "big.js";
import { generalLogger } from "./log/index.js";

export function roundTo4Dp(price: string | number | Big) {
  return new Big(price).toFixed(4, Big.roundHalfUp);
}

export function truncTo4Dp(price: string | number | Big) {
  return new Big(price).toFixed(4, Big.roundDown);
}

export async function sleep(minutes = 3) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), minutes * 60 * 1000);
  });
}

export function isBalanceGreaterThanZero(balance: string | Big) {
  if (new Big(truncTo4Dp(balance)).gt("0")) {
    return true;
  } else {
    generalLogger.error("Balance is not greater than zero", {
      balance: new Big(truncTo4Dp(balance)),
    });
    throw new Error("Balance is not greater than zero");
  }
}
