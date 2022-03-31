import React from "react";
import { sendCommandToBot } from "../../api";
import { usePasswordContext } from "../password";

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
