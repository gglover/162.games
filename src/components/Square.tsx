import * as d3 from "d3";
import { SQUARE_PADDING, SQUARE_SIZE } from "../constants";
import { Axis, AxisOrientation } from "./Axis";
import { TeamId } from "../interfaces";
import { dateToRecordsKey } from "../utils";
import { useScheduleDataContext } from "../contexts";
import { TeamLogo } from "./TeamLogo";

const BACKGROUND_GRAY = "#f0f0f0";
const AXIS_GRAY = "#d0d0d0";

export interface SquareProps {
  date: Date;
}

export function Square({ date }: SquareProps) {
  const scheduleData = useScheduleDataContext();

  const rankXScale = d3.scaleLinear().domain([30, 1]).range([0, SQUARE_SIZE]);
  const heatYScale = d3.scaleLinear().domain([1.0, 0]).range([0, SQUARE_SIZE]);
  const records = scheduleData.records[dateToRecordsKey(date)];

  return (
    <svg
      className="flex justify-center"
      width={SQUARE_SIZE + SQUARE_PADDING * 2}
      height={SQUARE_SIZE + SQUARE_PADDING * 2}
    >
      <rect
        x={SQUARE_PADDING}
        y={SQUARE_PADDING}
        width={SQUARE_SIZE / 2}
        height={SQUARE_SIZE / 2}
        fill={BACKGROUND_GRAY}
      />

      <rect
        x={SQUARE_PADDING + SQUARE_SIZE / 2}
        y={SQUARE_PADDING + SQUARE_SIZE / 2}
        width={SQUARE_SIZE / 2}
        height={SQUARE_SIZE / 2}
        fill={BACKGROUND_GRAY}
      />

      <line
        x1="0"
        y1={SQUARE_SIZE + SQUARE_PADDING * 2}
        x2={SQUARE_SIZE + SQUARE_PADDING * 2}
        y2="0"
        stroke={AXIS_GRAY}
      />

      <line
        x1={SQUARE_SIZE + SQUARE_PADDING}
        y1={SQUARE_PADDING - 10}
        x2={SQUARE_SIZE + SQUARE_PADDING}
        y2={SQUARE_PADDING + SQUARE_SIZE}
        stroke={AXIS_GRAY}
      />

      <line
        x1={SQUARE_PADDING}
        y1={SQUARE_PADDING}
        x2={SQUARE_SIZE + SQUARE_PADDING + 10}
        y2={SQUARE_PADDING}
        stroke={AXIS_GRAY}
      />

      {Object.keys(records).map((id: TeamId) => (
        <TeamLogo
          key={id}
          id={id}
          size={25}
          x={rankXScale(records[id][2])}
          y={heatYScale(records[id][3])}
        />
      ))}

      <Axis
        scale={rankXScale}
        x={SQUARE_PADDING}
        y={SQUARE_SIZE + SQUARE_PADDING}
        orientation={AxisOrientation.Horizontal}
      />
    </svg>
  );
}

// const renderSquare = (data: HistoricalRecord) => {
//   const rankXScale = d3.scaleLinear().domain([30, 1]).range([0, SQUARE_SIZE]);
//   const heatYScale = d3.scaleLinear().domain([1.0, 0]).range([0, SQUARE_SIZE]);

//   const xAxis = d3.axisBottom(rankXScale);
//   const yAxis = d3.axisLeft(heatYScale);

//   svg
//     .append("g")
//     .attr("class", "x-axis")
//     .attr(
//       "transform",
//       `translate(${SQUARE_PADDING}, ${SQUARE_SIZE + SQUARE_PADDING})`
//     )
//     .call(xAxis);

//   svg
//     .append("g")
//     .attr("class", "y-axis")
//     .attr("transform", `translate(${SQUARE_PADDING}, ${SQUARE_PADDING})`)
//     .call(yAxis);
