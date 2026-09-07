import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "../motion/gsapSetup";
import { HOME_ROUTE, journeyOrder, planetById, SIGNAL_ROUTE, type PlanetConfig } from "../data/planets";
import type { FestivalCard, FestivalContent } from "../data/festival/types";
import { profiles } from "../data/portfolio";
import { site } from "../config/site";
import { themeStyle, type WorldTheme } from "../components/layout/WorldTheme";
import { BackToSystem } from "../components/layout/BackToSystem";
import { WorldHorizon } from "../components/layout/WorldHorizon";
import { PLANET_ART } from "../art/PlanetArtRegistry";
import { CX as DISC_CX, CY as DISC_CY, DISC_PALETTES, DiscArt, R as DISC_R } from "../art/DiscArt";
import type { ArtMeta } from "../art/CelestialArtProps";
import { CrayonDefs } from "../art/CrayonMarks";
import { ArtFrame } from "../components/solar-system/ArtFrame";
import { ChalkOutline } from "../components/solar-system/ChalkOutline";
import { ChalkFrame } from "../components/solar-system/ChalkFrame";
import { ChalkDefs } from "../components/solar-system/SceneDefs";
import { ArchiveChat } from "../components/festival/ArchiveChat";
import { ScrollCompanion } from "../components/festival/ScrollCompanion";
import { WorldGlyph } from "../art/WorldGlyph";
import { playPageEnter } from "../motion/routeTransitions";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * Every decorative doodle, patch and icon was removed on 2026-09-05 so the
 * pages read clean: the only drawings left are the world's own planet, the
 * chalk perimeters, and (on Sonara) the record discs.
 */

/**
 * The world's planet, large, on the board. Uses `assets.planetImage` when a
 * finished image is supplied; otherwise the same crayon body drawn for the
 * home scene and the horizon. Signal has no planet, so it shows a clearly
 * labelled placeholder until an image arrives.
 */
function BoardPlanet({ content, planet, theme }: { content: FestivalContent; planet?: PlanetConfig; theme: WorldTheme }) {
  const image = content.assets?.planetImage;
  if (image) {
    return <img className="fest-planet__img" src={image} alt={`${theme.name}, the ${theme.section} world`} />;
  }
  if (planet) {
    const art = PLANET_ART[planet.id];
    // Fit the whole drawing (rings included) inside the box; bodies without
    // rings fill it to a 100-unit radius.
    const halfW = Math.max(art.extent.left, art.extent.right);
    const halfH = Math.max(art.extent.top, art.extent.bottom);
    const scale = Math.min(124 / halfW, 124 / halfH, 100 / art.bodyRadius);
    const R = art.bodyRadius * scale;
    return (
      <svg className="fest-planet__svg" viewBox="0 0 260 260" role="img" aria-label={`${theme.name}, the ${theme.section} world`}>
        <g transform="translate(130 130)">
          <ArtFrame art={art} scale={scale} />
          <ChalkOutline radius={R} seed={planet.orbitDuration * 31 + 7} weight={2.4} points={32} dust={16} />
        </g>
      </svg>
    );
  }
  return (
    <div className="fest-planet__placeholder" role="img" aria-label="Planet image placeholder">
      <WorldGlyph glyph={theme.glyph} size={54} />
      <span>planet image · placeholder</span>
    </div>
  );
}

/**
 * One crayon record on the discs row: the same drawing as Sonara's planet
 * (art/DiscArt) in another palette and seed, with the chalk perimeter the
 * planets wear on the home scene.
 */
function SongDisc({ hue, seed, label }: { hue: keyof typeof DISC_PALETTES; seed: number; label?: string }) {
  const palette = DISC_PALETTES[hue];
  const art: ArtMeta = {
    Component: (props) => <DiscArt {...props} palette={palette} seed={seed} name={`disc-${hue}`} />,
    viewBox: { width: DISC_CX * 2, height: DISC_CY * 2 },
    center: { x: DISC_CX, y: DISC_CY },
    bodyRadius: DISC_R,
    extent: { left: DISC_R + 2, right: DISC_R + 2, top: DISC_R + 2, bottom: DISC_R + 2 }
  };
  const scale = 100 / DISC_R;
  return (
    <svg className="fest-disc__svg" viewBox="0 0 260 260" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <g transform="translate(130 130)">
        {/* The record itself spins while its track plays; the chalk stays still. */}
        <g className="fest-disc__spin">
          <ArtFrame art={art} scale={scale} />
        </g>
        <ChalkOutline radius={100} seed={seed} weight={2.4} points={32} dust={16} />
      </g>
    </svg>
  );
}

/**
 * One shared player for the discs row: at most one record plays at a time.
 * Tapping a disc plays its track (and stops whichever was playing); tapping
 * the playing disc pauses it. Nothing plays until the visitor taps.
 */
function useDiscPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = useCallback((src: string) => {
    const current = audioRef.current;
    if (current && current.dataset.src === src) {
      if (current.paused) {
        void current.play().then(() => setPlaying(src)).catch(() => setPlaying(null));
      } else {
        current.pause();
        setPlaying(null);
      }
      return;
    }
    current?.pause();
    const next = new Audio(src);
    next.dataset.src = src;
    next.preload = "auto";
    next.addEventListener("ended", () => setPlaying((p) => (p === src ? null : p)));
    next.addEventListener("pause", () => setPlaying((p) => (p === src && next.ended ? null : p)));
    audioRef.current = next;
    void next.play().then(() => setPlaying(src)).catch(() => setPlaying(null));
  }, []);

  return { playing, toggle };
}

function isInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

function Cta({ href, className, children }: { href: string; className: string; children: React.ReactNode }) {
  if (isInternal(href)) {
    return (
      <Link className={className} to={href}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a className={className} href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
      {children}
    </a>
  );
}

/**
 * One ticket card: the name and one action on the left, at most three plain
 * lines on the right, a chalk perimeter around the paper. The content files
 * still carry two tabs of detail; only the first tab's first three lines are
 * shown (2026-09-05: "as little text as possible").
 */
const CARD_LINES = 3;

/** Only these worlds show the lineup tags under the hero (2026-09-05: "keep it in sonara and skills only"). */
const WORLDS_WITH_LINEUP = new Set(["ferrin", "sonara"]);

function StageCard({ content, card, index }: { content: FestivalContent; card: FestivalCard; index: number }) {
  const first = card.tabs[0];
  const image = content.assets?.cardImages?.[index] ?? card.image;
  const lines = first.items ? first.items.slice(0, CARD_LINES) : first.text ? [first.text] : [];
  return (
    <article className={`fest-card${card.logo ? " fest-card--logo" : ""}`} data-enter>
      <div className="fest-card__paper">
        <ChalkFrame seed={500 + index * 17} weight={2.2} inset={7} dust={10} />
        {card.logo && (
          <img
            className={`fest-card__logo${card.logo.dark ? " fest-card__logo--ink" : ""}`}
            src={card.logo.src}
            alt={card.logo.alt}
            loading="lazy"
          />
        )}
        <div className="fest-card__left">
          <h3 className="fest-card__lockup">
            {card.lockup.map((w) => (
              <span key={w}>{w}</span>
            ))}
          </h3>
          <p className="fest-card__meta">{card.meta[0]}</p>
          <Cta className="fest-btn fest-btn--red fest-btn--small" href={card.button.href}>
            {card.button.label}
          </Cta>
        </div>
        <div className="fest-card__right">
          {image && <img className="fest-card__image" src={image} alt="" loading="lazy" />}
          <ul className="fest-card__list">
            {lines.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

type Props = {
  content: FestivalContent;
  theme: WorldTheme;
  /** The planet whose crayon body rises as the horizon and sits on the board. Signal has none. */
  planet?: PlanetConfig;
};

/**
 * The festival poster interior, shared by every world (festival-pages-brief.md
 * §1). Ten blocks in a fixed order; colours, doodles and copy come from the
 * world's content file.
 */
export function FestivalPage({ content, theme, planet }: Props) {
  const pageRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const discPlayer = useDiscPlayer();

  useEffect(() => {
    document.title = `${theme.name} · ${theme.section} · ${site.titleSuffix}`;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [theme]);

  useGSAP(
    () => {
      if (pageRef.current) playPageEnter(pageRef.current, reducedMotion);
    },
    { scope: pageRef, dependencies: [theme.slug] }
  );

  const nextLink = (() => {
    if (content.footer.next) return content.footer.next;
    if (!planet) return { label: "Return to orbit", to: HOME_ROUTE };
    const index = journeyOrder.indexOf(planet.id);
    if (index < 0 || index === journeyOrder.length - 1) return { label: "Next · Signal · About & contact", to: SIGNAL_ROUTE };
    const next = planetById[journeyOrder[index + 1]];
    return { label: `Next · ${next.name} · ${next.descriptor}`, to: next.route };
  })();

  const tiers = [1, 2, 3, 4, 5] as const;
  const t = content.theme;
  const info = content.info;
  const style: CSSProperties = {
    ...themeStyle(theme),
    "--f-poster": t.poster,
    "--f-nav": t.nav,
    "--f-tick": t.ticker,
    "--f-tick-ink": t.tickerInk ?? "#18120f",
    "--f-board": t.board,
    "--f-b1": t.blocks[0],
    "--f-b2": t.blocks[1],
    "--f-b3": t.blocks[2],
    "--f-b4": t.blocks[3],
    "--f-shadow": t.shadow ?? "#0084ff"
  } as CSSProperties;

  return (
    <main ref={pageRef} className="world festival" style={style} id="main" data-world={theme.slug} data-texture={theme.texture}>
      {/* The world's resident: greets, then follows the visitor down the page. */}
      <ScrollCompanion slug={theme.slug} />
      {/* 0 · Shared SVG defs: chalk filters and paper tooth, once per page */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <CrayonDefs />
        <ChalkDefs />
      </svg>

      {/* 1 · (The moving ticker strip that opened every page was removed on 2026-09-05.) */}

      {/* 2 · Nav */}
      <header className="fest-nav" data-enter>
        <div className="fest-nav__inner">
          <div className="fest-nav__brand">
            <BackToSystem pageRef={pageRef} />
            <span className="fest-nav__lockup" aria-hidden="true">
              {content.lockup.name}
              <small>{content.lockup.sub}</small>
            </span>
          </div>
          <nav className="fest-nav__links" aria-label={`${theme.name} sections`}>
            {content.nav.links.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
            <Cta className="fest-btn fest-btn--red fest-btn--nav" href={content.nav.cta.to}>
              {content.nav.cta.label}
            </Cta>
          </nav>
        </div>
      </header>

      {/* 3 + 4 · Hero band and poster */}
      <section className="fest-hero" aria-labelledby="fest-title">
        <div className="fest-hero__top">
          <div className="fest-hero__headline" data-enter>
            <p className="fest-eyebrow">{content.hero.eyebrow}</p>
            <h1 id="fest-title" className="fest-h1">
              {content.hero.title}
            </h1>
            <p className="fest-hero__line">{content.hero.line}</p>
          </div>
        </div>
        <div className="fest-hero__tear" aria-hidden="true" />
        {!WORLDS_WITH_LINEUP.has(content.world) ? (
          /* No tags on this world; the anchor stays so nav links still land here. */
          <div className="fest-hero__poster fest-hero__poster--bare" id="lineup" />
        ) : (
        <div className="fest-hero__poster" id="lineup">
          <div className="fest-lineup" data-enter>
            {tiers.map((tier) => {
              const acts = content.lineup.filter((a) => a.tier === tier);
              if (!acts.length) return null;
              return (
                <p key={tier} className={`fest-lineup__row fest-lineup__row--${tier}`}>
                  {acts.map((a) => (
                    <span key={a.name} className="fest-lineup__act">
                      {a.href ? (
                        <a href={a.href} target={/^https?:/.test(a.href) ? "_blank" : undefined} rel={/^https?:/.test(a.href) ? "noreferrer" : undefined}>
                          {a.name}
                        </a>
                      ) : (
                        a.name
                      )}
                    </span>
                  ))}
                </p>
              );
            })}
            <p className="fest-lineup__foot">{content.lineupFoot}</p>
            {content.sampleNote && (
              <p className="fest-sample" role="note">
                {content.sampleNote}
              </p>
            )}
          </div>
        </div>
        )}
      </section>

      {/* 5 · Board: the name and the planet on the left, the world's story on the right */}
      {/* Worlds with a chat hand the #ask anchor to it; the others keep it on the board. */}
      <section className="fest-panel" id={content.chat ? "board" : "ask"} aria-label={`${content.board.name}: ${content.board.category}`}>
        <div className="fest-panel__inner" data-enter>
          <ChalkFrame seed={planet ? planet.orbitDuration : 77} weight={2.6} inset={9} dust={16} />
          <div className="fest-panel__left">
            <p className="fest-panel__category">{content.board.category}</p>
            <h2 className="fest-panel__world">{content.board.name}</h2>
            <div className="fest-planet" data-planet-slot>
              <BoardPlanet content={content} planet={planet} theme={theme} />
            </div>
          </div>
          <div className="fest-panel__divider" aria-hidden="true" />
          <div className="fest-panel__right">
            <p className="fest-panel__tagline">{content.board.tagline}</p>
            <div className="fest-story">
              {content.board.story.map((para, i) => (
                <p key={i} className={i === 0 ? "fest-story__lead" : undefined}>
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5a · Chat: the conversation with the archive (Mnemora) */}
      {content.chat && <ArchiveChat chat={content.chat} seed={theme.seed * 3 + 11} />}

      {/* 5b · Discs: crayon records in the planet's family (Sonara's top songs) */}
      {content.discs && (
        <section className="fest-discs" id="discs" aria-labelledby="fest-discs-title">
          <div className="fest-discs__inner">
            <h2 id="fest-discs-title" className="fest-sticker" data-enter>
              <span className="fest-sticker__wide">{content.discs.title[0]}</span> <span>{content.discs.title[1]}</span>
            </h2>
            <ol className="fest-discs__row">
              {content.discs.items.map((d, i) => {
                const label = `${d.title} by ${d.artist}`;
                const isPlaying = d.audio !== undefined && discPlayer.playing === d.audio;
                const disc = <SongDisc hue={d.hue} seed={2100 + i * 137} label={d.audio ? undefined : label} />;
                return (
                  <li key={d.title} className="fest-disc" data-enter data-playing={isPlaying ? "true" : undefined}>
                    {d.audio ? (
                      <button
                        type="button"
                        className="fest-disc__art fest-disc__art--play"
                        aria-pressed={isPlaying}
                        aria-label={`${isPlaying ? "Pause" : "Play"} ${label}`}
                        onClick={() => discPlayer.toggle(d.audio!)}
                      >
                        {disc}
                      </button>
                    ) : d.href ? (
                      <a className="fest-disc__art" href={d.href} target="_blank" rel="noreferrer">
                        {disc}
                      </a>
                    ) : (
                      <div className="fest-disc__art">{disc}</div>
                    )}
                    <p className="fest-disc__index" aria-hidden="true">
                      {d.audio ? (isPlaying ? "Now playing · tap to pause" : `${String(i + 1).padStart(2, "0")} · tap to play`) : String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="fest-disc__title">{d.title}</h3>
                    <p className="fest-disc__artist">{d.artist}</p>
                    <p className="fest-disc__note">{d.note}</p>
                  </li>
                );
              })}
            </ol>
            {content.discs.foot && <p className="fest-discs__foot">{content.discs.foot}</p>}
          </div>
        </section>
      )}

      {/* 6 · Ticket cards */}
      <section className="fest-stages" id="stages" aria-labelledby="fest-stages-title">
        <div className="fest-stages__inner">
          <h2 id="fest-stages-title" className="fest-sticker" data-enter>
            <span className="fest-sticker__wide">{content.sticker[0]}</span> <span>{content.sticker[1]}</span>{" "}
            <span className="fest-sticker__wide">{content.sticker[2]}</span>
          </h2>
          <div className="fest-cards">
            {content.cards.map((c, i) => (
              <StageCard key={c.lockup.join("-")} content={content} card={c} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* 7 · Information (optional) */}
      {info && (
        <section className="fest-info" id="notes" aria-labelledby="fest-notes-title">
          <div className="fest-info__inner">
            <h2 id="fest-notes-title" className="fest-label" data-enter>
              <span className="fest-label__wide">{info.label[0]}</span> <span>{info.label[1]}</span>
            </h2>
            <div className="fest-blocks">
              {info.blocks.map((block) => (
                <div key={block.title} className="fest-block" data-enter>
                  <h3>{block.title}</h3>
                  {block.items.map((it) => (
                    <div key={it.q} className="fest-block__item">
                      <p className="fest-block__q">{it.q}</p>
                      <p className="fest-block__a">{it.a}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="fest-info__albums" data-enter>
              <h3 className="fest-label fest-label--small">
                <span className="fest-label__wide">{info.chips.title[0]}</span> <span>{info.chips.title[1]}</span>
              </h3>
              <ul className="fest-albums">
                {info.chips.items.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 8 · Partner strip */}
      <section className="fest-partners" aria-label="Tools and partners">
        <div className="fest-partners__inner" data-enter>
          {content.partners.rows.map((row) => (
            <div key={row.key} className={`fest-partners__row${row.size === "small" ? " fest-partners__row--small" : ""}`}>
              <span className="fest-partners__key">{row.key}</span>
              {row.items.map((p) => (
                <span key={p} className={`fest-partners__logo${row.size === "big" ? " fest-partners__logo--big" : row.size === "small" ? " fest-partners__logo--small" : ""}`}>
                  {p}
                </span>
              ))}
            </div>
          ))}
          <div className="fest-partners__promo">
            <span>{content.partners.promo.key}</span>
            <strong>{content.partners.promo.name}</strong>
            <small>{content.partners.promo.sub}</small>
          </div>
        </div>
      </section>

      {/* 9 · Footer */}
      <footer className="fest-footer">
        <div className="fest-footer__inner" data-enter>
          <div className="fest-footer__global">
            <p className="fest-footer__big">
              {content.footer.big[0]}
              <br />
              {content.footer.big[1]}
            </p>
            <Link className="fest-btn fest-btn--yellow" to={nextLink.to}>
              {nextLink.label}
            </Link>
          </div>
          <div className="fest-footer__logo" aria-hidden="true">
            <span>{content.footer.logo[0]}</span>
            <span>{content.footer.logo[1]}</span>
            <small>{content.footer.sub}</small>
          </div>
          <div className="fest-footer__social">
            <div className="fest-footer__icons">
              <a href={profiles.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
                IG
              </a>
              <a href={profiles.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
                in
              </a>
              <a href={profiles.github} aria-label="GitHub" target="_blank" rel="noreferrer">
                GH
              </a>
            </div>
            <p className="fest-footer__by">
              Brought to you by:
              <strong>{site.owner}</strong>
            </p>
          </div>
        </div>
        <p className="fest-footer__legal">
          © {site.owner} <span aria-hidden="true">|</span>{" "}
          {theme.slug !== "signal" && (
            <>
              <Link to={SIGNAL_ROUTE}>about + contact</Link> <span aria-hidden="true">|</span>{" "}
            </>
          )}
          <Link to={HOME_ROUTE}>back to the system</Link>
        </p>
      </footer>

      {/* 10 · Horizon */}
      {planet && <WorldHorizon planetId={planet.id} />}
    </main>
  );
}
