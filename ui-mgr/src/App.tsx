import React, { useState, useEffect } from "react";
import { TableExample } from "./TableExample";
import axios from "axios";

const resp = axios.get("http://35.243.104.152/bots").then((data) => {
  console.log(data);
});

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
