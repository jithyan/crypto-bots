import React, { Suspense } from "react";
import { useAnimateNumber } from "../../utils/useAnimateNumber";
import { formatAsUsd } from "../../utils/format";
import { BadgeListItem } from "./NavBar/NavBarList";
import { useRecoilValue } from "recoil";
import { ErrorBoundary } from "react-error-boundary";
import { queryProfit } from "../../state/profit";

export const spinner = (
  <div className="spinner-border text-success" role="status">
    <span className="visually-hidden">Loading...</span>
  </div>
);

export function Profit(): JSX.Element {
  return (
    <Suspense fallback={spinner}>
      <ErrorBoundary
        fallback={
          <BadgeListItem bg={"danger"}>Failed to load profit</BadgeListItem>
        }
      >
        <ProfitChild />
      </ErrorBoundary>
    </Suspense>
  );
}

export function ProfitChild(): JSX.Element {
  const totalProfit = useRecoilValue(queryProfit);

  const animatedTotalProfit = useAnimateNumber(totalProfit, 3, {
    steps: 25,
    ms: 200,
  });

  return (
    <BadgeListItem bg={Number(totalProfit) > 0 ? "success" : "danger"}>
      Total profit: {formatAsUsd(animatedTotalProfit, 3)}
    </BadgeListItem>
  );
}
