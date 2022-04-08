//@ts-ignore
import React, { startTransition, useState } from "react";
import { usePasswordContext } from "../password";
import { useBotFilter, useBotSortMethod, useBotStats } from "../../state";
import { startupAllBots, shutdownAllBots, shutdownManager } from "../../api";
import { BadgeListItem } from "./BadgeListItem";
import { Profit } from "./Profit";
import { NavBarDropdownItem } from "./NavBarDropdownItem";
import { NavBarDropdown } from "./NavBarDropdown";
import { NavBarPanel } from "./NavBarPanel";

export function ControlPanel() {
  const { setShowPasswordModal, password } = usePasswordContext();
  const {
    totalBots,
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
      <NavBarPanel heading="Manager Panel" id="navbarNavDarkDropdown">
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

        <NavBarDropdown id="sortAndFilterDropdown" heading="Sort and Filter">
          <NavBarDropdownItem>
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
          </NavBarDropdownItem>
          <NavBarDropdownItem>
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
          </NavBarDropdownItem>
          <NavBarDropdownItem>
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
          </NavBarDropdownItem>
          <NavBarDropdownItem>
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
          </NavBarDropdownItem>
        </NavBarDropdown>

        <ul className="navbar-nav">
          <Profit />
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
      </NavBarPanel>

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
