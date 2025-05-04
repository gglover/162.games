import * as d3 from "d3";
import { HistoricalRecord, TeamId } from "../interfaces";
import { SQUARE_PADDING, SQUARE_SIZE } from "./constants";
import { teamLogoFromId } from "../utils";

const renderSquare = (data: HistoricalRecord) => {
  const rankXScale = d3.scaleLinear().domain([30, 1]).range([0, SQUARE_SIZE]);
  const heatYScale = d3.scaleLinear().domain([1.0, 0]).range([0, SQUARE_SIZE]);

  const squareElement = document.querySelector(".square")!;

  const svg = d3
    .create("svg")
    .attr("width", SQUARE_SIZE + SQUARE_PADDING * 2)
    .attr("height", SQUARE_SIZE + SQUARE_PADDING * 2);

  const xAxis = d3.axisBottom(rankXScale);
  const yAxis = d3.axisLeft(heatYScale);

  // svg
  //   .append("rect")
  //   .attr("x", SQUARE_PADDING + SQUARE_SIZE / 2)
  //   .attr("y", SQUARE_PADDING + SQUARE_SIZE / 2)
  //   .attr("width", 150)
  //   .attr("height", 150)
  //   .style("transform-origin", "center")
  //   .style("transform-box", "fill-box")
  //   .style("transform", "translate(-50%, -50%) rotate(45deg)")
  //   .style("fill", "#f3f3f3");

  svg
    .append("rect")
    .attr("x", SQUARE_PADDING)
    .attr("y", SQUARE_PADDING)
    .attr("width", SQUARE_SIZE / 2)
    .attr("height", SQUARE_SIZE / 2)
    .style("fill", "#f0f0f0");

  svg
    .append("rect")
    .attr("x", SQUARE_PADDING + SQUARE_SIZE / 2)
    .attr("y", SQUARE_PADDING + SQUARE_SIZE / 2)
    .attr("width", SQUARE_SIZE / 2)
    .attr("height", SQUARE_SIZE / 2)
    .style("fill", "#f5f5f5");

  svg
    .append("line")
    .attr("x1", 0)
    .attr("x2", SQUARE_SIZE + SQUARE_PADDING * 2)
    .attr("y1", SQUARE_SIZE + SQUARE_PADDING * 2)
    .attr("y2", 0)
    .style("stroke", "#d0d0d0");

  svg
    .append("line")
    .attr("x1", SQUARE_SIZE + SQUARE_PADDING)
    .attr("x2", SQUARE_SIZE + SQUARE_PADDING)
    .attr("y1", SQUARE_PADDING - 10)
    .attr("y2", SQUARE_PADDING + SQUARE_SIZE)
    .style("stroke", "#d0d0d0");

  svg
    .append("line")
    .attr("x1", SQUARE_PADDING)
    .attr("x2", SQUARE_SIZE + SQUARE_PADDING + 10)
    .attr("y1", SQUARE_PADDING)
    .attr("y2", SQUARE_PADDING)
    .style("stroke", "#d0d0d0");

  svg
    .append("g")
    .attr("class", "x-axis")
    .attr(
      "transform",
      `translate(${SQUARE_PADDING}, ${SQUARE_SIZE + SQUARE_PADDING})`
    )
    .call(xAxis);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${SQUARE_PADDING}, ${SQUARE_PADDING})`)
    .call(yAxis);

  svg
    .append("g")
    .selectAll()
    .data(Object.keys(data))
    .join("image")
    .attr("x", (id: TeamId) => rankXScale(data[id][2]) + 12)
    .attr("y", (id: TeamId) => heatYScale(data[id][3]) + 12)
    .attr("xlink:href", (id: TeamId) => teamLogoFromId(id))
    .attr("height", 25)
    .attr("width", 25);

  squareElement.append(svg.node()!);
};

export default renderSquare;
