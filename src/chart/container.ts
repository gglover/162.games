import * as d3 from "d3";
import {
  ScheduleData,
  SeriesId,
  SeriesLocation,
  TeamId,
  TravelScheduleBlock,
} from "../interfaces";
import {
  opponentId,
  seriesOutcome,
  seriesOutcomeColor,
  teamLogoFromId,
} from "../utils";
import {
  CHART_WIDTH,
  CHART_PADDING,
  CHART_HEIGHT,
  SEASON_START,
  SEASON_END,
  WIN_INTERVAL_HEIGHT,
  FIVE_HUNDRED_RECORD_Y,
  Y_AXIS_WIDTH,
  RANKINGS_HEIGHT,
  RANKINGS_PADDING,
} from "./constants";

import renderSchedule from "./schedule";
import renderFooter from "./footer";
import renderOpponentLogos from "./opponent-logos";
import renderScheduleYAxis from "./schedule-y-axis";
import renderRankings from "./rankings";
import renderRankingsYAxis from "./rankings-y-axis";

const renderChart = (scheduleData: ScheduleData, teamId: TeamId) => {
  // Pre-precess team-specific data derived from schedule.
  //
  const schedule = scheduleData.teams[teamId].schedule.filter(
    (id) => scheduleData.series[id]
  );

  // Metadata render
  //
  const logo = document.querySelector(".team-logo")!;
  logo.setAttribute("src", teamLogoFromId(teamId));

  // Render base svg
  //
  // const container = document.querySelector(".team-chart")!;
  // container.innerHTML = "";

  // const svg = d3
  //   .create("svg")
  //   .attr("width", CHART_WIDTH + CHART_PADDING)
  //   .attr("height", CHART_HEIGHT + CHART_PADDING);

  // const chart = svg.append("g");

  // chart
  //   .attr("width", CHART_WIDTH)
  //   .attr("height", CHART_HEIGHT)
  //   .attr("transform", `translate(${CHART_PADDING / 2}, ${CHART_PADDING / 2})`);

  // Render axes and scale
  //
  const xScale = d3
    .scaleTime()
    .domain([SEASON_START, SEASON_END])
    .range([0, CHART_WIDTH]);

  const scheduleYScale = d3
    .scaleLinear()
    .domain([
      CHART_HEIGHT / WIN_INTERVAL_HEIGHT / 2,
      CHART_HEIGHT / WIN_INTERVAL_HEIGHT / -2,
    ])
    .range([0, CHART_HEIGHT]);

  const rankingsYScale = d3
    .scaleLinear()
    .domain([1, 30])
    .range([0, RANKINGS_HEIGHT - RANKINGS_PADDING]);

  const rankingsYAxisSvg = renderRankingsYAxis(rankingsYScale);
  const rankingsYAxisContainer = document.querySelector(".rankings-y-axis")!;
  rankingsYAxisContainer.innerHTML = "";
  rankingsYAxisContainer.append(rankingsYAxisSvg.node()!);

  const rankingsSvg = renderRankings(
    teamId,
    scheduleData,
    xScale,
    rankingsYScale
  );
  const rankingsContainer = document.querySelector(".rankings")!;
  rankingsContainer.innerHTML = "";
  rankingsContainer.append(rankingsSvg.node()!);

  const logosSvg = renderOpponentLogos(teamId, scheduleData, xScale);
  const logosContainer = document.querySelector(".opponent-logos")!;
  logosContainer.innerHTML = "";
  logosContainer.append(logosSvg.node()!);

  const scheduleYAxisSvg = renderScheduleYAxis(scheduleYScale);
  const scheduleYAxisContainer = document.querySelector(".schedule-y-axis")!;
  scheduleYAxisContainer.innerHTML = "";
  scheduleYAxisContainer.append(scheduleYAxisSvg.node()!);

  const scheduleSvg = renderSchedule(
    teamId,
    scheduleData,
    xScale,
    scheduleYScale
  );
  const scheduleContainer = document.querySelector(".schedule")!;
  scheduleContainer.innerHTML = "";
  scheduleContainer.append(scheduleSvg.node()!);

  const footerSvg = renderFooter(teamId, scheduleData, xScale);
  const footerContainer = document.querySelector(".footer")!;
  footerContainer.innerHTML = "";
  footerContainer.append(footerSvg.node()!);

  const container = document.querySelector(".team-chart")! as HTMLElement;
  container.style.gridTemplateColumns = `${Y_AXIS_WIDTH}px ${CHART_WIDTH}px`;
};

export default renderChart;

//
// Extras / experiments
//

// Travel aggregate records
// chart
//   .append("g")
//   .selectAll()
//   .data(travelSchedule)
//   .join("rect")
//   .attr(
//     "width",
//     (block: TravelScheduleBlock) => xScale(block.end) - xScale(block.start)
//   )
//   .style("fill", (block: TravelScheduleBlock) =>
//     seriesOutcomeColor(teamId, scheduleData.series[block.series[0]])
//   )
//   .attr("x", (block: TravelScheduleBlock) => xScale(block.start))
//   .attr("height", (block: TravelScheduleBlock) => {
//     const recordChange = block.outcome[1] - block.outcome[0];
//     // console.log(block.outcome);
//     return WIN_INTERVAL_HEIGHT * Math.abs(recordChange) || 1;
//   })
//   .attr("y", (block: TravelScheduleBlock) => {
//     const recordChange = block.outcome[1] - block.outcome[0];

//     const current = rollingY;
//     rollingY += recordChange * WIN_INTERVAL_HEIGHT;

//     return (
//       current + (recordChange < 0 ? recordChange * WIN_INTERVAL_HEIGHT : 0)
//     );
//   });

// rollingY = FIVE_HUNDRED_RECORD_Y;

// const recordLineGenerator = d3
//   .line<number>()
//   .x((id: SeriesId) => xScale(scheduleData.series[id].start) + 20)
//   .y((id: SeriesId) => {
//     const outcome = seriesOutcome(teamId, scheduleData.series[id]);
//     const recordChange = outcome[1] - outcome[0];
//     rollingY += recordChange * WIN_INTERVAL_HEIGHT;

//     return rollingY;
//   });

// chart
//   .append("path")
//   .attr("d", recordLineGenerator(schedule))
//   .attr("fill", "none")
//   .attr("stroke", "rgba(255, 255, 255, 0.5)")
//   .attr("stroke-width", "2px");

// Results-layout
//
// let cumulativeWinLoss = 0;

// d3.select('.record')
//   .attr('d', recordLineGenerator(schedule))
//   .attr('fill', 'none')
//   .attr('stroke', 'gray')
//   .attr('stroke-width', '1px');

// sos layout
//
// const scaleWinLoss = (wins: number, losses: number, games: number) => {
//   if (losses == 0) {
//     return [games, 0]
//   }

//   const winPct = wins / (wins + losses);
//   return [
//     Math.round(winPct * games),
//     games - Math.round(winPct * games)
//   ];
// }

// let cumulativeOppWins = 0;
// let cumulativeOppLosses = 0;
// let gamesPlayed = 0;

// const sosLineGenerator = d3.line<SeriesId>()
//   .x((d: SeriesId) => xScale(scheduleData.series[d].start))
//   .y((d: SeriesId) => {
//     const series = scheduleData.series[d];
//     const isHome = series.home[0] === teamId;
//     const opponent = isHome ? series.away[0] : series.home[0];
//     const seriesLength = series.res[0] + series.res[1] || 3;

//     cumulativeOppWins += scheduleData.teams[opponent].record[0] * seriesLength;
//     cumulativeOppLosses += scheduleData.teams[opponent].record[1] * seriesLength;
//     gamesPlayed += seriesLength;

//     const [scaledWins, scaledLosses] = scaleWinLoss(cumulativeOppWins, cumulativeOppLosses, gamesPlayed);

//     return yScale(scaledWins - scaledLosses);
//   });

// svg.append('path')
//   .attr('d', sosLineGenerator(schedule))
//   .attr('fill', 'none')
//   .attr('stroke', 'red')
//   .attr('stroke-width', '2px');

// cumulativeOppWins = 0
// cumulativeOppLosses = 0
// gamesPlayed = 0

// const scaledSosLineGenerator = d3.line<SeriesId>()
//   .x((d: SeriesId) => xScale(scheduleData.series[d].start))
//   .y((d: SeriesId) => {
//     const series = scheduleData.series[d];
//     const isHome = series.home[0] === teamId;
//     const opponent = isHome ? series.away : series.home;
//     const seriesLength = series.res[0] + series.res[1];

//     cumulativeOppWins += opponent[1] * seriesLength;
//     cumulativeOppLosses += opponent[2] * seriesLength;
//     gamesPlayed += seriesLength;

//     const [scaledWins, scaledLosses] = scaleWinLoss(cumulativeOppWins, cumulativeOppLosses, gamesPlayed);

//     return yScale(scaledWins - scaledLosses);
//   })
//   .defined(d => scheduleData.series[d].res[0] || scheduleData.series[d].res[1]);

// svg.append('path')
//   .attr('d', scaledSosLineGenerator(schedule))
//   .attr('fill', 'none')
//   .attr('stroke', 'green')
//   .attr('stroke-width', '2px');
