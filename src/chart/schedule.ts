import * as d3 from "d3";

import {
  ScheduleData,
  SeriesId,
  SeriesLocation,
  TeamId,
  TravelScheduleBlock,
} from "../interfaces";
import {
  dateToRecordsKey,
  heatIndexIcon,
  heatIndexSize,
  opponentId,
  seriesOutcome,
  seriesOutcomeColor,
} from "../utils";
import {
  CHART_HEIGHT,
  CHART_WIDTH,
  FIVE_HUNDRED_RECORD_Y,
  WIN_INTERVAL_HEIGHT,
} from "./constants";

const renderSchedule = (
  teamId: TeamId,
  scheduleData: ScheduleData,
  xScale: d3.ScaleTime<number, number>
) => {
  const schedule = scheduleData.teams[teamId].schedule.filter(
    (id) => scheduleData.series[id]
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const playedSchedule = schedule.filter(
    (id) => scheduleData.series[id].start < today
  );

  const travelSchedule: TravelScheduleBlock[] = [];
  let currentLeg: TravelScheduleBlock | null = null;

  for (let seriesId of schedule) {
    const series = scheduleData.series[seriesId];
    const location =
      series.home === teamId ? SeriesLocation.Home : SeriesLocation.Away;

    if (currentLeg && currentLeg.location === location) {
      currentLeg.series.push(seriesId);

      const outcome = seriesOutcome(teamId, scheduleData.series[seriesId]);
      currentLeg.outcome[0] += outcome[0];
      currentLeg.outcome[1] += outcome[1];

      currentLeg.end = series.end;
    } else {
      currentLeg && travelSchedule.push(currentLeg);
      currentLeg = {
        location,
        series: [seriesId],
        start: series.start,
        end: series.end,
        outcome: seriesOutcome(teamId, scheduleData.series[seriesId]),
      };
    }
  }

  currentLeg && travelSchedule.push(currentLeg);

  const svg = d3
    .create("svg")
    .attr("width", CHART_WIDTH)
    .attr("height", CHART_HEIGHT);

  const chart = svg.append("g");

  // Travel blocks
  //
  chart
    .append("g")
    .selectAll()
    .data(travelSchedule)
    .join("rect")
    .attr(
      "width",
      (block: TravelScheduleBlock) => xScale(block.end) - xScale(block.start)
    )
    .style("fill", (block: TravelScheduleBlock) =>
      block.location === SeriesLocation.Home ? "#f0f0f0" : "#f7f7f7"
    )
    .attr("x", (block: TravelScheduleBlock) => xScale(block.start))
    .attr("height", CHART_HEIGHT)
    .attr("y", 0);

  // Home icons
  //
  // chart
  //   .append("g")
  //   .selectAll()
  //   .data(
  //     travelSchedule.filter(
  //       (block: TravelScheduleBlock) => block.location === SeriesLocation.Home
  //     )
  //   )
  //   .join("image")
  //   .attr("xlink:href", SVGS.HOUSE)
  //   .attr("opacity", 0.5)
  //   .attr("x", (block: TravelScheduleBlock) => {
  //     const start = xScale(block.end);
  //     const end = xScale(block.start);

  //     return start + (end - start) / 2 - 8;
  //   })
  //   .attr("y", CHART_HEIGHT - 20)
  //   .attr("height", 16)
  //   .attr("width", 16);

  // 500 record line
  //
  chart
    .append("line")
    .attr("x1", 0)
    .attr("x2", CHART_WIDTH)
    .attr("y1", FIVE_HUNDRED_RECORD_Y)
    .attr("y2", FIVE_HUNDRED_RECORD_Y)
    .style("stroke-dasharray", "5,3")
    .style("stroke", "gray");

  // Today highlight
  //
  chart
    .append("rect")
    .attr("x", xScale(today))
    .attr("width", 2)
    .attr("height", CHART_HEIGHT)
    .attr("fill", "rgba(200, 200, 200, 0.5)");

  let rollingY = FIVE_HUNDRED_RECORD_Y;

  // Series sequence
  //
  chart
    .append("g")
    .selectAll()
    .data(playedSchedule)
    .join("rect")
    .attr("height", (id: SeriesId) => {
      const outcome = seriesOutcome(teamId, scheduleData.series[id]);
      const recordChange = outcome[1] - outcome[0];

      return WIN_INTERVAL_HEIGHT * Math.abs(recordChange) || 1;
    })
    .attr(
      "width",
      (id: SeriesId) =>
        xScale(scheduleData.series[id].end) -
        xScale(scheduleData.series[id].start)
    )
    .style("fill", (id: SeriesId) =>
      seriesOutcomeColor(teamId, scheduleData.series[id])
    )
    .attr("x", (id: SeriesId) => xScale(scheduleData.series[id].start))
    .attr("y", (id: SeriesId) => {
      const outcome = seriesOutcome(teamId, scheduleData.series[id]);
      const recordChange = outcome[1] - outcome[0];

      const current = rollingY;
      rollingY += recordChange * WIN_INTERVAL_HEIGHT;

      return (
        current + (recordChange < 0 ? recordChange * WIN_INTERVAL_HEIGHT : 0)
      );
    });

  rollingY = FIVE_HUNDRED_RECORD_Y;

  // Hot or not
  //
  chart
    .append("g")
    .selectAll()
    .data(playedSchedule)
    .join("text")
    .attr("x", (id: SeriesId) => xScale(scheduleData.series[id].start))
    .text((id: SeriesId) => {
      const opponent = opponentId(teamId, scheduleData.series[id]);
      const dateKey = dateToRecordsKey(scheduleData.series[id].start);
      const records = scheduleData.records[dateKey][opponent];

      return heatIndexIcon(records[3]);
    })
    .attr("font-size", (id: SeriesId) => {
      const opponent = opponentId(teamId, scheduleData.series[id]);
      const dateKey = dateToRecordsKey(scheduleData.series[id].start);
      const records = scheduleData.records[dateKey][opponent];

      return heatIndexSize(records[3]);
    })
    .attr("height", 12)
    .attr("width", 12)
    .attr("y", (id: SeriesId) => {
      const outcome = seriesOutcome(teamId, scheduleData.series[id]);
      const recordChange = outcome[1] - outcome[0];

      const current = rollingY;
      rollingY += recordChange * WIN_INTERVAL_HEIGHT;

      return (
        current +
        (recordChange < 0 ? recordChange * WIN_INTERVAL_HEIGHT : 0) -
        6
      );
    });

  return svg;
};

export default renderSchedule;
