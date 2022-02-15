import Big from "big.js";

export function isGreaterThanZero(amount: string | number): boolean {
  return new Big(amount).gt(new Big("0"));
}

export function roundTo3Dp(price: string | number | Big) {
  return new Big(price).toFixed(3, Big.roundHalfEven);
}

export function truncTo3Dp(price: string | number | Big) {
  return new Big(price).toFixed(3, Big.roundDown);
}

export async function sleep(minutes = 3) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), minutes * 60 * 1000);
  });
}
