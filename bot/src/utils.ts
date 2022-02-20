import Big from "big.js";

export function roundTo4Dp(price: string | number | Big) {
  return new Big(price).toFixed(4, Big.roundHalfUp);
}

export function getMaxNumberOfDecimalPlaces(stepSize: Big): number {
  let maxDecimalPlaces = 0;
  while (!stepSize.mul(new Big("10").pow(maxDecimalPlaces)).eq("1")) {
    maxDecimalPlaces++;
  }
  return maxDecimalPlaces;
}

export function truncBasedOnStepSize(value: Big, stepSize: Big): string {
  let maxDecimalPlaces = 0;
  while (!stepSize.mul(new Big("10").pow(maxDecimalPlaces)).eq("1")) {
    maxDecimalPlaces++;
  }

  return value.toFixed(maxDecimalPlaces, Big.roundDown);
}

export async function sleep(minutes = 3) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => resolve(), minutes * 60 * 1000);
  });
}
