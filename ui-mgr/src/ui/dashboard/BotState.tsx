import type { IBotStateDetails, TBotStatus } from "common-util";
import React, { useCallback, useState } from "react";
import { formatAsUsd, formatPct } from "../../utils/format";
import { useAnimateNumber } from "../../utils/useAnimateNumber";
import {
  Badge,
  AssetStateBadge,
  LastPurchasePriceBadge,
  PctChangeBadge,
} from "./Badges";
import { collapseIcon, expandIcon, PriceTrendIcon } from "./Icons";
import { useIsUpdatingOnChange } from "./useIsUpdatingOnChange";
import { ErrorBoundary } from "react-error-boundary";

function StateErrorBoundary({ children }: React.PropsWithChildren<{}>) {
  return (
    <ErrorBoundary
      fallback={
        <div className="bg-danger text-light">
          Something went wrong displaying state data
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export type IBotStateProps = IBotStateDetails & {
  symbol: string;
  status: TBotStatus;
  lastCheckIn: string;
};

export const BotState = React.memo((props: IBotStateProps) => {
  const [showCompact, setShowCompact] = useState(true);
  const onToggleViewClicked = useCallback(
    () => setShowCompact((prev) => !prev),
    []
  );

  return showCompact ? (
    <CompactStateView {...props} onToggleViewClicked={onToggleViewClicked} />
  ) : (
    <ExpandedView {...props} onToggleViewClicked={onToggleViewClicked} />
  );
});

const ToggleStateButton = React.memo(
  ({
    state,
    onToggleViewClicked,
  }: {
    state: "expand" | "collapse";
    onToggleViewClicked: () => void;
  }) =>
    state === "expand" ? (
      <Badge
        color="dark"
        textColor="light"
        border={true}
        onClick={onToggleViewClicked}
        style={{ marginRight: "8px", padding: "2px" }}
      >
        {expandIcon}
      </Badge>
    ) : (
      <Badge
        color="light"
        textColor="dark"
        border={true}
        onClick={onToggleViewClicked}
        style={{ marginRight: "8px", padding: "2px" }}
      >
        {collapseIcon}
      </Badge>
    )
);

function CompactStateView({
  priceTrendState = "",
  state = "",
  tickerPrice = "",
  lastPurchasePrice = "",
  symbol,
  iteration,
  onToggleViewClicked,
}: {
  symbol: string;
  onToggleViewClicked: () => void;
} & IBotStateDetails) {
  const holdsVolatileAsset = state.includes("Volatile");
  const formattedTickerPrice = useAnimateNumber(tickerPrice, 3);

  const isPriceBot = symbol === "PRICEBOT";

  if (isPriceBot) {
    return null;
  } else if (state.includes("Stasis")) {
    return (
      <StateErrorBoundary>
        <ToggleStateButton
          onToggleViewClicked={onToggleViewClicked}
          state="expand"
        />
        <Badge color="dark" textColor="light">
          Zzz.. {4 - iteration!}h left
        </Badge>
      </StateErrorBoundary>
    );
  }

  return (
    <StateErrorBoundary>
      <ToggleStateButton
        onToggleViewClicked={onToggleViewClicked}
        state="expand"
      />
      <AssetStateBadge assetState={state} />{" "}
      <PriceTrendIcon trendState={priceTrendState} />{" "}
      <strong>{formatAsUsd(formattedTickerPrice, 3)}</strong>{" "}
      {holdsVolatileAsset ? (
        <>
          <LastPurchasePriceBadge
            lastPurchasePrice={lastPurchasePrice}
            tickerPrice={tickerPrice}
          />{" "}
          <PctChangeBadge
            lastPurchasePrice={lastPurchasePrice}
            tickerPrice={tickerPrice}
          />
        </>
      ) : null}
    </StateErrorBoundary>
  );
}

export const ExpandedView = React.memo(
  ({
    state,
    lastPurchasePrice,
    config,
    priceTrendState,
    tickerPrice,
    lastCheckIn,
    status,
    iteration,
    onToggleViewClicked,
  }: IBotStateProps & {
    onToggleViewClicked: () => void;
  }): JSX.Element => {
    const isInPostSellStasis = state === "PostSellStasis";
    const isHoldingVolatileAsset =
      state !== "HoldStableAsset" && state !== "PostSellStasis";

    return (
      <StateErrorBoundary>
        <ExpandedViewCard
          onToggleViewClicked={onToggleViewClicked}
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
              Sleeping after selling. {4 - iteration!} hours left
            </Badge>
          </CardBodyItem>
        </ExpandedViewCard>
      </StateErrorBoundary>
    );
  }
);

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

const CardFooter = React.memo((props: IBotStateDetails["config"]) => {
  const {
    priceHasDecreased,
    priceHasIncreased,
    sleepStrategy,
    stopLoss,
    minPercentIncreaseForSell,
    maxBuyAmount,
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
});

function ExpandedCardContainer({
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
