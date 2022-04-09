import React from "react";
import { selectorFamily } from "recoil";

const getTradeStats = selectorFamily({
  key: "getTradeStats",
  get: (symbol: string) => () => {
    return Promise.resolve({
      totalSold: 10,
      totalProfitableTrades: 9,
      trades: [
        {
          timestamp: "12:30PM",
          action: "BUY",
          amount: "0.1",
          value: "24",
          price: "240",
        },
        {
          timestamp: "2:30PM",
          action: "SELL",
          amount: "0.1",
          value: "48",
          price: "480",
          profit: "24",
        },
      ],
    });
  },
});

export function TradeView() {
  return <></>;
}
