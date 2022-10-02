import React from "react";
import { PasswordModal, PasswordContextProvider } from "./password";
import { MainContent } from "./mainContent";

function App(): JSX.Element {
  return (
    <div id="container" className="container-fluid px-4">
      <div className="row" style={{ paddingTop: "24px" }}>
        <div className="col">
          <Header />
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

export function Header(): JSX.Element {
  return (
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
        <em>
          Bots trading crypto scam tokens using a dumb momentum based trading
          strategy.
        </em>
      </p>

      <p className="text-center text-light">
        by{" "}
        <a
          style={{ color: "#7CB9E8" }}
          href="https://www.linkedin.com/in/jithyan"
        >
          Jithya Nanayakkara
        </a>
      </p>
      <p className="text-center text-light">
        (Due to the crypto crash, they no longer make actual trades, but
        simulated trades against the actual price on Binance.)
      </p>
    </header>
  );
}

export default App;
