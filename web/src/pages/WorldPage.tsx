import { useParams } from "react-router-dom";
import { planetForSlug } from "../data/planets";
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
  // Reserved worlds (Cadence, Whimsel) keep their code but are not exposed.
  if (!planet || planet.reserved) return <NotFoundPage />;
  const content = festivalBySlug[planet.slug];
  if (!content) return <NotFoundPage />;
  return <FestivalPage content={content} theme={themeForPlanet(planet)} planet={planet} />;
}
