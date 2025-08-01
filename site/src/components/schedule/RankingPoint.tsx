import { SeriesId } from "../../interfaces";

const RANKING_LINE_COLOR = "#909090";
const RANKING_CHANGE_LINE_COLOR = "#666";
const RANKING_POINT_SIZE = 6;

export interface ScheduleFooterProps {
  x: number;
  yStart: number;
  yEnd: number;
  color: string;
  seriesId: SeriesId;
}

export function RankingPoint({
  x,
  yStart,
  yEnd,
  color,
  seriesId,
}: ScheduleFooterProps) {
  return (
    <g key={seriesId}>
      <line
        x1={x}
        x2={x}
        y1={yStart}
        y2={yEnd}
        stroke={RANKING_LINE_COLOR}
        strokeWidth={"1px"}
      />
      <line
        x1={x - 2}
        x2={x + 2}
        y1={yEnd}
        y2={yEnd}
        stroke={RANKING_LINE_COLOR}
        strokeWidth={"1px"}
      />
      <rect
        // @ts-ignore
        fill={color}
        x={x - RANKING_POINT_SIZE / 2}
        y={yStart}
        width={RANKING_POINT_SIZE}
        height={RANKING_POINT_SIZE}
        stroke={RANKING_CHANGE_LINE_COLOR}
      />
    </g>
  );
}
