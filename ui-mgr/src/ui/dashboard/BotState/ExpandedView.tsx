import type { IBotStateDetails } from "@jithyan/lib";
import React from "react";
import { formatAsUsd, formatPct } from "../../../utils/format";
import {
  LastPurchasePriceBadge,
  PctChangeBadge,
  Badge,
  AssetStateBadge,
} from "../Badges";
import { PriceTrendIcon } from "../Icons";
import { useIsUpdatingOnChange } from "../useIsUpdatingOnChange";
import type { IBotStateProps, TChangeViewState } from "./BotState";
import { StateErrorBoundary } from "./BotStateErrorBoundary";
import { ToggleStateButton } from "./ToggleStateViewButton";

export const ExpandedView = ({
  state,
  lastPurchasePrice,
  config,
  priceTrendState,
  tickerPrice,
  lastCheckIn,
  status,
  iteration,
  changeViewState,
}: IBotStateProps & {
  changeViewState: TChangeViewState;
}): JSX.Element => {
  const isInPostSellStasis = state === "PostSellStasis";
  const isHoldingVolatileAsset =
    state !== "HoldStableAsset" && state !== "PostSellStasis";

  return (
    <StateErrorBoundary>
      <ExpandedViewCard
        onToggleViewClicked={() => changeViewState("compact")}
        state={state}
        lastCheckIn={lastCheckIn}
        status={status}
        config={config}
      >
        <CardBodyItem heading={priceTrendState} headingStyle="italic">
          <PriceTrendIcon trendState={priceTrendState} />
        </CardBodyItem>

        <CardBodyItem heading="Last ticker price:" headingStyle="bold">
          {formatAsUsd(tickerPrice, 3)}
        </CardBodyItem>

        <CardBodyItem
          show={isHoldingVolatileAsset}
          heading="Last purchase price:"
          headingStyle="bold"
        >
          <LastPurchasePriceBadge
            lastPurchasePrice={lastPurchasePrice}
            tickerPrice={tickerPrice}
          />
        </CardBodyItem>
        <CardBodyItem
          show={isHoldingVolatileAsset}
          heading="Percent change since last purchase:"
          headingStyle="bold"
        >
          <PctChangeBadge
            lastPurchasePrice={lastPurchasePrice}
            tickerPrice={tickerPrice}
          />
        </CardBodyItem>
        <CardBodyItem show={isInPostSellStasis}>
          <Badge color="dark" textColor="light">
            Sleeping after selling.{" "}
            {parseInt(config.postSellSleep) - iteration!} hours left: ;
          </Badge>
        </CardBodyItem>
      </ExpandedViewCard>
    </StateErrorBoundary>
  );
};

function ExpandedViewCard({
  onToggleViewClicked,
  state,
  lastCheckIn,
  status,
  children,
  config,
}: React.PropsWithChildren<
  Omit<
    IBotStateProps,
    "symbol" | "iteration" | "profit" | "priceTrendState" | "tickerPrice"
  > & {
    onToggleViewClicked: () => void;
  }
>) {
  if (typeof state !== "string") {
    console.error("Invalid state", state);
    throw new Error("Invalid state in ExpandedViewCard");
  }

  return (
    <ExpandedCardContainer lastCheckIn={lastCheckIn} status={status}>
      <div className="card-header">
        <ToggleStateButton
          onToggleViewClicked={onToggleViewClicked}
          state="collapse"
        />
        <strong>{state}</strong> <AssetStateBadge assetState={state} />
      </div>
      {state === "PriceBot" ? null : (
        <div className="card-body">
          <ul className="list-group list-group-flush">{children}</ul>
        </div>
      )}
      <CardFooter {...config} />
    </ExpandedCardContainer>
  );
}

export function CardBodyItem({
  children,
  show = true,
  heading,
  headingStyle = "bold",
}: React.PropsWithChildren<{
  show?: boolean;
  heading?: string;
  headingStyle?: "bold" | "italic";
}>) {
  let head = null;

  if (heading) {
    if (headingStyle === "italic") {
      head = <em style={{ marginRight: "4px" }}>{heading}</em>;
    } else {
      head = <strong style={{ marginRight: "4px" }}>{heading}</strong>;
    }
  }

  return show ? (
    <li className="list-group-item">
      {head}
      {children}
    </li>
  ) : null;
}

const CardFooter = (props: IBotStateDetails["config"]) => {
  const {
    priceHasDecreased,
    priceHasIncreased,
    sleepStrategy,
    stopLoss,
    minPercentIncreaseForSell,
    maxBuyAmount,
    postSellSleep,
    pumpInc,
  } = props;

  const items: Record<"desc" | "val", string | JSX.Element>[] = [
    { desc: "Sleep interval", val: <mark>{sleepStrategy}</mark> },
    { desc: "Is an increase", val: formatPct(priceHasIncreased, 4) },
    { desc: "Is a decrease", val: formatPct(priceHasDecreased, 4) },
    {
      desc: "Minimum price increase",
      val: formatPct(minPercentIncreaseForSell, 4),
    },
    { desc: "Stop loss", val: `${Math.trunc(Number(stopLoss) * 100)}%` },
    { desc: "Max buy amount", val: `$${maxBuyAmount}` },
    { desc: "Post sell sleep", val: postSellSleep },
    { desc: "Pump signal", val: pumpInc },
  ];

  return (
    <div className="card-footer">
      <table className="table table-sm">
        <tbody>
          {items.map(({ val, desc }) => (
            <tr>
              <th scope="row">
                <small>{desc}</small>
              </th>
              <td>
                <small>{val}</small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export function ExpandedCardContainer({
  children,
  status,
  lastCheckIn,
}: React.PropsWithChildren<{ lastCheckIn: string; status: string }>) {
  const cardNormalStyle =
    status === "ONLINE"
      ? "card bg-light text-dark mb-3"
      : "card text-white bg-secondary mb-3";

  const isUpdating = useIsUpdatingOnChange(lastCheckIn);
  const cardStyle = isUpdating
    ? "card text-white bg-warning mb-3"
    : cardNormalStyle;

  return (
    <div className={cardStyle} style={{ width: "24rem" }}>
      {children}
    </div>
  );
}
