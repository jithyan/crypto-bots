import React from "react";
import type { IBotStateDetails, TBotActions } from "common-util";
import type { List } from "immutable";
import { ImmutableBotInfo, getBotInfo } from "../../state";
import { BotFeed } from "./BotFeed";
import { BotRow } from "./CompactView";

export interface IStateProps {
  lastState: IBotStateDetails;
  symbol: string;
  lastCheckIn: string;
  status: string;
  index: number;
  id: string;
}

export function Dashboard({
  data,
  changes,
}: {
  data: List<ImmutableBotInfo>;
  changes: List<string>;
}) {
  return (
    <>
      <div className="row">
        <div className="col">
          <BotFeed changes={changes} />
        </div>
      </div>
      {data.map((b, index) => (
        <BotRow
          key={`${getBotInfo(b, "id")}-${index + 1}`}
          index={index + 1}
          id={getBotInfo(b, "id")}
        />
      ))}
    </>
  );
}
