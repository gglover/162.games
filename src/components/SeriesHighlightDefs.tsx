import { SERIES_HIGHLIGHT_PATTERN_DEF } from "../constants";

export function SeriesHighlightDefs() {
  return (
    <defs>
      <pattern
        id={SERIES_HIGHLIGHT_PATTERN_DEF}
        x="0"
        y="0"
        width="2"
        height="4"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(45)"
      >
        <line x1="0" y1="0" x2="100" y2="0" stroke="#111" />
      </pattern>
    </defs>
  );
}
