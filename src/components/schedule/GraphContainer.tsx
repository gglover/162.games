import * as d3 from "d3";
import {
  CHART_HEIGHT,
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
import { useEffect, useRef } from "react";
import { ordinalSuffixFormat, teamLogoFromId } from "../../utils";
import { SeasonSelect } from "../SeasonSelect";

export interface GraphContainerProps {
  teamId: TeamId;
  selectedSeriesId: SeriesId;
  onSelectedSeriesIdChange: (id: SeriesId) => void;
}

export function GraphContainer({
  teamId,
  selectedSeriesId,
  onSelectedSeriesIdChange,
}: GraphContainerProps) {
  const rankingsYAxisRef = useRef(null);
  const netRecordYAxisRef = useRef(null);

  const scheduleData = useScheduleDataContext();

  const xScale = d3
    .scaleTime()
    .domain([scheduleData.start, scheduleData.end])
    .range([0, CHART_WIDTH]);

  const scheduleYScale = d3
    .scaleLinear()
    .domain([
      CHART_HEIGHT / WIN_INTERVAL_HEIGHT / 2,
      CHART_HEIGHT / WIN_INTERVAL_HEIGHT / -2,
    ])
    .range([0, CHART_HEIGHT]);

  const rankingsYScale = d3
    .scaleLinear()
    .domain([1, 30])
    .range([0, RANKINGS_HEIGHT - RANKINGS_PADDING]);

  useEffect(() => {
    const rankingsElement = d3.select(rankingsYAxisRef.current);
    const rankingsAxisGenerator = d3
      .axisLeft(rankingsYScale)
      .tickValues([1, 10, 20, 30])
      .tickFormat(ordinalSuffixFormat);
    rankingsElement.append("g").call(rankingsAxisGenerator);

    const plusMinusFormat = (d: number) => (d > 0 ? `+${d}` : `${d}`);

    const netRecordsElement = d3.select(netRecordYAxisRef.current);
    const netRecordsAxisGenerator = d3
      .axisLeft(scheduleYScale)
      .tickFormat(plusMinusFormat);
    netRecordsElement.append("g").call(netRecordsAxisGenerator);
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `${Y_AXIS_WIDTH}px ${CHART_WIDTH}px`,
      }}
    >
      <div></div>
      <div className="flex">
        <TitleBadge>MLB Ranking</TitleBadge>
      </div>

      <svg width={Y_AXIS_WIDTH} height={RANKINGS_HEIGHT}>
        <g
          className="axis no-domain"
          transform="translate(30, 5)"
          ref={rankingsYAxisRef}
        ></g>
      </svg>
      <div className="rankings border-y-1 border-gray-500">
        <Rankings teamId={teamId} xScale={xScale} yScale={rankingsYScale} />
      </div>

      <div></div>
      <OpponentLogos teamId={teamId} xScale={xScale} />

      <svg width={Y_AXIS_WIDTH} height={CHART_HEIGHT}>
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
          xScale={xScale}
          selectedSeriesId={selectedSeriesId}
          onSelectedSeriesIdChange={onSelectedSeriesIdChange}
        />
      </div>

      <div className="relative">
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
