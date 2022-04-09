import React from "react";
import { Badge } from "../Badges";
import { backIcon, tradeIcon } from "../Icons";

export function ToggleTradeViewButton({
  state,
  onClick,
}: {
  state: "trade" | "expand" | "collapse";
  onClick: () => void;
}) {
  if (state === "trade") {
    return (
      <Badge
        color="dark"
        textColor="light"
        border={true}
        onClick={onClick}
        style={{ marginRight: "8px", padding: "2px" }}
      >
        {tradeIcon}
      </Badge>
    );
  } else if (state === "collapse") {
    return (
      <Badge
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
