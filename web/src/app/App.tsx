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
      <Outlet />
      <CursorUfo />
      <RouteTransitionOverlay />
    </>
  );
}
