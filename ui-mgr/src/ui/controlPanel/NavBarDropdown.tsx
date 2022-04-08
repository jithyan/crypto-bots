import React from "react";

export function NavBarDropdown({
  heading,
  id,
  children,
}: React.PropsWithChildren<{ heading?: string; id: string }>) {
  const dropdownId = `${id}-dropdown`;

  return (
    <ul className="navbar-nav">
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id={dropdownId}
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {heading}
        </a>
        <ul
          className="dropdown-menu dropdown-menu-dark"
          aria-labelledby={dropdownId}
        >
          {children}
        </ul>
      </li>
    </ul>
  );
}
