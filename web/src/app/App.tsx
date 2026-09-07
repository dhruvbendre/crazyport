import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { RouteTransitionOverlay } from "../components/transitions/RouteTransitionOverlay";
import { CursorUfo } from "../components/cursor/CursorUfo";
import { useDocumentVisibility } from "../hooks/useDocumentVisibility";

export function App() {
  useDocumentVisibility();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      {/* Lazy routes resolve under the route overlay, which stays up until the page mounts. */}
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
      <CursorUfo />
      <RouteTransitionOverlay />
    </>
  );
}
