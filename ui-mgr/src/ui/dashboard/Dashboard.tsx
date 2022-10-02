import React, {
  startTransition,
  useDeferredValue,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import type { List } from "immutable";
import { BotFeed } from "./BotFeed";
import { BotHeader, BotRow } from "./BotRow";
import type { ImmutableBotCollection } from "../../state/botRegistry";
import { useBotSortMethod } from "ui-mgr/src/state";

export function Dashboard({
  data,
  changes,
}: {
  data: ImmutableBotCollection;
  changes: List<string>;
}): JSX.Element {
  const [sortMethod] = useBotSortMethod();
  const deferredDataListChange = useDeferredValue(data.count());

  const [
    delayUpdateBotsWhenSortedByUpdateTime,
    setdelayUpdateBotsWhenSortedByUpdateTime,
  ] = useState(0);
  useLayoutEffect(() => {
    if (sortMethod === "updateTime") {
      setTimeout(() => {
        startTransition(() =>
          setdelayUpdateBotsWhenSortedByUpdateTime((prev) => prev + 1)
        );
      }, 5500);
    }
  }, [data, sortMethod]);

  const defferedBotRows = useMemo(() => {
    let index = 1;
    return data
      .map((_, id) => (
        <BotRow key={`row-${++index}-${id}`} index={index} id={id} />
      ))
      .toList();
  }, [
    sortMethod,
    deferredDataListChange,
    delayUpdateBotsWhenSortedByUpdateTime,
  ]);

  return (
    <>
      <div className="row">
        <div className="col">
          <BotFeed changes={changes} />
        </div>
      </div>
      <BotHeader />
      {defferedBotRows}
    </>
  );
}
