import * as d3 from "d3";
import { RANKINGS_HEIGHT, RANKINGS_PADDING, Y_AXIS_WIDTH } from "./constants";

const renderRankingsYAxis = (yScale: d3.ScaleLinear<number, number>) => {
  const svg = d3
    .create("svg")
    .attr("width", Y_AXIS_WIDTH)
    .attr("height", RANKINGS_HEIGHT);

  const ordinalSuffix = (n: number) => {
    const s = ["th", "st", "nd", "rd"],
      v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const yAxis = d3
    .axisRight(yScale)
    .tickValues([1, 10, 20, 30])
    .tickFormat(ordinalSuffix);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(-5, ${RANKINGS_PADDING / 2})`)
    .call(yAxis)
    .selectAll("path,line")
    .remove();

  return svg;
};

export default renderRankingsYAxis;
