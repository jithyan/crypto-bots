import React from "react";
import { PasswordModal, PasswordContextProvider } from "./password";
import { MainContent } from "./mainContent";

function App() {
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

export function Header() {
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
        Crypto bots attempting to profitably execute momentum trades.
      </p>
      <p className="text-center text-light">
        By <a href="https://www.linkedin.com/in/jithyan">Jithya Nanayakkara</a>
      </p>
    </header>
  );
}

export default App;
