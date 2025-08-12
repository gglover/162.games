import * as d3 from "d3";
import {
  CHART_WIDTH,
  CURRENT_SEASON,
  DIVISION_LEADER_COLOR,
  PLAYOFF_INDEX,
  TEAMS,
  TODAY,
  WC3_COLOR,
} from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { SeriesId, TeamId } from "../../interfaces";
import { dateToRecordsKey, earlierDate, opponentId } from "../../utils";
import {
  SeriesHashing,
  SeriesHighlightDefs,
  SeriesYellowHighlighter,
} from "../SeriesHighlightDefs";
import { SeriesResults } from "./SeriesResults";

const HOME_BLOCK_COLOR = "#f0f0f0";
const AWAY_BLOCK_COLOR = "#f7f7f7";
const FIVE_HUNDRED_STROKE_COLOR = "#a0a0a0";
const SUBDIVISION_STROKE_COLOR = "#e5e5e5";
const DIVISION_MARKS = [60, 50, 40, 30, 20, 10, -10, -20, -30, -40, -50, -60];

export interface NetRecordProps {
  teamId: TeamId;
  xScale: d3.ScaleTime<number, number>;
  yScale: d3.ScaleLinear<number, number>;
  height: number;
  selectedSeriesId: SeriesId | null;
  highlightedSeriesId: SeriesId | null;
}

export function NetRecord({
  teamId,
  xScale,
  yScale,
  height,
  selectedSeriesId,
  highlightedSeriesId,
}: NetRecordProps) {
  const scheduleData = useScheduleDataContext();

  const schedule = scheduleData.schedules[teamId].filter(
    (id) => scheduleData.series[id]
  );

  const playedSchedule = schedule.filter(
    (id) => scheduleData.series[id].start < TODAY
  );

  const daySamples = playedSchedule.map((id) => scheduleData.series[id].start);
  daySamples.push(earlierDate(TODAY, scheduleData.end));
  // const daySamples = d3.timeDays(scheduleData.start, scheduleData.end);

  const showTodayMarker =
    scheduleData.start.getFullYear() === parseInt(CURRENT_SEASON);

  const playoffLineGenerator = d3
    .line<Date>()
    .x((day: Date) => xScale(day))
    .y((day: Date) => {
      const dateKey = dateToRecordsKey(day);
      const lastInId =
        scheduleData.playoffs[dateKey][PLAYOFF_INDEX[TEAMS[teamId].league]];
      const lastInRecord = scheduleData.records[dateKey][lastInId];

      return yScale(lastInRecord[0] - lastInRecord[1]);
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

      return yScale(lastInRecord[0] - lastInRecord[1]);
    })
    .curve(d3.curveNatural);

  return (
    <svg
      width={CHART_WIDTH}
      height={height}
      className="border-x-1 border-gray-300 bg-white"
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
            height={height}
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
          y1={yScale(y)}
          y2={yScale(y)}
          stroke={SUBDIVISION_STROKE_COLOR}
          key={y}
        />
      ))}

      {showTodayMarker && (
        <line
          x1={xScale(TODAY)}
          x2={xScale(TODAY)}
          y1={0}
          y2={height}
          stroke="#a0a0a0"
        />
      )}

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

      {highlightedSeriesId && (
        <SeriesHashing
          series={scheduleData.series[highlightedSeriesId]}
          xScale={xScale}
          height={height}
        />
      )}

      {selectedSeriesId && (
        <>
          <SeriesHashing
            series={scheduleData.series[selectedSeriesId]}
            xScale={xScale}
            height={height}
          />
          <SeriesYellowHighlighter
            series={scheduleData.series[selectedSeriesId]}
            xScale={xScale}
            height={height}
          />
        </>
      )}

      <line
        x1="0"
        y1={yScale(0)}
        x2={CHART_WIDTH}
        y2={yScale(0)}
        style={{
          strokeDasharray: "5,3",
          stroke: FIVE_HUNDRED_STROKE_COLOR,
        }}
      />
      {selectedSeriesId && (
        <SeriesResults
          teamId={opponentId(teamId, scheduleData.series[selectedSeriesId])}
          xScale={xScale}
          yScale={yScale}
          minimal
        />
      )}
      <SeriesResults teamId={teamId} xScale={xScale} yScale={yScale} />
    </svg>
  );
}
