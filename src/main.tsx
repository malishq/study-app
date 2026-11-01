import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/manrope/index.css";
import { App } from "./App";
import { applyAccent, savedAccent } from "./lib/accent";
import "./index.css";

applyAccent(savedAccent());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
