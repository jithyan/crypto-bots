import React from "react";
import type { IBotStateDetails, TBotActions } from "common-util";
import type { Collection, List } from "immutable";
import { ImmutableBotInfo, getBotInfo } from "../../state";
import { BotFeed } from "./BotFeed";
import { BotRow } from "./CompactView";
import type { ImmutableBotCollection } from "src/state/botRegistry";

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
  data: ImmutableBotCollection;
  changes: List<string>;
}) {
  let index = 0;
  return (
    <>
      <div className="row">
        <div className="col">
          <BotFeed changes={changes} />
        </div>
      </div>
      {data.map((b, id) => (
        <BotRow key={`row-${++index}-${id}`} index={index} id={id} />
      ))}
    </>
  );
}
