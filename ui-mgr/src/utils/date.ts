export function formatIsoDate(date: string): string {
  return new Date(date)
    .toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
    })
    .split(", ")[1];
}
