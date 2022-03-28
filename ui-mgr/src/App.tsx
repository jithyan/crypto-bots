import React from "react";
import { useBotStream } from "./api";
import { ControlPanel } from "./ControlPanel";
import { Dashboard } from "./Dashboard";
import { useBotState } from "./botState";
import { PasswordModal } from "./PasswordModal";
import { PasswordContextProvider } from "./PasswordContext";

function App() {
  const [botData, changes, updateBotDataOnEvent] = useBotState();
  useBotStream(updateBotDataOnEvent);

  return (
    <div id="container" className="container-fluid px-4">
      <header>
        <h1
          className="text-center"
          style={{
            color: "whitesmoke",
          }}
        >
          Bot Manager
        </h1>
        <p
          className="text-center text-light"
          style={{ paddingBottom: "0", marginBottom: "0" }}
        >
          Crypto bots attempting to profitably execute momentum trades.
        </p>
        <p className="text-center text-light">
          By{" "}
          <a href="https://www.linkedin.com/in/jithyan">Jithya Nanayakkara</a>
        </p>
      </header>
      <main>
        <PasswordContextProvider>
          <PasswordModal />
          <ControlPanel data={botData} />
          <Dashboard data={botData} changes={changes} />
        </PasswordContextProvider>
      </main>
    </div>
  );
}

export default App;
