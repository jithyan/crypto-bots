import React from "react";
import { ActionButton } from "./helper";
import { LastState, Table } from "./Table";

const columnHeaders = [
  {
    Header: "Symbol",
    accessor: "symbol",
  },
  {
    Header: "Exchange",
    accessor: "exchange",
  },
  {
    Header: "Version",
    accessor: "version",
  },
  {
    Header: "Status",
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

function parseBotData(d: Record<string, any>) {
  return {
    ...d,
    profitToDate: d.lastState?.stats?.usdProfitToDate ?? "0",
    lastState: (
      <LastState
        status={d.status}
        lastState={d.lastState}
        lastCheckIn={d.lastCheckIn}
      />
    ),
    actions: Object.keys(d.actions).map((action) => (
      <ActionButton
        key={`${d.id}-${action}`}
        id={d.id}
        path={d.actions[action]}
        action={action}
      />
    )),
  };
}

export function Dashboard({ data }: any) {
  return (
    <>
      <Table columns={columnHeaders} data={data.map(parseBotData)} />
    </>
  );
}
