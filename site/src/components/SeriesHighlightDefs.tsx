import {
  GRAYSCAPE_FILTER_DEF,
  SERIES_HIGHLIGHT_PATTERN_DEF,
} from "../constants";
import { Series } from "../interfaces";

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
        <line x1="0" y1="0" x2="100" y2="0" stroke="#888" />
      </pattern>
      <filter id={GRAYSCAPE_FILTER_DEF}>
        <feColorMatrix
          type="matrix"
          values="0.33 0.33 0.33 0 0
                  0.33 0.33 0.33 0 0
                  0.33 0.33 0.33 0 0
                  0 0 0 1 0"
        />
      </filter>
    </defs>
  );
}

export interface SeriesHighlightProps {
  series: Series;
  height: number;
  xScale: d3.ScaleTime<number, number>;
}

export function SeriesYellowHighlighter({
  series,
  height,
  xScale,
}: SeriesHighlightProps) {
  return (
    <rect
      height={height}
      width={xScale(series.end) - xScale(series.start)}
      x={xScale(series.start)}
      y="0"
      fill="yellow"
      opacity={0.1}
    />
  );
}

export function SeriesHashing({
  series,
  height,
  xScale,
}: SeriesHighlightProps) {
  return (
    <rect
      height={height}
      width={xScale(series.end) - xScale(series.start)}
      x={xScale(series.start)}
      y="0"
      className="gradient-repeating-lines"
      fill={`url(#${SERIES_HIGHLIGHT_PATTERN_DEF})`}
    />
  );
}
