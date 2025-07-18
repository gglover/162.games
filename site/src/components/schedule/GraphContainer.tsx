import * as d3 from "d3";
import {
  CHART_WIDTH,
  RANKINGS_HEIGHT,
  RANKINGS_PADDING,
  WIN_INTERVAL_HEIGHT,
  Y_AXIS_WIDTH,
} from "../../constants";
import { useScheduleDataContext } from "../../contexts";
import { TitleBadge } from "../TitleBadge";
import { Rankings } from "./Rankings";
import { SeriesId, TeamId } from "../../interfaces";
import { OpponentLogos } from "./OpponentLogos";
import { NetRecord } from "./NetRecord";
import { ScheduleFooter } from "./ScheduleFooter";
import { MouseEventHandler, useEffect, useRef } from "react";
import { ordinalSuffixFormat, teamLogoFromId } from "../../utils";
import { ScheduleKey } from "./ScheduleKey";
import { RankingsKey } from "./RankingsKey";

// Games over / under .500
const DEFAULT_NET_RECORD_BOUNDS = 32;

export interface GraphContainerProps {
  teamId: TeamId;
  selectedSeriesId: SeriesId | null;
  onSelectedSeriesIdChange: (id: SeriesId | null) => void;
}

export function GraphContainer({
  teamId,
  selectedSeriesId,
  onSelectedSeriesIdChange,
}: GraphContainerProps) {
  const rankingsYAxisRef = useRef(null);
  const netRecordYAxisRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scheduleData = useScheduleDataContext();

  const xScale = d3
    .scaleTime()
    .domain([scheduleData.start, scheduleData.end])
    .range([0, CHART_WIDTH]);

  let recordBounds = [DEFAULT_NET_RECORD_BOUNDS, -DEFAULT_NET_RECORD_BOUNDS];
  for (let day in scheduleData.records) {
    const diff =
      scheduleData.records[day][teamId][0] -
      scheduleData.records[day][teamId][1];
    recordBounds[0] = Math.max(diff + 2, recordBounds[0]);
    recordBounds[1] = Math.min(diff - 2, recordBounds[1]);
  }

  const chartHeight = WIN_INTERVAL_HEIGHT * (recordBounds[0] - recordBounds[1]);

  const scheduleYScale = d3
    .scaleLinear()
    .domain(recordBounds)
    .range([0, chartHeight]);

  const rankingsYScale = d3
    .scaleLinear()
    .domain([1, 30])
    .range([0, RANKINGS_HEIGHT - RANKINGS_PADDING]);

  useEffect(() => {
    const rankingsElement = d3.select(rankingsYAxisRef.current);
    const rankingsAxisGenerator = d3
      .axisLeft(rankingsYScale)
      .tickValues([1, 10, 20, 30])
      // @ts-ignore
      .tickFormat(ordinalSuffixFormat);
    // @ts-ignore
    rankingsElement.append("g").call(rankingsAxisGenerator);

    const plusMinusFormat = (d: number) => (d > 0 ? `+${d}` : `${d}`);

    const netRecordsElement = d3.select(netRecordYAxisRef.current);
    const netRecordsAxisGenerator = d3
      .axisLeft(scheduleYScale)
      // @ts-ignore
      .tickFormat(plusMinusFormat);
    // @ts-ignore
    netRecordsElement.append("g").call(netRecordsAxisGenerator);
  }, []);

  const handleScrubPositionChange: MouseEventHandler = (event) => {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const position = event.clientX - rect.left - Y_AXIS_WIDTH;

    const date = xScale.invert(position);

    const series = scheduleData.schedules[teamId].find(
      (seriesId) =>
        scheduleData.series[seriesId].start < date &&
        scheduleData.series[seriesId].end > date
    );

    series && onSelectedSeriesIdChange(series);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${Y_AXIS_WIDTH}px ${CHART_WIDTH}px 100px`,
      }}
      onMouseMove={handleScrubPositionChange}
      onMouseLeave={() => onSelectedSeriesIdChange(null)}
      ref={containerRef}
      className="overflow-x-scroll"
    >
      <div></div>
      <div className="flex">
        <TitleBadge>MLB Ranking</TitleBadge>
      </div>
      <div></div>

      <svg width={Y_AXIS_WIDTH} height={RANKINGS_HEIGHT}>
        <g
          className="axis no-domain"
          transform="translate(30, 5)"
          ref={rankingsYAxisRef}
        ></g>
      </svg>
      <div className="rankings border-y-1 border-gray-500">
        <Rankings
          teamId={teamId}
          xScale={xScale}
          yScale={rankingsYScale}
          selectedSeriesId={selectedSeriesId}
        />
      </div>
      <div>
        <RankingsKey />
      </div>

      <div></div>
      <OpponentLogos teamId={teamId} xScale={xScale} />
      <div></div>

      <svg width={Y_AXIS_WIDTH} height={chartHeight}>
        <g
          className="axis no-domain"
          transform="translate(30, 0)"
          ref={netRecordYAxisRef}
        ></g>
      </svg>
      <div className="border border-x-0 border-gray-500 relative">
        <div className="absolute top-0 left-0">
          <TitleBadge>Net Record</TitleBadge>
        </div>
        <NetRecord
          teamId={teamId}
          height={chartHeight}
          xScale={xScale}
          yScale={scheduleYScale}
          selectedSeriesId={selectedSeriesId}
          onSelectedSeriesIdChange={onSelectedSeriesIdChange}
        />
      </div>
      <ScheduleKey />

      <div className="relative mt-[-5px]">
        <img className="w-3 h-3 m-1" src={teamLogoFromId(teamId)} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute right-0 top-1"
        >
          <path d="m6 17 5-5-5-5" />
          <path d="m13 17 5-5-5-5" />
        </svg>
      </div>
      <ScheduleFooter teamId={teamId} xScale={xScale} />
    </div>
  );
}
