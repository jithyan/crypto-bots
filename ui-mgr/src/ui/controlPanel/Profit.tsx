import React from "react";
import { axios } from "../../api/axios";
import { useAnimateNumber } from "../../utils/useAnimateNumber";
import { formatAsUsd } from "../../utils/format";
import { BadgeListItem } from "./BadgeListItem";

const currentProfit: Record<"value", string | Promise<string> | null> = {
  value: null,
};

function getProfit(refetch = false): string | Promise<string> {
  if (!currentProfit.value || refetch) {
    currentProfit.value = axios
      .get<{ profit: string }>("/stats/profit")
      .then((resp) => {
        currentProfit.value = resp.data.profit;
        return resp.data.profit;
      })
      .catch((err) => {
        console.log(err);
        currentProfit.value = "error";
        throw err;
      });
  }

  return currentProfit.value;
}

function isPromise(obj: any): obj is Promise<any> {
  return typeof obj?.then === "function";
}

export function Profit() {
  const totalProfit = getProfit();

  if (isPromise(totalProfit)) {
    throw totalProfit;
  } else if (isNaN(Number(totalProfit))) {
    return <BadgeListItem bg={"danger"}>Failed to load profit</BadgeListItem>;
  }

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
