import React from "react";
import { sendCommandToBot } from "./api";
import { usePasswordContext } from "./PasswordContext";

export function formatIsoDate(date: string): string {
  return new Date(date)
    .toLocaleString("en-AU", {
      timeZone: "Australia/Sydney",
    })
    .split(", ")[1];
}

export function ContractIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    </svg>
  );
}

export function ExpandIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
    >
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />
    </svg>
  );
}

export function ActionButton({
  action,
  id,
  path,
}: Record<"action" | "id" | "path", string>): JSX.Element {
  const { setShowPasswordModal, password } = usePasswordContext();

  return (
    <button
      className="btn btn-primary btn-sm"
      style={{ margin: "4px 4px" }}
      onClick={() => {
        if (password) {
          sendCommandToBot(path, id);
        } else {
          setShowPasswordModal(true);
        }
      }}
    >
      {action.toUpperCase()}
    </button>
  );
}
