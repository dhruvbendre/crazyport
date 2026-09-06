import { Link } from "react-router-dom";
import { SIGNAL_ROUTE } from "../../data/planets";
import { WorldGlyph } from "../../art/WorldGlyph";

/**
 * "Send a signal": the one way to reach Contact from the home scene. A small
 * handwritten chalk mark in the corner, not a navigation bar.
 */
export function SignalMark() {
  return (
    <Link className="signal-mark" to={SIGNAL_ROUTE} aria-label="Signal: about Dhruv and how to contact him">
      <WorldGlyph glyph="signal" size={18} className="signal-mark__glyph" />
      <span className="signal-mark__text">about + contact</span>
    </Link>
  );
}
