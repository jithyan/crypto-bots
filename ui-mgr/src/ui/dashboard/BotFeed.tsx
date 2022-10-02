import React from "react";
import type { List } from "immutable";

export function BotFeed({ changes }: { changes: List<string> }): JSX.Element {
  return (
    <div
      className={"card bg-dark border-light mb-3"}
      style={{
        width: "32rem",
        margin: "auto",
        color: "limegreen",
        padding: "8px",
        marginTop: "16px",
      }}
    >
      <div
        className="card-header text-light"
        style={{
          margin: "auto",
          marginTop: "0",
          marginBottom: "0",
          padding: "0",
        }}
      >
        <strong>Bot Feed</strong>
      </div>
      {changes.size > 0 ? (
        changes.map((change, id) => (
          <p
            style={{ paddingBottom: "0", margin: "0" }}
            key={`${change}-${id}`}
          >
            <small>{change}</small>
          </p>
        ))
      ) : (
        <p style={{ paddingBottom: "0", margin: "auto" }}>
          <small>Waiting for a bot update...</small>
        </p>
      )}
    </div>
  );
}
