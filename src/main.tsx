import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import AOS from "aos";
import "aos/dist/aos.css";

AOS.init({
  duration: 800, // animation duration in ms
  once: true,    // animation happens only once when scrolling
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);