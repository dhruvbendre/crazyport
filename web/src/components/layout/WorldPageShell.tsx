import { useEffect, useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "../../motion/gsapSetup";
import { planetOrder, planetById, planets, SIGNAL_ROUTE } from "../../data/planets";
import type { PortfolioSection } from "../../data/portfolio";
import { playPageEnter } from "../../motion/routeTransitions";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { WorldGlyph } from "../../art/WorldGlyph";
import { site } from "../../config/site";
import { BackToSystem } from "./BackToSystem";
import { WorldAmbient } from "./WorldAmbient";
import { WorldHorizon } from "./WorldHorizon";
import { ChalkRule } from "./ChalkRule";
import { themeStyle, type WorldTheme } from "./WorldTheme";

type Props = {
  theme: WorldTheme;
  sections?: PortfolioSection[];
  /** Custom interior content rendered between the head and the sections. */
  children?: ReactNode;
  /** Hide the "next orbit" link (Signal, Mnemora). */
  hideNext?: boolean;
  /** Extra class on <main> for page-specific layout. */
  className?: string;
  /** Document title override (defaults to "World · Dhruv Bendre"). */
  title?: string;
};

/**
 * Every interior world is built from this shell (art.md §8): the world's
 * field colour, its ambient marks, a handwritten name and catalog line, chalk
 * rules between sections, and the world's own crayon body risen as a horizon
 * at the foot of the page. Placeholder sections render as uncatalogued panels.
 */
export function WorldPageShell({ theme, sections = [], children, hideNext, className, title }: Props) {
  const pageRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    document.title = title ?? `${theme.name} · ${theme.section} · ${site.titleSuffix}`;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [theme, title]);

  useGSAP(
    () => {
      if (pageRef.current) playPageEnter(pageRef.current, reducedMotion);
    },
    { scope: pageRef, dependencies: [theme.slug] }
  );

  const planet = planets.find((p) => p.slug === theme.slug);
  const index = planet ? planetOrder.indexOf(planet.id) : -1;
  const next = index >= 0 ? planetById[planetOrder[(index + 1) % planetOrder.length]] : null;

  return (
    <main
      ref={pageRef}
      className={`world${className ? ` ${className}` : ""}`}
      style={themeStyle(theme)}
      id="main"
      data-world={theme.slug}
      data-texture={theme.texture}
    >
      <WorldAmbient theme={theme} />
      <div className="world__inner">
        <header className="world__top">
          <BackToSystem pageRef={pageRef} />
          <span className="world__catalog" data-enter>
            <WorldGlyph glyph={theme.glyph} size={18} />
            <span>
              World {theme.catalog}
            </span>
          </span>
        </header>

        <section className="world__head">
          <p className="world__eyebrow" data-enter>
            {theme.catalog} · {theme.section}
          </p>
          <h1 className="world__name" data-enter>
            {theme.name}
          </h1>
          <p className="world__descriptor" data-enter>
            {theme.descriptor}
          </p>
          <ChalkRule seed={theme.seed} className="world__rule world__rule--head" />
          <p className="world__intro" data-enter>
            {theme.intro}
          </p>
        </section>

        {children}

        {sections.length > 0 && (
          <div className="world__sections">
            {sections.map((section, i) => (
              <section key={section.title} className="wsection" data-enter data-placeholder={section.placeholder ? "true" : undefined}>
                <ChalkRule seed={theme.seed + i * 7} className="world__rule" />
                <h2 className="wsection__title">{section.title}</h2>
                <div className="wsection__body">
                  {section.placeholder ? (
                    <div className="uncatalogued">
                      <span className="uncatalogued__mark" aria-hidden="true">
                        <WorldGlyph glyph={theme.glyph} size={16} />
                      </span>
                      <p className="uncatalogued__title">Not yet catalogued.</p>
                      <p className="uncatalogued__note">{section.note ?? "Awaiting verified information."}</p>
                    </div>
                  ) : (
                    <>
                      {section.paragraphs?.map((text, j) => <p key={j}>{text}</p>)}
                      {section.list && (
                        <ul className="wsection__list">
                          {section.list.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      )}
                      {section.links && (
                        <ul className="wsection__links" aria-label={`${section.title}: links`}>
                          {section.links.map((link) => {
                            const external = /^(https?:|mailto:|tel:)/.test(link.href);
                            return (
                              <li key={link.href}>
                                <a
                                  className="wsection__link"
                                  href={link.href}
                                  target={external && !/^(mailto:|tel:)/.test(link.href) ? "_blank" : undefined}
                                  rel={external ? "noreferrer" : undefined}
                                >
                                  {link.label}
                                </a>
                                {link.note && <span className="wsection__link-note"> · {link.note}</span>}
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}

        <footer className="world__footer" data-enter>
          {next && !hideNext ? (
            <Link className="world__next" to={next.route}>
              <span className="world__next-label">Next orbit</span>
              <span className="world__next-name">
                {next.catalog} · {next.name}
                <span className="world__next-section"> · {next.section}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {theme.slug !== "signal" && (
            <Link className="world__signal" to={SIGNAL_ROUTE}>
              <WorldGlyph glyph="signal" size={16} />
              <span>send a signal</span>
            </Link>
          )}
        </footer>
      </div>
      {theme.horizon && <WorldHorizon planetId={theme.horizon} />}
    </main>
  );
}
