import { parseISO, formatDistanceStrict, add } from "date-fns";

export function getSecondsTillNextCheckIn(
  lastCheckInIso: string,
  sleepStrategy: "3m" | "6m" | "9m" | "15m" | "30m" | "1hr"
): number {
  const checkInDate = parseISO(lastCheckInIso);
  const addConfig =
    sleepStrategy === "1hr"
      ? { hours: 1 }
      : { minutes: parseInt(sleepStrategy) };

  const nextCheckInDate = add(checkInDate, addConfig);

  return parseInt(
    formatDistanceStrict(new Date(), nextCheckInDate, { unit: "second" })
  );
}
