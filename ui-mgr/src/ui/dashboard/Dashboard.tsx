import React, { useDeferredValue, useMemo } from "react";
import type { List } from "immutable";
import { BotFeed } from "./BotFeed";
import { BotRow } from "./BotRow";
import type { ImmutableBotCollection } from "../../state/botRegistry";
import { useBotFilterQueryValue, useBotSortMethod } from "ui-mgr/src/state";

export function Dashboard({
  data,
  changes,
}: {
  data: ImmutableBotCollection;
  changes: List<string>;
}) {
  const filterQuery = useBotFilterQueryValue();
  const [sortMethod] = useBotSortMethod();
  const deferredDataListChange = useDeferredValue(data.count());

  const deferredBotRows = useMemo(() => {
    let index = 1;
    return data
      .map((_, id) => (
        <BotRow key={`row-${++index}-${id}`} index={index} id={id} />
      ))
      .toList();
  }, [sortMethod, deferredDataListChange]);

  return (
    <>
      <div className="row">
        <div className="col">
          <BotFeed changes={changes} />
        </div>
      </div>
      {deferredBotRows}
    </>
  );
}
