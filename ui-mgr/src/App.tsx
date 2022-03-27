import React, { useContext, useState } from "react";
import { useBotStream } from "./api";
import { ControlPanel } from "./ControlPanel";
import { Dashboard } from "./Dashboard";
import { useBotState } from "./botState";
import { PasswordModal } from "./PasswordModal";
import { PasswordContextProvider } from "./PasswordContext";

function App() {
  const [botData, updateBotDataOnEvent] = useBotState();
  useBotStream(updateBotDataOnEvent);

  return (
    <div id="container" className="container-fluid px-4">
      <header>
        <h1 style={{ color: "whitesmoke", paddingBottom: "32px" }}>
          Bot Manager
        </h1>
      </header>
      <main>
        <PasswordContextProvider>
          <PasswordModal />
          <ControlPanel data={botData} />
          <Dashboard data={botData} />
        </PasswordContextProvider>
      </main>
    </div>
  );
}

export default App;
