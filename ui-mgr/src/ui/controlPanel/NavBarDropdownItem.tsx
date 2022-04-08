import React from "react";

export function NavBarDropdownItem({ children }: React.PropsWithChildren<{}>) {
  return (
    <li>
      <div className="dropdown-item">{children}</div>
    </li>
  );
}
