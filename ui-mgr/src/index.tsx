import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import React from "react";
import { createRoot } from "react-dom/client";
import { RecoilRoot } from "recoil";
import App from "./ui/App";

const container: HTMLElement = document.getElementById("root")!;
const root = createRoot(container as HTMLElement);

root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
