import React, { useEffect, useState, startTransition } from "react";
import { getSecondsTillNextCheckIn } from "../../utils/date";
import { Badge } from "./Badges";

interface Props {
  sleepStrategy: "3m" | "6m" | "9m" | "15m" | "30m" | "1hr";
  checkInIsoDate: string;
  status: string;
}
export function BotUpdateCountdown({
  sleepStrategy,
  checkInIsoDate,
  status,
}: Props): JSX.Element | null {
  const [secondsLeft, setSecondsLeft] = useState(
    getSecondsTillNextCheckIn(checkInIsoDate, sleepStrategy)
  );

  useEffect(() => {
    if (secondsLeft !== 0) {
      const id = setTimeout(
        () => startTransition(() => setSecondsLeft(secondsLeft - 1)),
        1000
      );
      return () => clearTimeout(id);
    }
  }, [secondsLeft]);

  let color: "info" | "warning" | "danger" = "info";
  if (secondsLeft === 0) {
    color = "danger";
  } else if (secondsLeft < 30) {
    color = "warning";
  }
  const textColor = secondsLeft === 0 ? "light" : "dark";

  const minutesDisplay =
    Math.trunc(secondsLeft / 60) < 1 ? "" : `${Math.trunc(secondsLeft / 60)}m `;
  const secondsDisplay = `${secondsLeft % 60}s`;

  return status !== "OFFLINE" ? (
    <Badge
      rounded={true}
      style={{ marginLeft: "4px" }}
      color={color}
      textColor={textColor}
      title="Time to next check in from bot"
    >
      {minutesDisplay}
      {secondsDisplay}
    </Badge>
  ) : null;
}
