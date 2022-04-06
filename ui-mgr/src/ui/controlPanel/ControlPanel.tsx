//@ts-ignore
import React, { startTransition, useState } from "react";
import type { PropsWithChildren } from "react";
import { usePasswordContext } from "../password";
import { useBotFilter, useBotSortMethod, useBotStats } from "../../state";
import { startupAllBots, shutdownAllBots, shutdownManager } from "../../api";
import { useAnimateNumber } from "../../utils/useAnimateNumber";
import { formatAsUsd } from "../../utils/format";

const BadgeListItem = ({
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

export function ControlPanel() {
  const { setShowPasswordModal, password } = usePasswordContext();
  const {
    totalBots,
    totalProfit,
    botsNotWorking,
    onlineBots,
    offlineBots,
    numBotsHoldStable,
    numBotsHoldingVolatileAssets,
    numBotsPlacedOrders,
    numBotsSleeping,
    capitalFree,
    capitalDeployed,
  } = useBotStats();

  const setFilter = useBotFilter();
  const [filterValue, setFilterValue] = useState("");

  const animatedTotalProfit = useAnimateNumber(totalProfit, 3, {
    steps: 25,
    ms: 200,
  });

  const checkPassword = (func: () => void) => () => {
    if (password) {
      func();
    } else {
      setShowPasswordModal(true);
    }
  };
  const [_, setSortMethod] = useBotSortMethod();

  return (
    <>
      <div className="row">
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
            <div
              className="collapse navbar-collapse"
              id="navbarNavDarkDropdown"
            >
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
                          className="btn btn-outline-danger"
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
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="sortAndFilterDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Sort & Filter
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-dark"
                    aria-labelledby="sortAndFilterDropdown"
                  >
                    <li>
                      <div className="dropdown-item">
                        <button
                          className="btn btn-outline-light"
                          onClick={() =>
                            setSortMethod((prev) =>
                              prev === "statusDesc" ? "statusAsc" : "statusDesc"
                            )
                          }
                        >
                          Status
                        </button>
                      </div>
                    </li>
                    <li>
                      <div className="dropdown-item">
                        <button
                          className="btn small btn-outline-light"
                          onClick={() =>
                            setSortMethod((prev) =>
                              prev === "symbolDesc" ? "symbolAsc" : "symbolDesc"
                            )
                          }
                        >
                          Symbol
                        </button>
                      </div>
                    </li>
                    <li>
                      <div className="dropdown-item">
                        <button
                          className="btn btn-outline-light"
                          onClick={() =>
                            setSortMethod((prev) =>
                              prev === "profitDesc" ? "profitAsc" : "profitDesc"
                            )
                          }
                        >
                          Profit
                        </button>
                      </div>
                    </li>
                    <li>
                      <div className="dropdown-item">
                        <label className="form-label">
                          Filter by symbol
                          <input
                            className="form-control"
                            type="text"
                            value={filterValue}
                            onChange={(e) => {
                              const value = e.target.value ?? "";
                              setFilterValue(value);
                              startTransition(() =>
                                setFilter({
                                  method: "symbol",
                                  value,
                                })
                              );
                            }}
                          />
                        </label>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>

              <ul className="navbar-nav">
                <BadgeListItem
                  bg={Number(totalProfit) > 0 ? "success" : "danger"}
                >
                  Total profit: {formatAsUsd(animatedTotalProfit, 3)}
                </BadgeListItem>
                <BadgeListItem bg={"info"}>{totalBots} bots</BadgeListItem>
                <BadgeListItem show={onlineBots > 0} bg={"primary"}>
                  {onlineBots} bots online
                </BadgeListItem>
                <BadgeListItem show={offlineBots > 0} bg={"secondary"}>
                  {offlineBots} bots offline{" "}
                </BadgeListItem>
                <BadgeListItem show={botsNotWorking > 0} bg={"danger"}>
                  {botsNotWorking} bots not working
                </BadgeListItem>
              </ul>
            </div>
          </div>
        </nav>
      </div>

      <div className="row">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <a className="navbar-brand" href="#">
                Bot Stats
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNavDarkDropdown2"
                aria-controls="navbarNavDarkDropdown2"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="container-fluid">
                <div
                  className="collapse navbar-collapse"
                  id="navbarNavDarkDropdown2"
                >
                  <ul className="navbar-nav">
                    <BadgeListItem show={numBotsHoldStable > 0} bg={"light"}>
                      {numBotsHoldStable} online bots not bought anything
                    </BadgeListItem>
                    <BadgeListItem
                      show={numBotsHoldingVolatileAssets > 0}
                      bg={"light"}
                    >
                      {numBotsHoldingVolatileAssets} online bots holding crypto{" "}
                    </BadgeListItem>
                    <BadgeListItem show={numBotsSleeping > 0} bg={"light"}>
                      {numBotsSleeping} online bots asleep
                    </BadgeListItem>
                    <BadgeListItem show={numBotsPlacedOrders > 0} bg={"light"}>
                      {numBotsPlacedOrders} bots have placed orders
                    </BadgeListItem>
                    <BadgeListItem show={true} bg={"light"}>
                      ${capitalFree} capital available
                    </BadgeListItem>
                    <BadgeListItem show={true} bg={"light"}>
                      ${capitalDeployed} capital deployed
                    </BadgeListItem>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </nav>
      </div>
    </>
  );
}
