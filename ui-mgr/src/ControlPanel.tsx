import React from "react";
import { startupAllBots, shutdownAllBots, shutdownManager } from "./api";
import { usePasswordContext } from "./PasswordContext";
import type { List } from "immutable";
import type { ImmutableBotInfo } from "./state/botRegistry";

export function ControlPanel({ data }: { data: List<ImmutableBotInfo> }) {
  const { setShowPasswordModal, password } = usePasswordContext();
  const totalProfit = data
    .reduce(
      (acc, curr) =>
        acc + Number(curr.get("lastState")?.stats?.usdProfitToDate ?? "0"),
      0
    )
    .toFixed(3);

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
              <h5>
                <span
                  className={`badge bg-${
                    Number(totalProfit) >= 0 ? "success" : "danger"
                  }`}
                  style={{ marginLeft: "16px" }}
                >
                  Total profit: {totalProfit}
                </span>
              </h5>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
