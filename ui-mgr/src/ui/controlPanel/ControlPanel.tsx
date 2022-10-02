//@ts-ignore
import React from "react";
import { NavBarPanel } from "./NavBar/NavBarPanel";
import { ManagerDropdown } from "./ManagerDropdown";
import { SortFilterDropdown } from "./SortFilterDropdown";
import { BotStatusStats } from "./BotStatusStats";
import { BotStateStats } from "./BotStateStats";

export function ControlPanel(): JSX.Element {
  return (
    <>
      <NavBarPanel heading="Manager Panel" id="manager-panel">
        <ManagerDropdown />
        <SortFilterDropdown />
        <BotStatusStats />
      </NavBarPanel>

      <NavBarPanel id="bot-stats-panel" heading="Bot Stats">
        <BotStateStats />
      </NavBarPanel>
    </>
  );
}
