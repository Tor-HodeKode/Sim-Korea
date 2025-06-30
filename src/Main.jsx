import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // valgfritt, men vanlig å ha

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
