import type { IBotStateDetails, TBotActions } from "common-util";
import React, { useState } from "react";
import type { Column } from "react-table";
import type { List } from "immutable";
import { getBotInfo, ImmutableBotInfo, useBotSortMethod } from "../../state";
import { Table } from "./Table";
import { ActionButton } from "./ActionButton";
import { BotFeed } from "./BotFeed";
import { ExpandedView } from "./ExpandedView";
import { CompactView } from "./CompactView";

interface BotTableDefinition {
  symbol: string;
  version: string;
  status: string;
  actions: JSX.Element[];
  lastState: JSX.Element;
  profitToDate: string;
}

export interface IStateProps {
  lastState: IBotStateDetails;
  symbol: string;
  lastCheckIn: string;
  status: string;
}

export function StatusHeader() {
  const [_, setSortMethod] = useBotSortMethod();
  return (
    <span
      onClick={() =>
        setSortMethod((prev) =>
          prev === "statusAsc" ? "statusDesc" : "statusAsc"
        )
      }
    >
      Status
    </span>
  );
}

export function RowNumberHeader() {
  const [_, setSortMethod] = useBotSortMethod();
  return <span onClick={() => setSortMethod("")}>#</span>;
}

const columnHeaders: Column<BotTableDefinition>[] = [
  {
    Header: <RowNumberHeader />,
    id: "row",
    maxWidth: 10,
    Cell: (rows: any) => {
      return <div>{rows.row.index}</div>;
    },
  },
  {
    Header: "Symbol",
    accessor: "symbol",
  },
  {
    Header: "Version",
    accessor: "version",
  },
  {
    Header: <StatusHeader />,
    accessor: "status",
  },
  {
    Header: "Actions",
    accessor: "actions",
  },
  {
    Header: "Last State",
    accessor: "lastState",
  },
  {
    Header: "Profit to Date",
    accessor: "profitToDate",
  },
];

function parseImmutableBotData(
  d: ImmutableBotInfo
): Readonly<BotTableDefinition> {
  const status = getBotInfo(d, "status");
  const lastState = getBotInfo(d, "state");
  const profitToDate = lastState.profit;
  const lastCheckIn = getBotInfo(d, "lastCheckIn") ?? "";
  const symbol = getBotInfo(d, "symbol") ?? "";
  const actions = getBotInfo(d, "actions") ?? {};
  const id = getBotInfo(d, "id") ?? "";
  const version = getBotInfo(d, "version") ?? "";

  return {
    symbol,
    version,
    status,
    profitToDate,
    lastState: (
      <ToggleOnClick
        status={status}
        lastState={lastState}
        lastCheckIn={lastCheckIn}
        symbol={symbol}
      />
    ),
    actions: Object.keys(actions).map((action) => (
      <ActionButton
        key={`${id}-${action}`}
        id={id}
        path={actions[action as TBotActions] ?? ""}
        action={action}
      />
    )),
  };
}

function ToggleOnClickNoMemo(props: IStateProps) {
  const [showCompact, setShowCompact] = useState(true);

  return (
    <div onClick={() => setShowCompact((prev) => !prev)}>
      {showCompact ? <CompactView {...props} /> : <ExpandedView {...props} />}
    </div>
  );
}
const ToggleOnClick = React.memo(ToggleOnClickNoMemo);

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
      <div className="row">
        <div className="col">
          <Table
            columns={columnHeaders}
            data={data.map(parseImmutableBotData)}
          />
        </div>
      </div>
    </>
  );
}