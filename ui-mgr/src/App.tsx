import React, { useRef } from "react";
import { BotEventData, useBotStream } from "./api";
import { ControlPanel } from "./ControlPanel";
import { Dashboard } from "./Dashboard";
import { PasswordModal } from "./PasswordModal";
import { PasswordContextProvider } from "./PasswordContext";
import { useBotFeed, useSortedBotList, useUpdateBotRegistry } from "./state";

function TableLoading() {
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

function MainContent() {
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

  const loading = useBotStream(updateState.current);
  const sortedData = useSortedBotList();

  return loading ? (
    <TableLoading />
  ) : (
    <>
      <ControlPanel />
      <Dashboard data={sortedData} changes={feed} />
    </>
  );
}

function App() {
  return (
    <div id="container" className="container-fluid px-4">
      <div className="row" style={{ paddingTop: "24px" }}>
        <div className="col">
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
              <a href="https://www.linkedin.com/in/jithyan">
                Jithya Nanayakkara
              </a>
            </p>
          </header>
        </div>
      </div>
      <main>
        <PasswordContextProvider>
          <PasswordModal />
          <MainContent />
        </PasswordContextProvider>
      </main>
    </div>
  );
}

export default App;
