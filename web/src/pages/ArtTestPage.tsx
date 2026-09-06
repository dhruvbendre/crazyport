import { useEffect } from "react";
import { Link } from "react-router-dom";
import { planets } from "../data/planets";
import { sceneLayouts } from "../data/sceneLayouts";
import { METEOR_ART, PLANET_ART, SATELLITE_ART, SUN_ART } from "../art/PlanetArtRegistry";
import type { ArtMeta } from "../art/CelestialArtProps";
import { asteroidVariants } from "../art/AsteroidArt";
import { CrayonDefs } from "../art/CrayonMarks";

function Item({ label, art, width, state }: { label: string; art: ArtMeta; width: number; state?: "default" | "hover" | "focus" }) {
  const { Component, viewBox } = art;
  const height = (viewBox.height / viewBox.width) * width;
  return (
    <div className="art-test__item">
      <svg width={width} height={height} viewBox={`0 0 ${viewBox.width} ${viewBox.height}`} aria-hidden="true">
        <Component state={state} />
      </svg>
      <span>{label}</span>
    </div>
  );
}

function Board({ theme, size, title }: { theme: "space" | "paper"; size: "full" | "half" | "scene"; title: string }) {
  const desktop = sceneLayouts.desktop;
  const widthFor = (art: ArtMeta, id?: keyof typeof desktop.planets) => {
    if (size === "full") return art.viewBox.width;
    if (size === "half") return art.viewBox.width / 2;
    // Intended scene size at the desktop reference viewport.
    const radius = id ? desktop.planets[id].radius : desktop.sun.radius;
    return (radius / art.bodyRadius) * art.viewBox.width;
  };
  return (
    <>
      <div className="art-test__row-title">{title}</div>
      <div className={`art-test__board art-test__board--${theme}`}>
        {size !== "scene" && <Item label="Sun" art={SUN_ART} width={widthFor(SUN_ART) * (size === "full" ? 0.5 : 1)} />}
        {planets.map((p) => (
          <Item key={p.id} label={p.name} art={PLANET_ART[p.id]} width={widthFor(PLANET_ART[p.id], p.id)} />
        ))}
        <Item label="Satellite" art={SATELLITE_ART} width={size === "scene" ? 64 : widthFor(SATELLITE_ART)} />
        <Item label="Meteor" art={METEOR_ART} width={size === "scene" ? 120 : widthFor(METEOR_ART)} />
        <div className="art-test__item">
          <svg width={asteroidVariants.length * 30} height={40} viewBox={`0 0 ${asteroidVariants.length * 30} 40`} aria-hidden="true">
            {asteroidVariants.map((v, i) => (
              <g key={i} transform={`translate(${15 + i * 30} 20) scale(1.3)`} fill={["#b39a72", "#c2aa7d", "#8e7c61", "#d0b88a", "#776b59"][i % 5]}>
                <path d={v.body} />
                {v.marks && <path d={v.marks} fill="none" stroke="#5d5142" strokeWidth="1.1" strokeLinecap="round" opacity="0.55" />}
              </g>
            ))}
          </svg>
          <span>Asteroids</span>
        </div>
      </div>
    </>
  );
}

/**
 * Development-only quality-control route: every celestial asset side by side,
 * on black and on cream, at 100%, 50% and at intended scene size.
 */
export function ArtTestPage() {
  useEffect(() => {
    document.title = "Art test · Crayon Solar System";
  }, []);
  return (
    <main className="art-test" id="main">
      <svg width="0" height="0" aria-hidden="true" style={{ position: "absolute" }}>
        <CrayonDefs />
      </svg>
      <Link to="/" className="art-test__link">
        ← Back to universe
      </Link>
      <h1>Art test</h1>
      <p>Compare texture, stroke scale, face size, saturation, colour temperature, edge treatment and relative scale.</p>
      <Board theme="space" size="scene" title="Scene size · black" />
      <Board theme="paper" size="scene" title="Scene size · cream" />
      <Board theme="space" size="half" title="50% · black" />
      <Board theme="space" size="full" title="100% · black (Sun at 50%)" />
    </main>
  );
}
