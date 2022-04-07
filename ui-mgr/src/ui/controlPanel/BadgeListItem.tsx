import React, { PropsWithChildren } from "react";

export const BadgeListItem = ({
  show = true,
  children,
  bg,
}: PropsWithChildren<{
  bg:
    | "light"
    | "dark"
    | "info"
    | "warning"
    | "danger"
    | "success"
    | "secondary"
    | "primary";
  show?: boolean;
}>) => {
  return show ? (
    <li>
      <h5>
        <span
          className={`badge bg-${bg}${bg === "light" ? "text-dark" : ""}`}
          style={{ marginLeft: "16px" }}
        >
          {children}
        </span>
      </h5>
    </li>
  ) : null;
};
