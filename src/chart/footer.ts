import * as d3 from "d3";
import { ScheduleData, SeriesId, TeamId } from "../interfaces";
import { CHART_WIDTH, FOOTER_HEIGHT } from "./constants";
import { dateToRecordsKey, heatIndexIcon, heatIndexSize } from "../utils";

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

  // Hot or not
  footer
    .append("g")
    .selectAll()
    .data(schedule)
    .join("text")
    .attr("x", (id: SeriesId) => xScale(scheduleData.series[id].start))
    .text((id: SeriesId) => {
      const dateIndex = dateToRecordsKey(scheduleData.series[id].start);
      const records = scheduleData.records[dateIndex][teamId];
      return heatIndexIcon(records[3]);
    })
    .attr("font-size", (id: SeriesId) => {
      const dateIndex = dateToRecordsKey(scheduleData.series[id].start);
      const records = scheduleData.records[dateIndex][teamId];
      return heatIndexSize(records[3]);
    })
    .attr("y", 15);

  return svg;
};

export default renderFooter;
