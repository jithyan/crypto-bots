import React from "react";
import { useBotStats } from "../../state";
import { NavBarList, BadgeListItem } from "./NavBar/NavBarList";
import { Profit } from "./Profit";

export function BotStatusStats() {
  const { totalBots, botsNotWorking, onlineBots, offlineBots } = useBotStats(
    "totalBots",
    "botsNotWorking",
    "onlineBots",
    "offlineBots"
  );

  return (
    <NavBarList>
      <Profit />
      <BadgeListItem bg={"info"}>{totalBots} bots</BadgeListItem>
      <BadgeListItem show={onlineBots > 0} bg={"primary"}>
        {onlineBots === totalBots
          ? "All bots online"
          : `${onlineBots} bots online`}
      </BadgeListItem>
      <BadgeListItem show={offlineBots > 0} bg={"secondary"}>
        {offlineBots} bots offline{" "}
      </BadgeListItem>
      <BadgeListItem show={botsNotWorking > 0} bg={"danger"}>
        {botsNotWorking} bots not working
      </BadgeListItem>
    </NavBarList>
  );
}
