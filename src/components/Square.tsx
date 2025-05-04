import { SQUARE_PADDING, SQUARE_SIZE } from "../chart/constants";

const BACKGROUND_GRAY = "#f0f0f0";
const AXIS_GRAY = "#d0d0d0";

export interface SquareProps {}

export function Square() {
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
    </svg>
  );

  //   svg
  //     .append("g")
  //     .selectAll()
  //     .data(Object.keys(data))
  //     .join("image")
  //     .attr("x", (id: TeamId) => rankXScale(data[id][2]) + 12)
  //     .attr("y", (id: TeamId) => heatYScale(data[id][3]) + 12)
  //     .attr("xlink:href", (id: TeamId) => teamLogoFromId(id))
  //     .attr("height", 25)
  //     .attr("width", 25);
}

// import * as d3 from "d3";
// import { HistoricalRecord, TeamId } from "../interfaces";
// import { SQUARE_PADDING, SQUARE_SIZE } from "./constants";
// import { teamLogoFromId } from "../utils";

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
