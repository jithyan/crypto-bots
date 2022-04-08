import React from "react";

export function NavBarPanel({
  heading,
  children,
  id,
}: React.PropsWithChildren<{ heading: string; id: string }>) {
  const panelId = `${id}-navbar`;

  return (
    <div className="row">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            {heading}
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target={`#${panelId}`}
            aria-controls={panelId}
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id={panelId}>
            {children}
          </div>
        </div>
      </nav>
    </div>
  );
}
