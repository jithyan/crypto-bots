import React from "react";
import styled from "styled-components";
import { useTable } from "react-table";

const data = [
  {
    id: "12456387879342384292",
    version: "d27bc23",
    exchange: "binance",
    symbol: "XRPBUSD",
    port: "65341",
    location: "./binance_xrpbusd_appState.json",
    hostname: "0.0.0.0",
    status: "HEALTHY",
  },
  {
    id: "5899427923080428277",
    version: "d27bc23",
    exchange: "binance",
    symbol: "ADABUSD",
    port: "15088",
    location: "./binance_adabusd_appState.json",
    hostname: "0.0.0.0",
    status: "HEALTHY",
  },
  {
    id: "9569284917431328165",
    version: "d27bc23",
    exchange: "binance",
    symbol: "AVAXBUSD",
    port: "34755",
    location: "./binance_avaxbusd_appState.json",
    hostname: "0.0.0.0",
    status: "HEALTHY",
  },
  {
    id: "5080786617416480529",
    version: "d27bc23",
    exchange: "binance",
    symbol: "ETHBUSD",
    port: "44858",
    location: "./binance_ethbusd_appState.json",
    hostname: "0.0.0.0",
    status: "HEALTHY",
  },
];

const columns = [
  {
    Header: "Version",
    accessor: "version",
  },
  {
    Header: "Exchange",
    accessor: "exchange",
  },
  {
    Header: "Symbol",
    accessor: "symbol",
  },
  {
    Header: "Status",
    accessor: "status",
  },
];

function Table({ columns, data }: any) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function TableExample() {
  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
}
