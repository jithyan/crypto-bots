import React, { useState, startTransition } from "react";
import { useBotFilter, useBotSortMethod } from "../../state";
import { NavBarDropdown, NavBarDropdownItem } from "./NavBar/NavBarDropdown";

export function SortFilterDropdown(): JSX.Element {
  const setFilter = useBotFilter();
  const [filterValue, setFilterValue] = useState("");

  const [_, setSortMethod] = useBotSortMethod();

  return (
    <NavBarDropdown id="sortAndFilterDropdown" heading="Sort and Filter">
      <NavBarDropdownItem>
        <button
          className="btn btn-outline-light"
          onClick={() =>
            setSortMethod((prev) =>
              prev === "statusDesc" ? "statusAsc" : "statusDesc"
            )
          }
        >
          Status
        </button>
      </NavBarDropdownItem>
      <NavBarDropdownItem>
        <button
          className="btn small btn-outline-light"
          onClick={() =>
            setSortMethod((prev) =>
              prev === "symbolDesc" ? "symbolAsc" : "symbolDesc"
            )
          }
        >
          Symbol
        </button>
      </NavBarDropdownItem>
      <NavBarDropdownItem>
        <button
          className="btn btn-outline-light"
          onClick={() =>
            setSortMethod((prev) =>
              prev === "profitDesc" ? "profitAsc" : "profitDesc"
            )
          }
        >
          Profit
        </button>
      </NavBarDropdownItem>
      <NavBarDropdownItem>
        <button
          className="btn btn-outline-light"
          onClick={() => setSortMethod("updateTime")}
        >
          Next update
        </button>
      </NavBarDropdownItem>
      <NavBarDropdownItem>
        <label className="form-label">
          Filter by symbol
          <input
            className="form-control"
            type="text"
            value={filterValue}
            onChange={(e) => {
              const value = e.target.value ?? "";
              setFilterValue(value);
              startTransition(() =>
                setFilter({
                  method: "symbol",
                  value,
                })
              );
            }}
          />
        </label>
      </NavBarDropdownItem>
    </NavBarDropdown>
  );
}
