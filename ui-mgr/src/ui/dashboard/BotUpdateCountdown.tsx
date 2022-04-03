//@ts-ignore
import React, { useEffect, useState, startTransition } from "react";
import { parseISO, formatDistanceStrict, add } from "date-fns";

export function BotUpdateCountdown({
  sleepStrategy,
  checkInIsoDate,
  status,
}: {
  sleepStrategy: "3m" | "6m" | "9m" | "15m" | "30m" | "1hr";
  checkInIsoDate: string;
  status: string;
}) {
  const checkIn = parseISO(checkInIsoDate);
  const addConfig =
    sleepStrategy === "1hr"
      ? { hours: 1 }
      : { minutes: parseInt(sleepStrategy) };

  const nextCheckIn = add(checkIn, addConfig);
  const [nextCheckInFormatted, setNextCheckIn] = useState(
    formatDistanceStrict(new Date(), nextCheckIn, { unit: "second" })
  );

  useEffect(() => {
    if (nextCheckInFormatted !== "0 seconds") {
      const id = setTimeout(
        () =>
          startTransition(() =>
            setNextCheckIn(`${parseInt(nextCheckInFormatted) - 1} seconds`)
          ),
        1000
      );
      return () => clearTimeout(id);
    }
  }, [nextCheckInFormatted]);
  const isZero = nextCheckInFormatted === "0 seconds";

  const seconds = `${parseInt(nextCheckInFormatted) % 60}s`;
  const minutes = `${Math.trunc(parseInt(nextCheckInFormatted) / 60)}m`;

  return status !== "OFFLINE" ? (
    <span
      style={{ marginLeft: "4px" }}
      className={`badge rounded-pill bg-${
        nextCheckInFormatted === "0 seconds"
          ? "danger"
          : minutes === "0m" && parseInt(seconds) < 30
          ? "warning"
          : "info"
      } text-${nextCheckInFormatted === "0 seconds" ? "light" : "dark"}`}
    >
      {`${minutes === "0m" ? "" : `${minutes} `}${seconds}`}
    </span>
  ) : null;
}
