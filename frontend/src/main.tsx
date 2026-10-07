import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/design-system/globals.css";
import { ThemeProvider } from "@/design-system/theme";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
