import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { planetForSlug, planetHref } from "../data/planets";
import { festivalBySlug } from "../data/festival";
import { themeForPlanet } from "../components/layout/WorldTheme";
import { FestivalPage } from "./FestivalPage";
import { NotFoundPage } from "./NotFoundPage";

/**
 * Shared renderer for every world reached by slug. Every world's interior is
 * a festival poster (festival-pages-brief.md) driven by its content file in
 * data/festival/; the world's crayon body rises as the horizon at the foot.
 */
export function WorldPage() {
  const { slug = "" } = useParams();
  const planet = planetForSlug(slug);
  // An external world (Mnemora) lives in its own app: a direct visit to its
  // route forwards there, the same place the planet itself leads.
  const external = planet ? planetHref(planet) : "";
  const forwards = /^https?:/.test(external);
  useEffect(() => {
    if (forwards) window.location.replace(external);
  }, [forwards, external]);
  // Reserved worlds (Cadence, Whimsel) keep their code but are not exposed.
  if (!planet || planet.reserved) return <NotFoundPage />;
  if (forwards) return null;
  const content = festivalBySlug[planet.slug];
  if (!content) return <NotFoundPage />;
  return <FestivalPage content={content} theme={themeForPlanet(planet)} planet={planet} />;
}
