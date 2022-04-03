import React from "react";
import type { IBotStateDetails } from "common-util";
import type { List } from "immutable";
import { BotFeed } from "./BotFeed";
import { BotRow } from "./BotRow";
import type { ImmutableBotCollection } from "src/state/botRegistry";

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
      {data
        .map((_, id) => (
          <BotRow key={`row-${++index}-${id}`} index={index} id={id} />
        ))
        .toList()}
    </>
  );
}
