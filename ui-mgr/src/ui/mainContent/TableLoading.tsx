import React from "react";

export function TableLoading(): JSX.Element {
  return (
    <div
      className="text-center"
      style={{ paddingTop: "48px", paddingBottom: "48px" }}
    >
      <div
        style={{ margin: "8px" }}
        className="spinner-grow text-primary"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <div
        style={{ margin: "8px" }}
        className="spinner-grow text-secondary"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <div
        style={{ margin: "8px" }}
        className="spinner-grow text-success"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <div
        style={{ margin: "8px" }}
        className="spinner-grow text-danger"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <div
        style={{ margin: "8px" }}
        className="spinner-grow text-warning"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <div
        style={{ margin: "8px" }}
        className="spinner-grow text-info"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <div
        style={{ margin: "8px" }}
        className="spinner-grow text-light"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
