import React from "react";
import { startupAllBots, shutdownAllBots, shutdownManager } from "../../api";
import { usePasswordContext } from "../password";
import { NavBarDropdown, NavBarDropdownItem } from "./NavBar/NavBarDropdown";

export function ManagerDropdown(): JSX.Element {
  const { setShowPasswordModal, password } = usePasswordContext();

  const checkPassword = (func: () => void) => () => {
    if (password) {
      func();
    } else {
      setShowPasswordModal(true);
    }
  };

  return (
    <NavBarDropdown id="navbarDarkDropdownMenuLink" heading="Commands">
      <NavBarDropdownItem>
        <button
          className="btn btn-outline-info"
          onClick={checkPassword(startupAllBots)}
        >
          Start all bots
        </button>
      </NavBarDropdownItem>
      <NavBarDropdownItem>
        <button
          className="btn btn-outline-warning"
          onClick={checkPassword(shutdownAllBots)}
        >
          Shutdown all bots
        </button>
      </NavBarDropdownItem>
      <NavBarDropdownItem>
        <button
          className="btn btn-outline-danger"
          onClick={checkPassword(shutdownManager)}
        >
          Shutdown Manager
        </button>
      </NavBarDropdownItem>
    </NavBarDropdown>
  );
}
