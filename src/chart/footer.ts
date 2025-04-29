import * as d3 from "d3";
import { ScheduleData, SeriesId, TeamId } from "../interfaces";
import { CHART_WIDTH, FOOTER_HEIGHT } from "./constants";

const renderFooter = (
  teamId: TeamId,
  scheduleData: ScheduleData,
  xScale: d3.ScaleTime<number, number>
) => {
  const schedule = scheduleData.teams[teamId].schedule.filter(
    (id) => scheduleData.series[id]
  );

  const svg = d3
    .create("svg")
    .attr("width", CHART_WIDTH)
    .attr("height", FOOTER_HEIGHT);

  const footer = svg.append("g");

  // @ts-ignore
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));

  footer
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, 25)`)
    .call(xAxis);
  // .selectAll(".domain")
  // .remove();

  // Hot or not
  footer
    .append("g")
    .selectAll()
    .data(schedule)
    .join("text")
    .attr("x", (id: SeriesId) => xScale(scheduleData.series[id].start))
    .text((id: SeriesId) => {
      const dateIndex = scheduleData.series[id].start
        .toISOString()
        .slice(0, 10);
      const records = scheduleData.records[dateIndex][teamId];

      if (records[4] - records[5] >= 2) {
        return "🔥";
      } else if (records[4] - records[5] <= -2) {
        return "❄️";
      }

      return "";
    })
    .attr("font-size", (id: SeriesId) => {
      const dateIndex = scheduleData.series[id].start
        .toISOString()
        .slice(0, 10);
      const records = scheduleData.records[dateIndex][teamId];

      if (records[2] === 10 || records[2] === 0) {
        return "20px";
      } else if (records[2] === 9 || records[2] === 1) {
        return "16px";
      } else if (records[2] === 8 || records[2] === 2) {
        return "12px";
      }

      return "7px";
    })
    .attr("height", 12)
    .attr("width", 12)
    .attr("y", 15);

  return svg;
};

export default renderFooter;
