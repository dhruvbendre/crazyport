import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { HomePage } from "../pages/HomePage";
import { WorldPage } from "../pages/WorldPage";
import { SignalPage } from "../pages/SignalPage";
import { ArtTestPage } from "../pages/ArtTestPage";
import { NotFoundPage } from "../pages/NotFoundPage";

/**
 * Routes: the solar system, one route per world (matched by slug against the
 * world registry in data/planets.ts), Signal, the art test board, and a
 * not-found page. World slugs are the fictional names, never planet names.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "signal", element: <SignalPage /> },
      { path: "art-test", element: <ArtTestPage /> },
      { path: ":slug", element: <WorldPage /> },
      { path: "*", element: <NotFoundPage /> }
    ]
  }
]);
