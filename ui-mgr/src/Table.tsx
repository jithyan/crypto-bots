import React, { useState, useLayoutEffect } from "react";
import { useTable } from "react-table";

function Td({ children, cell }: any) {
  const style: Partial<Record<"backgroundColor", string>> = {};

  if (cell.column.Header?.toString() === "Profit to Date") {
    if (cell.value.startsWith("-")) {
      style.backgroundColor = "red";
    } else {
      style.backgroundColor = "green";
    }
  }

  if (cell.column.Header?.toString() === "Status") {
    if (cell.value === "ONLINE") {
      style.backgroundColor = "#28a745";
    } else if (cell.value === "OFFLINE") {
      style.backgroundColor = "grey";
    } else if (cell.value === "SHUTTING DOWN" || cell.value === "STARTING UP") {
      style.backgroundColor = "#ffc107";
    } else if (cell.value === "NOT WORKING") {
      style.backgroundColor = "#dc3545";
    }
  }

  return (
    <td {...cell.getCellProps()} style={style}>
      {cell.render("Cell")}
    </td>
  );
}

export function Table({ data, columns }: any) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <table
      className="table table-sm table-dark table-hover"
      style={{ borderTop: "thin solid grey" }}
      {...getTableProps()}
    >
      <thead className="thead-dark">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th scope="col" {...column.getHeaderProps()}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <Td key={cell.getCellProps().key} cell={cell} />
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
