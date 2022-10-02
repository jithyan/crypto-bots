import React from "react";
import { useBotStats } from "../../state";
import { NavBarList, BadgeListItem } from "./NavBar/NavBarList";

function pluralizeBot(val: number) {
  return val > 1 ? "bots" : "bot";
}

export function BotStateStats(): JSX.Element {
  const {
    numBotsHoldStable,
    numBotsHoldingVolatileAssets,
    numBotsPlacedOrders,
    numBotsSleeping,
    capitalFree,
    capitalDeployed,
  } = useBotStats(
    "numBotsHoldStable",
    "numBotsHoldingVolatileAssets",
    "numBotsPlacedOrders",
    "numBotsSleeping",
    "capitalFree",
    "capitalDeployed"
  );

  return (
    <NavBarList>
      <BadgeListItem show={numBotsHoldStable > 0} bg={"light"}>
        {numBotsHoldStable} online {pluralizeBot(numBotsHoldStable)} not bought
        anything
      </BadgeListItem>
      <BadgeListItem show={numBotsHoldingVolatileAssets > 0} bg={"light"}>
        {numBotsHoldingVolatileAssets} online{" "}
        {pluralizeBot(numBotsHoldingVolatileAssets)} holding crypto{" "}
      </BadgeListItem>
      <BadgeListItem show={numBotsSleeping > 0} bg={"light"}>
        {numBotsSleeping} online {pluralizeBot(numBotsSleeping)} asleep
      </BadgeListItem>
      <BadgeListItem show={numBotsPlacedOrders > 0} bg={"warning"}>
        {numBotsPlacedOrders} {pluralizeBot(numBotsPlacedOrders)} placed orders
      </BadgeListItem>
      <BadgeListItem bg={"light"}>${capitalFree} capital free</BadgeListItem>
      <BadgeListItem bg={"light"}>
        ${capitalDeployed} capital deployed
      </BadgeListItem>
    </NavBarList>
  );
}
