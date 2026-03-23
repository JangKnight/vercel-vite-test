import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Nav from "./Nav.tsx";
import FetchProfile from "./Fetch-GH-Profile.tsx";
//import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Nav />
    <FetchProfile />
  </StrictMode>,
);
