import { useEffect, useState } from "react";
import { SolarSystemStage } from "../components/solar-system/SolarSystemStage";
import { PortfolioIntro, shouldPlayPortfolioIntro } from "../components/intro/PortfolioIntro";
import { site } from "../config/site";

/**
 * Home: the solar system, opened through the portfolio intro.
 *
 * The stage mounts immediately so its own entrance (orbits drawing in, the
 * Sun rising) plays behind the intro and everything is ready the moment the
 * doorway opens. The intro plays once per tab (PortfolioIntro.shouldPlay...).
 * The earlier opening flight (components/intro/UfoIntro.tsx) is kept but no
 * longer mounted.
 */
export function HomePage() {
  const [intro, setIntro] = useState(() => shouldPlayPortfolioIntro());

  useEffect(() => {
    document.title = `${site.owner} · a solar system`;
  }, []);

  return (
    <main id="main">
      <h1 className="visually-hidden">Dhruv Bendre's portfolio, drawn as a solar system. Choose a world to explore.</h1>
      <SolarSystemStage />
      {intro && <PortfolioIntro name={site.owner} onComplete={() => setIntro(false)} />}
    </main>
  );
}
