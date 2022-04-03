import type { TBotActions, TBotAvailableActions } from "common-util";
import React from "react";
import { sendCommandToBot } from "../../api";
import { usePasswordContext } from "../password";
import { ThreeDotsVertical } from "./Icons";

export const ActionsMenu = ({
  id,
  actions,
}: {
  id: string;
  actions: TBotAvailableActions;
}) => {
  return (
    <div className="dropdown">
      <button
        className="btn btn-dark dropdown-toggle text-light"
        type="button"
        id={`${id}-bot-actions`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <ThreeDotsVertical />
      </button>
      <ul className="dropdown-menu" aria-labelledby={`${id}-bot-actions`}>
        {Object.keys(actions).map((action) => (
          <li key={`action-${id}-${action}`}>
            <ActionButton
              key={`${id}-${action}`}
              id={id}
              path={actions[action as TBotActions] ?? ""}
              action={action}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
function ActionButton({
  action,
  id,
  path,
}: Record<"action" | "id" | "path", string>): JSX.Element {
  const { setShowPasswordModal, password } = usePasswordContext();

  return (
    <button
      className="dropdown-item"
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
