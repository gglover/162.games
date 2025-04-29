import * as d3 from "d3";
import { CHART_HEIGHT, Y_AXIS_WIDTH } from "./constants";

const renderScheduleYAxis = (yScale: d3.ScaleLinear<number, number>) => {
  const svg = d3
    .create("svg")
    .attr("width", Y_AXIS_WIDTH)
    .attr("height", CHART_HEIGHT);

  const formatTick = (d: number) => (d > 0 ? `+${d}` : `${d}`);

  const yAxis = d3.axisLeft(yScale).tickFormat(formatTick);

  svg
    .append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(30, 0)`)
    .call(yAxis)
    .selectAll("path,line")
    .remove();

  return svg;
};

export default renderScheduleYAxis;
