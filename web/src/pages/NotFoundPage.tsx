import { useEffect } from "react";
import { Link } from "react-router-dom";
import { site } from "../config/site";

export function NotFoundPage() {
  useEffect(() => {
    document.title = `Nothing orbits here · ${site.titleSuffix}`;
  }, []);
  return (
    <main className="world world--lost" id="main">
      <div className="world__inner">
        <p className="world__eyebrow">Uncharted</p>
        <h1 className="world__name">Nothing orbits here.</h1>
        <p className="world__intro">That address is not on the map.</p>
        <Link className="world__next" to="/">
          <span className="world__next-label">Return</span>
          <span className="world__next-name">Back to the system</span>
        </Link>
      </div>
    </main>
  );
}
