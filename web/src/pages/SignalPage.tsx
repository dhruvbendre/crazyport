import { festivalBySlug } from "../data/festival";
import { planetForSlug } from "../data/planets";
import { SIGNAL_THEME, themeForPlanet } from "../components/layout/WorldTheme";
import { FestivalPage } from "./FestivalPage";

/** About me and contact: the ringed world (saturn slot), the end of the journey. */
export function SignalPage() {
  const planet = planetForSlug("signal");
  const theme = planet ? themeForPlanet(planet) : SIGNAL_THEME;
  return <FestivalPage content={festivalBySlug.signal} theme={theme} planet={planet} />;
}
