import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { App } from "./App";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { loadArtTest, loadSignal, loadWorlds } from "./lazyPages";

const WorldPage = lazy(() => loadWorlds().then((m) => ({ default: m.WorldPage })));
const SignalPage = lazy(() => loadSignal().then((m) => ({ default: m.SignalPage })));
const ArtTestPage = lazy(() => loadArtTest().then((m) => ({ default: m.ArtTestPage })));

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
