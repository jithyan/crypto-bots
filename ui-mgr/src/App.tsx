import React from "react";
import { useBotStatus } from "./api";
import { ControlPanel } from "./ControlPanel";
import { Dashboard } from "./Dashboard";

function App() {
  const data = useBotStatus();

  return (
    <div className="container-fluid px-4">
      <header>
        <h1 style={{ color: "whitesmoke", paddingBottom: "32px" }}>
          Bot Manager
        </h1>
      </header>
      <main>
        <ControlPanel data={data} />
        <Dashboard data={data} />
      </main>
    </div>
  );
}

export default App;
