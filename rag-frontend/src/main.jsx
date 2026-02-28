import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App";
import "./assets/styles/globals.css";

/**
 * Application entry point
 * Renders the main App component wrapped with StrictMode for development checks
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
