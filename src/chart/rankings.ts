import * as d3 from "d3";
import { CHART_WIDTH, RANKINGS_HEIGHT, RANKINGS_PADDING } from "./constants";
import { ScheduleData, SeriesId, TeamId } from "../interfaces";
import { dateToRecordsKey, opponentId, lastDayPlayed } from "../utils";

const renderRankings = (
  teamId: TeamId,
  scheduleData: ScheduleData,
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  const schedule = scheduleData.teams[teamId].schedule.filter(
    (id) => scheduleData.series[id]
  );

  let start = new Date();
  start.setTime(scheduleData.start.getTime());

  let end = lastDayPlayed(scheduleData.end);

  const daySamples = d3.timeDays(start, end);

  const svg = d3
    .create("svg")
    .attr("width", CHART_WIDTH)
    .attr("height", RANKINGS_HEIGHT);

  const chart = svg.append("g");

  // const rankScale = d3.scaleSequential(d3.schemeRdGy[10]);
  const rankScale = d3.scaleSequential(d3.interpolateRdGy);

  chart
    .append("g")
    .selectAll()
    .data(schedule)
    .join("line")
    .attr("x1", (id: SeriesId) => xScale(scheduleData.series[id].start) + 5)
    .attr("x2", (id: SeriesId) => xScale(scheduleData.series[id].start) + 5)
    .attr("y1", 0)
    .attr("y2", RANKINGS_HEIGHT)
    .style("stroke", "#e0e0e0");

  // Middle of the pack line
  //
  chart
    .append("line")
    .attr("x1", 0)
    .attr("x2", CHART_WIDTH)
    .attr("y1", yScale(15) + RANKINGS_PADDING)
    .attr("y2", yScale(15) + RANKINGS_PADDING)
    .style("stroke-dasharray", "5,3")
    .style("stroke", "gray");

  // Today highlight
  //
  chart
    .append("rect")
    .attr("x", xScale(end))
    .attr("width", 2)
    .attr("height", RANKINGS_HEIGHT)
    .attr("fill", "rgba(200, 200, 200, 0.5)");

  const rankingLineGenerator = d3
    .line<Date>()
    .x((day: Date) => xScale(day))
    .y(
      (day: Date) =>
        yScale(scheduleData.records[dateToRecordsKey(day)][teamId][2]) +
        RANKINGS_PADDING
    )
    .curve(d3.curveCatmullRom.alpha(0.3));

  chart
    .append("path")
    .attr("d", rankingLineGenerator(daySamples))
    .attr("fill", "none")
    .attr("stroke", "#707070")
    .attr("stroke-width", "1.5px");

  // rank
  chart
    .append("g")
    .selectAll()
    .data(schedule)
    .join("line")
    .attr("x1", (id: SeriesId) => xScale(scheduleData.series[id].start) + 5)
    .attr("x2", (id: SeriesId) => xScale(scheduleData.series[id].start) + 5)
    .attr("y1", (id: SeriesId) => {
      const opponent = opponentId(teamId, scheduleData.series[id]);
      const dateIndex = dateToRecordsKey(scheduleData.series[id].start);
      const records = scheduleData.records[dateIndex][opponent];

      return yScale(records[2]) + RANKINGS_PADDING / 2;
    })
    .attr("y2", (id: SeriesId) => {
      const opponent = opponentId(teamId, scheduleData.series[id]);
      const records =
        scheduleData.records[dateToRecordsKey(scheduleData.end)][opponent];

      return yScale(records[2]) + RANKINGS_PADDING / 2;
    })
    .style("stroke", "gray");

  // rank
  chart
    .append("g")
    .selectAll()
    .data(schedule)
    .join("rect")
    .attr("fill", (id: SeriesId) => {
      const opponent = opponentId(teamId, scheduleData.series[id]);

      const dateIndex = scheduleData.series[id].start
        .toISOString()
        .slice(0, 10);
      const records = scheduleData.records[dateIndex][opponent];

      return rankScale(records[2] / 30);
    })
    .attr("stroke", "gray")
    .attr("transform", (id: SeriesId) => {
      const x = xScale(scheduleData.series[id].start);

      const opponent = opponentId(teamId, scheduleData.series[id]);

      const dateIndex = scheduleData.series[id].start
        .toISOString()
        .slice(0, 10);

      const records = scheduleData.records[dateIndex][opponent];

      const y = yScale(records[2]);

      return `translate(${x + 2}, ${y + RANKINGS_PADDING / 2})`;
    })
    .attr("height", 6)
    .attr("width", 6);

  return svg;
};

export default renderRankings;
