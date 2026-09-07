/**
 * The world interiors (festival pages, their content, the companion avatar
 * runtime) load on demand so the home scene ships only itself. The chunk is
 * warmed the moment a planet is hovered or focused, and at idle once the
 * scene is interactive, so the hand-off never waits on the network.
 */
export const loadWorlds = () => import("../pages/WorldPage");
export const loadSignal = () => import("../pages/SignalPage");
export const loadArtTest = () => import("../pages/ArtTestPage");

let warmed = false;
/** Start fetching the world-page chunks (idempotent, never throws). */
export function prefetchWorldPages(): void {
  if (warmed) return;
  warmed = true;
  void loadWorlds().catch(() => {
    warmed = false;
  });
  void loadSignal().catch(() => {});
}
