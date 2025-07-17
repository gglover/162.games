import * as d3 from "d3";
import {
  CHART_WIDTH,
  RANKINGS_HEIGHT,
  RANKINGS_PADDING,
  SERIES_HIGHLIGHT_PATTERN_DEF,
} from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import {
  dateToRecordsKey,
  earlierDate,
  goodBadColorScale,
  lastDayPlayed,
  opponentId,
  seriesHalfwayPoint,
} from "../../utils";

const SERIES_LINE_COLOR = "#e0e0e0";
const MIDDLE_LINE_COLOR = "#a0a0a0";
const RANKING_LINE_COLOR = "#707070";
const RANKING_POINT_SIZE = 6;

export interface RankingsProps {
  teamId: TeamId;
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  selectedSeriesId: SeriesId | null;
}

export function Rankings({
  teamId,
  xScale,
  yScale,
  selectedSeriesId,
}: RankingsProps) {
  const scheduleData = useScheduleDataContext();

  const schedule = scheduleData.schedules[teamId].filter(
    (id) => scheduleData.series[id]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let start = new Date();
  start.setTime(scheduleData.start.getTime());

  let end = lastDayPlayed(scheduleData.end);

  const daySamples = d3.timeDays(start, end);

  const rankingLineGenerator = d3
    .line<Date>()
    .x((day: Date) => xScale(day))
    .y(
      (day: Date) =>
        yScale(scheduleData.records[dateToRecordsKey(day)][teamId][2]) +
        RANKINGS_PADDING
    )
    .curve(d3.curveNatural);

  const opponentRankForSeries = (id: SeriesId) => {
    const opponent = opponentId(teamId, scheduleData.series[id]);
    const dateIndex = dateToRecordsKey(scheduleData.series[id].start);
    return scheduleData.records[dateIndex][opponent][2];
  };

  const opponentRankFinal = (id: SeriesId) => {
    const opponent = opponentId(teamId, scheduleData.series[id]);
    const dateIndex = dateToRecordsKey(scheduleData.end);
    return scheduleData.records[dateIndex][opponent][2];
  };

  return (
    <svg
      width={CHART_WIDTH}
      height={RANKINGS_HEIGHT}
      className="border-x-1 border-gray-300"
    >
      <g>
        <line
          x1={xScale(earlierDate(scheduleData.end, today))}
          x2={xScale(earlierDate(scheduleData.end, today))}
          y1={0}
          y2={RANKINGS_HEIGHT}
          stroke="#a0a0a0"
        />

        {schedule.map((id: SeriesId) => (
          <line
            key={id}
            x1={seriesHalfwayPoint(scheduleData.series[id], xScale)}
            x2={seriesHalfwayPoint(scheduleData.series[id], xScale)}
            y1="0"
            y2={RANKINGS_HEIGHT}
            stroke={SERIES_LINE_COLOR}
          />
        ))}

        {selectedSeriesId && (
          <rect
            height={RANKINGS_HEIGHT}
            width={
              xScale(scheduleData.series[selectedSeriesId].end) -
              xScale(scheduleData.series[selectedSeriesId].start)
            }
            x={xScale(scheduleData.series[selectedSeriesId].start)}
            y="0"
            className="gradient-repeating-lines"
            fill={`url(#${SERIES_HIGHLIGHT_PATTERN_DEF})`}
          />
        )}

        <line
          x1="0"
          x2={CHART_WIDTH}
          y1={yScale(15) + RANKINGS_PADDING}
          y2={yScale(15) + RANKINGS_PADDING}
          style={{
            strokeDasharray: "5,3",
            stroke: MIDDLE_LINE_COLOR,
          }}
        />

        <path
          d={rankingLineGenerator(daySamples)!}
          fill="none"
          stroke={RANKING_LINE_COLOR}
          strokeWidth="1px"
        />

        {schedule.map((id: SeriesId) => (
          <line
            key={id}
            x1={seriesHalfwayPoint(scheduleData.series[id], xScale)}
            x2={seriesHalfwayPoint(scheduleData.series[id], xScale)}
            y1={yScale(opponentRankForSeries(id)) + RANKINGS_PADDING / 2}
            y2={yScale(opponentRankFinal(id)) + RANKINGS_PADDING / 2}
            stroke={RANKING_LINE_COLOR}
            strokeWidth={"1px"}
          />
        ))}

        {schedule.map((id: SeriesId) => (
          <rect
            key={id}
            // @ts-ignore
            fill={goodBadColorScale(opponentRankForSeries(id) / 30)}
            x={
              seriesHalfwayPoint(scheduleData.series[id], xScale) -
              RANKING_POINT_SIZE / 2
            }
            y={yScale(opponentRankForSeries(id)) + RANKINGS_PADDING / 2}
            width={RANKING_POINT_SIZE}
            height={RANKING_POINT_SIZE}
            stroke={"#666"}
          />
        ))}
      </g>
    </svg>
  );
}
