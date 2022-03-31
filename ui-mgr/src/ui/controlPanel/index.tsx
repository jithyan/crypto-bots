import React from "react";
import type { PropsWithChildren } from "react";
import { usePasswordContext } from "../password";
import { useBotStats } from "../../state";
import { startupAllBots, shutdownAllBots, shutdownManager } from "../../api";

function BadgeListItem({
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
}>) {
  return (
    <li>
      <h5>
        <span className={`badge bg-${bg}`} style={{ marginLeft: "16px" }}>
          {children}
        </span>
      </h5>
    </li>
  );
}
export function ControlPanel() {
  const { setShowPasswordModal, password } = usePasswordContext();
  const { totalBots, totalProfit, botsNotWorking, onlineBots, offlineBots } =
    useBotStats();

  const checkPassword = (func: () => void) => () => {
    if (password) {
      func();
    } else {
      setShowPasswordModal(true);
    }
  };

  return (
    <div className="row" style={{ paddingBottom: "16px" }}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Manager Panel
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDarkDropdown"
            aria-controls="navbarNavDarkDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDarkDropdown">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDarkDropdownMenuLink"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Commands
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-dark"
                  aria-labelledby="navbarDarkDropdownMenuLink"
                >
                  <li>
                    <div className="dropdown-item">
                      <button
                        className="btn btn-outline-info"
                        onClick={checkPassword(startupAllBots)}
                      >
                        Start all bots
                      </button>
                    </div>
                  </li>
                  <li>
                    <div className="dropdown-item">
                      <button
                        className="btn btn-outline-warning"
                        onClick={checkPassword(shutdownAllBots)}
                      >
                        Shutdown all bots
                      </button>
                    </div>
                  </li>
                  <li>
                    <div className="dropdown-item">
                      <button
                        className="btn btn-outline-warning"
                        onClick={checkPassword(shutdownManager)}
                      >
                        Shutdown Manager
                      </button>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>

            <ul className="navbar-nav">
              <BadgeListItem
                bg={Number(totalProfit) > 0 ? "success" : "danger"}
              >
                Total profit: ${totalProfit}
              </BadgeListItem>
              <BadgeListItem bg={"info"}>{totalBots} bots</BadgeListItem>
              <BadgeListItem bg={"primary"}>
                {onlineBots} bots online
              </BadgeListItem>
              <BadgeListItem bg={"secondary"}>
                {offlineBots} bots offline{" "}
              </BadgeListItem>
              <BadgeListItem bg={"danger"}>
                {botsNotWorking} bots not working
              </BadgeListItem>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
