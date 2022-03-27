import React from "react";
import { useBotStream } from "./api";
import { ControlPanel } from "./ControlPanel";
import { Dashboard } from "./Dashboard";
import { useBotState } from "./botState";

function App() {
  const [botData, updateBotDataOnEvent] = useBotState();
  useBotStream(updateBotDataOnEvent);

  return (
    <div className="container-fluid px-4">
      <header>
        <h1 style={{ color: "whitesmoke", paddingBottom: "32px" }}>
          Bot Manager
        </h1>
      </header>
      <main>
        <ControlPanel data={botData} />
        <Dashboard data={botData} />
      </main>
    </div>
  );
}

export default App;
