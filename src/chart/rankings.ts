import * as d3 from "d3";
import {
  CHART_WIDTH,
  RANKINGS_HEIGHT,
  RANKINGS_PADDING,
  SEASON_START,
} from "./constants";
import { ScheduleData, SeriesId, TeamId } from "../interfaces";
import { dateToRecordsKey, opponentId } from "../utils";

const renderRankings = (
  teamId: TeamId,
  scheduleData: ScheduleData,
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>
) => {
  const schedule = scheduleData.teams[teamId].schedule.filter(
    (id) => scheduleData.series[id]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daySamples = schedule
    .map((id) => scheduleData.series[id].start)
    .filter((day) => day < today);

  // const playedSchedule = schedule.filter(
  //   (id) => scheduleData.series[id].start < today
  // );

  const svg = d3
    .create("svg")
    .attr("width", CHART_WIDTH)
    .attr("height", RANKINGS_HEIGHT);

  const chart = svg.append("g");

  // const rankScale = d3.scaleSequential(d3.schemeRdGy[10]);
  const rankScale = d3.scaleSequential(d3.interpolateRdGy);

  // Middle of the pack line
  //
  chart
    .append("line")
    .attr("x1", 0)
    .attr("x2", CHART_WIDTH)
    .attr("y1", yScale(15))
    .attr("y2", yScale(15))
    .style("stroke-dasharray", "5,3")
    .style("stroke", "gray");

  // Today highlight
  //
  chart
    .append("rect")
    .attr("x", xScale(today))
    .attr("width", 2)
    .attr("height", RANKINGS_HEIGHT)
    .attr("fill", "rgba(200, 200, 200, 0.5)");

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

      return `translate(${x}, ${y + RANKINGS_PADDING / 2})`;
    })
    .attr("height", 5)
    .attr(
      "width",
      (id: SeriesId) =>
        xScale(scheduleData.series[id].end) -
        xScale(scheduleData.series[id].start)
    );

  const rankingLineGenerator = d3
    .line<Date>()
    .x((day: Date) => xScale(day))
    .y((day: Date) =>
      yScale(scheduleData.records[dateToRecordsKey(day)][teamId][2])
    )
    .curve(d3.curveCatmullRom.alpha(0.3));

  daySamples.shift();
  daySamples.shift();
  daySamples.shift();
  daySamples.shift();
  daySamples.shift();
  daySamples.shift();

  chart
    .append("path")
    .attr("d", rankingLineGenerator([SEASON_START, ...daySamples]))
    .attr("fill", "none")
    .attr("stroke", "rgba(0, 0, 0, 0.5)")
    .attr("stroke-width", "1.5px");

  return svg;
};

export default renderRankings;
