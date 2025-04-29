import * as d3 from "d3";
import { ScheduleData, SeriesId, TeamId } from "../interfaces";
import { opponentId, teamLogoFromId } from "../utils";
import { CHART_WIDTH, LOGOS_HEIGHT } from "./constants";

const renderOpponentLogos = (
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
    .attr("height", LOGOS_HEIGHT);

  const opponentLogos = svg.append("g");

  opponentLogos
    .append("g")
    .selectAll()
    .data(schedule)
    .join("image")
    .attr("x", (id: SeriesId) => xScale(scheduleData.series[id].start))
    .attr("xlink:href", (id: SeriesId) =>
      teamLogoFromId(opponentId(teamId, scheduleData.series[id]))
    )
    .attr("height", 12)
    .attr("width", 12)
    .attr("y", 6);

  return svg;
};

export default renderOpponentLogos;
