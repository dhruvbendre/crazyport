import { useCallback, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { HOME_ROUTE } from "../../data/planets";
import { markReturning } from "../../motion/orbitState";
import { isTransitionLocked, playPageExit } from "../../motion/routeTransitions";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Props = { pageRef: React.RefObject<HTMLElement | null> };

/**
 * A tiny crayon Sun (Hearth) and a handwritten "Back to the system". Lifts
 * the page away, then returns to the solar system where it was left.
 */
export function BackToSystem({ pageRef }: Props) {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();

  const onClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (isTransitionLocked()) return;
      const page = pageRef.current;
      markReturning();
      if (!page) {
        navigate(HOME_ROUTE);
        return;
      }
      void playPageExit(page, reducedMotion, () => navigate(HOME_ROUTE));
    },
    [navigate, pageRef, reducedMotion]
  );

  return (
    <a href={HOME_ROUTE} className="back-link" onClick={onClick} data-enter>
      <svg className="back-link__icon" viewBox="0 0 40 40" aria-hidden="true">
        <g fill="#f5a82c" opacity="0.9">
          <path d="M20 4 l2.4 5 l-4.6 0.3z" />
          <path d="M31 8.6 l-0.4 5.4 l-3.8 -2.6z" />
          <path d="M35.4 19.6 l-4.8 2.6 l-0.2 -4.6z" />
          <path d="M31.6 31 l-5.4 -0.8 l2.4 -3.8z" />
          <path d="M20.4 36 l-2.8 -4.8 l4.6 -0.4z" />
          <path d="M8.6 31.4 l0.6 -5.4 l3.8 2.4z" />
          <path d="M4.6 20.2 l4.8 -2.4 l0 4.6z" />
          <path d="M8.2 8.8 l5.4 0.6 l-2.2 4z" />
        </g>
        <circle cx="20" cy="20" r="10.5" fill="#ffd84a" />
        <path
          d="M20.4 8.2 a12 12 0 1 1 -0.6 0"
          fill="none"
          stroke="#f1f1e8"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeDasharray="30 4 22 3 12 5"
          opacity="0.85"
        />
      </svg>
      <span>Back to the system</span>
    </a>
  );
}
