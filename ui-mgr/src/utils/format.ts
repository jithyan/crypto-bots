export function formatIsoDate(date: string): string {
  return new Date(date)
    .toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
    })
    .split(", ")[1];
}

export function formatAsUsd(
  number: string,
  minimumFractionDigits: number
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",

    // These options are needed to round to whole numbers if that's what you want.
    minimumFractionDigits, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  }).format(number as any);
}
