import React from "react";
import { useTable } from "react-table";

const columns = [
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
];

function Td({ children, cell }: any) {
  const style: Partial<Record<"backgroundColor", string>> = {};

  if (cell.column.Header?.toString() === "Status") {
    if (cell.value === "ONLINE") {
      style.backgroundColor = "green";
    } else if (cell.value === "OFFLINE") {
      style.backgroundColor = "grey";
    } else if (cell.value === "SHUTTING DOWN" || cell.value === "STARTING UP") {
      style.backgroundColor = "orange";
    } else if (cell.value === "NOT WORKING") {
      style.backgroundColor = "red";
    }
  }

  return (
    <td {...cell.getCellProps()} style={style}>
      {cell.render("Cell")}
    </td>
  );
}

function Table({ columns, data }: any) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <table
      className="table table-dark table-hover"
      style={{ borderTop: "thin solid grey" }}
      {...getTableProps()}
    >
      <thead>
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

export function TableExample({ data }: any) {
  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
}
