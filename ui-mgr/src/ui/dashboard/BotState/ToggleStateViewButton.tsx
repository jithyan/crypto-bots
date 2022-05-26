import React from "react";
import { Badge } from "../Badges";
import { expandIcon, collapseIcon } from "../Icons";

export const ToggleStateButton = ({
  state,
  onToggleViewClicked,
}: {
  state: "expand" | "collapse";
  onToggleViewClicked: () => void;
}) =>
  state === "expand" ? (
    <Badge
      title="Expand to view detailed bot state"
      color="dark"
      textColor="light"
      border={true}
      onClick={onToggleViewClicked}
      style={{ marginRight: "8px", padding: "2px" }}
    >
      {expandIcon}
    </Badge>
  ) : (
    <Badge
      title="Collapse to compact bot state view"
      color="light"
      textColor="dark"
      border={true}
      onClick={onToggleViewClicked}
      style={{ marginRight: "8px", padding: "2px" }}
    >
      {collapseIcon}
    </Badge>
  );
