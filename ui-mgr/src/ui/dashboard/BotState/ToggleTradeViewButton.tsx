import React from "react";
import { Badge } from "../Badges";
import { backIcon, tradeIcon } from "../Icons";

export function ToggleTradeViewButton({
  state,
  onClick,
}: {
  state: "trade" | "back";
  onClick: () => void;
}): JSX.Element | null {
  if (state === "trade") {
    return (
      <Badge
        title="View trades"
        color="dark"
        textColor="light"
        border={true}
        onClick={onClick}
        style={{ marginRight: "8px", padding: "2px" }}
      >
        {tradeIcon}
      </Badge>
    );
  } else if (state === "back") {
    return (
      <Badge
        title="Back to bot state view"
        color="light"
        textColor="dark"
        border={true}
        onClick={onClick}
        style={{ marginRight: "8px", padding: "2px" }}
      >
        {backIcon}
      </Badge>
    );
  } else {
    return null;
  }
}
