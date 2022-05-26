export const spinner = (
  <div
    className="text-center"
    style={{
      paddingTop: "4px",
      paddingBottom: "4px",
    }}
  >
    <div
      style={{ margin: "4px" }}
      className="spinner-grow text-primary"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
    <div
      style={{ margin: "4px" }}
      className="spinner-grow text-secondary"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
    <div
      style={{ margin: "4px" }}
      className="spinner-grow text-success"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);
