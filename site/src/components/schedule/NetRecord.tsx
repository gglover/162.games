import * as d3 from "d3";
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  DIVISION_LEADER_COLOR,
  FIVE_HUNDRED_RECORD_Y,
  PLAYOFF_INDEX,
  SERIES_HIGHLIGHT_PATTERN_DEF,
  TEAMS,
  WC3_COLOR,
  WIN_INTERVAL_HEIGHT,
} from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import { dateToRecordsKey, earlierDate } from "../../utils";
import { SeriesHighlightDefs } from "../SeriesHighlightDefs";
import { SeriesResults } from "./SeriesResults";

const HOME_BLOCK_COLOR = "#f0f0f0";
const AWAY_BLOCK_COLOR = "#f7f7f7";
const FIVE_HUNDRED_STROKE_COLOR = "#a0a0a0";
const SUBDIVISION_STROKE_COLOR = "#e5e5e5";
const DIVISION_MARKS = [60, 50, 40, 30, 20, 10, -10, -20, -30, -40, -50, -60];

export interface NetRecordProps {
  teamId: TeamId;
  selectedSeriesId: SeriesId | null;
  onSelectedSeriesIdChange: (id: SeriesId) => void;
  xScale: d3.ScaleTime<number, number>;
}

export function NetRecord({
  teamId,
  xScale,
  selectedSeriesId,
}: NetRecordProps) {
  const scheduleData = useScheduleDataContext();

  const schedule = scheduleData.schedules[teamId].filter(
    (id) => scheduleData.series[id]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const playedSchedule = schedule.filter(
    (id) => scheduleData.series[id].start < today
  );

  const daySamples = playedSchedule.map((id) => scheduleData.series[id].end);
  // const daySamples = d3.timeDays(scheduleData.start, scheduleData.end);

  const playoffLineGenerator = d3
    .line<Date>()
    .x((day: Date) => xScale(day))
    .y((day: Date) => {
      // const dayBeforeSeries = new Date(day);
      // dayBeforeSeries.setDate(day.getDate() - 1);

      const dateKey = dateToRecordsKey(day);
      const lastInId =
        scheduleData.playoffs[dateKey][PLAYOFF_INDEX[TEAMS[teamId].league]];
      const lastInRecord = scheduleData.records[dateKey][lastInId];

      return (
        -(lastInRecord[0] - lastInRecord[1]) * WIN_INTERVAL_HEIGHT +
        FIVE_HUNDRED_RECORD_Y
      );
    })
    .curve(d3.curveNatural);

  const divisionLineGenerator = d3
    .line<Date>()
    .x((day: Date) => xScale(day))
    .y((day: Date) => {
      // const dayBeforeSeries = new Date(day);
      // dayBeforeSeries.setDate(day.getDate() - 1);

      const dateKey = dateToRecordsKey(day);
      const leader =
        scheduleData.playoffs[dateKey][PLAYOFF_INDEX[TEAMS[teamId].division]];
      const lastInRecord = scheduleData.records[dateKey][leader];

      return (
        -(lastInRecord[0] - lastInRecord[1]) * WIN_INTERVAL_HEIGHT +
        FIVE_HUNDRED_RECORD_Y
      );
    })
    .curve(d3.curveNatural);

  return (
    <svg
      width={CHART_WIDTH}
      height={CHART_HEIGHT}
      className="border-x-1 border-gray-300"
    >
      <SeriesHighlightDefs />

      <g>
        {schedule.map((id: SeriesId) => (
          <rect
            key={id}
            width={
              xScale(scheduleData.series[id].end) -
              xScale(scheduleData.series[id].start)
            }
            height={CHART_HEIGHT}
            fill={
              scheduleData.series[id].home === teamId
                ? HOME_BLOCK_COLOR
                : AWAY_BLOCK_COLOR
            }
            x={xScale(scheduleData.series[id].start)}
            y="0"
          />
        ))}
      </g>

      {DIVISION_MARKS.map((y) => (
        <line
          x1="0"
          x2={CHART_WIDTH}
          y1={WIN_INTERVAL_HEIGHT * y + FIVE_HUNDRED_RECORD_Y}
          y2={WIN_INTERVAL_HEIGHT * y + FIVE_HUNDRED_RECORD_Y}
          stroke={SUBDIVISION_STROKE_COLOR}
          key={y}
        />
      ))}

      <line
        x1={xScale(earlierDate(scheduleData.end, today))}
        x2={xScale(earlierDate(scheduleData.end, today))}
        y1={0}
        y2={CHART_HEIGHT}
        stroke="#a0a0a0"
      />

      <path
        d={playoffLineGenerator(daySamples)!}
        fill="none"
        stroke={WC3_COLOR}
        strokeWidth="1.5px"
      />

      <path
        d={divisionLineGenerator(daySamples)!}
        fill="none"
        stroke={DIVISION_LEADER_COLOR}
        strokeWidth="1.5px"
      />

      {selectedSeriesId && (
        <rect
          height={CHART_HEIGHT}
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
        y1={FIVE_HUNDRED_RECORD_Y}
        x2={CHART_WIDTH}
        y2={FIVE_HUNDRED_RECORD_Y}
        style={{
          strokeDasharray: "5,3",
          stroke: FIVE_HUNDRED_STROKE_COLOR,
        }}
      />

      <g transform={`translate(0, ${FIVE_HUNDRED_RECORD_Y})`}>
        <SeriesResults teamId={teamId} seriesIds={schedule} xScale={xScale} />
      </g>
    </svg>
  );
}
