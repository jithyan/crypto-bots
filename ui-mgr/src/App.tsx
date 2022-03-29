import React, { useRef } from "react";
import { BotEventData, useBotStream } from "./api";
import { ControlPanel } from "./ControlPanel";
import { Dashboard } from "./Dashboard";
import { PasswordModal } from "./PasswordModal";
import { PasswordContextProvider } from "./PasswordContext";
import { useBotFeed, useSortedBotList, useUpdateBotRegistry } from "./state";

function App() {
  const updateBotRegistry = useUpdateBotRegistry();
  const [feed, updateFeed] = useBotFeed();

  const updateState = useRef((action: BotEventData) => {
    if (action.event === "botupdate") {
      setTimeout(() => {
        updateFeed(action.data);
        updateBotRegistry(action);
      }, 0);
    } else {
      updateBotRegistry(action);
    }
  });
  useBotStream(updateState.current);

  const sortedData = useSortedBotList();

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
          <ControlPanel data={sortedData} />
          <Dashboard data={sortedData} changes={feed} />
        </PasswordContextProvider>
      </main>
    </div>
  );
}

export default App;
