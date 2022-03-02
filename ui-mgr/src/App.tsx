import React, { useState, useEffect } from "react";
import { TableExample } from "./TableExample";

function App() {
  return (
    <div className=".container-fluid px-4">
      <header>
        <h1>Bot Manager</h1>
      </header>
      <main>
        <TableExample />
      </main>
    </div>
  );
}

export default App;
