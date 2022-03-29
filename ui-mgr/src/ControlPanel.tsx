import React from "react";
import { startupAllBots, shutdownAllBots, shutdownManager } from "./api";
import { usePasswordContext } from "./PasswordContext";
import type { List } from "immutable";
import type { ImmutableBotInfo } from "./state/botRegistry";

export function ControlPanel({ data }: { data: List<ImmutableBotInfo> }) {
  const { setShowPasswordModal, password } = usePasswordContext();
  const totalProfit = data
    .reduce(
      (acc, curr) =>
        acc + Number(curr.get("lastState")?.stats?.usdProfitToDate ?? "0"),
      0
    )
    .toFixed(3);

  const checkPassword = (func: () => void) => () => {
    if (password) {
      func();
    } else {
      setShowPasswordModal(true);
    }
  };

  return (
    <div className="container">
      <div className="row" style={{ paddingBottom: "24px" }}>
        <div className="col">
          <button
            className="btn btn-outline-info"
            onClick={checkPassword(startupAllBots)}
          >
            Start all bots
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-outline-warning"
            onClick={checkPassword(shutdownAllBots)}
          >
            Shutdown all bots
          </button>
        </div>
        <div className="col">
          <button
            className="btn btn-outline-warning"
            onClick={checkPassword(shutdownManager)}
          >
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
              Total profit: {totalProfit}
            </span>
          </h4>
        </div>
      </div>
    </div>
  );
}
