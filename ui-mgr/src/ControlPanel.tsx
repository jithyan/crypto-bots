import React, { useEffect, useState } from "react";
import { startupAllBots, shutdownAllBots, shutdownManager } from "./api";

export function useAnimateProfit(totalProfit: string) {
  const [prevProfit, setPrevProfit] = useState(0);

  useEffect(() => {
    if (prevProfit.toFixed(3) !== totalProfit) {
      const increment =
        Number(totalProfit) < Number(prevProfit.toFixed(3)) ? -0.001 : 0.001;
      let prof = Number(prevProfit);
      while (
        (increment > 0 && prof < Number(totalProfit)) ||
        (increment < 0 && prof > Number(totalProfit))
      ) {
        prof += increment;
        setTimeout(() => {
          setPrevProfit((prof) => prof + increment);
        }, 350);
      }
    }
  }, [totalProfit]);

  return prevProfit;
}

export function ControlPanel({ data }: { data: any[] }) {
  const totalProfit = data
    .reduce(
      (acc, curr) =>
        acc + Number(curr.lastState?.stats?.usdProfitToDate ?? "0"),
      0
    )
    .toFixed(3);
  const prevProfit = useAnimateProfit(totalProfit);

  // useEffect(() => {
  //   if (prevProfit.toFixed(3) !== totalProfit) {
  //     const increment =
  //       Number(totalProfit) < Number(prevProfit.toFixed(3)) ? -0.001 : 0.001;
  //     let prof = Number(prevProfit);
  //     while (prof < Number(totalProfit)) {
  //       prof += 0.001;
  //       setTimeout(() => {
  //         setPrevProfit((prof) => prof + increment);
  //       }, 350);
  //     }
  //   }
  // }, [totalProfit]);

  console.log({ totalProfit, prevProfit });

  return (
    <div className="container">
      <div className="row" style={{ paddingBottom: "24px" }}>
        <div className="col">
          <button className="btn btn-outline-info" onClick={startupAllBots}>
            Start all bots
          </button>
        </div>
        <div className="col">
          <button className="btn btn-outline-warning" onClick={shutdownAllBots}>
            Shutdown all bots
          </button>
        </div>
        <div className="col">
          <button className="btn btn-outline-warning" onClick={shutdownManager}>
            Shutdown Manager
          </button>
        </div>
        <div className="col">
          <h4>
            <span
              className={`badge rounded-pill  bg-${
                Number(totalProfit) >= 0 ? "success" : "danger"
              }`}
            >
              Total profit: {prevProfit.toFixed(3)}
            </span>
          </h4>
        </div>
      </div>
    </div>
  );
}
