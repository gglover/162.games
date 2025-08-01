import * as d3 from "d3";
import {
  CHART_WIDTH,
  CURRENT_SEASON,
  RANKINGS_HEIGHT,
  RANKINGS_PADDING,
  TODAY,
} from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import {
  dateToRecordsKey,
  goodBadColorScale,
  lastDayPlayed,
  opponentId,
  seriesHalfwayPoint,
} from "../../utils";
import { RankingPoint } from "./RankingPoint";
import { SeriesHashing, SeriesYellowHighlighter } from "../SeriesHighlightDefs";

const SERIES_LINE_COLOR = "#e0e0e0";
const MIDDLE_LINE_COLOR = "#a0a0a0";
const RANKING_LINE_COLOR = "#909090";

export interface RankingsProps {
  teamId: TeamId;
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  selectedSeriesId: SeriesId | null;
  highlightedSeriesId: SeriesId | null;
}

export function Rankings({
  teamId,
  xScale,
  yScale,
  selectedSeriesId,
  highlightedSeriesId,
}: RankingsProps) {
  const scheduleData = useScheduleDataContext();

  const schedule = scheduleData.schedules[teamId].filter(
    (id) => scheduleData.series[id]
  );

  let start = new Date();
  start.setTime(scheduleData.start.getTime());

  let end = lastDayPlayed(scheduleData.end);

  const daySamples = d3.timeDays(start, end);

  const showTodayMarker =
    scheduleData.start.getFullYear() === parseInt(CURRENT_SEASON);

  const rankingLineGenerator = d3
    .line<Date>()
    .x((day: Date) => xScale(day))
    .y(
      (day: Date) =>
        yScale(scheduleData.records[dateToRecordsKey(day)][teamId][2]) +
        RANKINGS_PADDING / 2
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
      className="border-x-1 border-gray-300 bg-white"
    >
      <g>
        {showTodayMarker && (
          <line
            x1={xScale(TODAY)}
            x2={xScale(TODAY)}
            y1={0}
            y2={RANKINGS_HEIGHT}
            stroke="#a0a0a0"
          />
        )}

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

        {highlightedSeriesId && (
          <SeriesHashing
            series={scheduleData.series[highlightedSeriesId]}
            xScale={xScale}
            height={RANKINGS_HEIGHT}
          />
        )}

        {selectedSeriesId && (
          <>
            <SeriesHashing
              series={scheduleData.series[selectedSeriesId]}
              xScale={xScale}
              height={RANKINGS_HEIGHT}
            />
            <SeriesYellowHighlighter
              series={scheduleData.series[selectedSeriesId]}
              xScale={xScale}
              height={RANKINGS_HEIGHT}
            />
          </>
        )}

        <line
          x1="0"
          x2={CHART_WIDTH}
          y1={yScale(15) + RANKINGS_PADDING / 2}
          y2={yScale(15) + RANKINGS_PADDING / 2}
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
          <RankingPoint
            key={id}
            x={seriesHalfwayPoint(scheduleData.series[id], xScale)}
            yStart={yScale(opponentRankForSeries(id)) + RANKINGS_PADDING / 4}
            yEnd={yScale(opponentRankFinal(id)) + RANKINGS_PADDING / 4}
            color={goodBadColorScale(opponentRankForSeries(id) / 30)}
            seriesId={id}
          />
        ))}
      </g>
    </svg>
  );
}
