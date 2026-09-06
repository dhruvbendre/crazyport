import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./motion/gsapSetup";
import { router } from "./app/router";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./styles/solar-system.css";
import "./styles/intro.css";
import "./styles/worlds.css";
import "./styles/festival.css";
import "./styles/tailwind.css";
import "./styles/portfolio-intro.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
