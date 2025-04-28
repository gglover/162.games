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
} from "./constants";

const renderScheduleChart = (scheduleData: ScheduleData, teamId: TeamId) => {
  // Pre-precess team-specific data derived from schedule.
  //
  const schedule = scheduleData.teams[teamId].schedule.filter(
    (id) => scheduleData.series[id]
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

  // Render base svg
  //
  const container = document.querySelector(".team-chart")!;
  container.innerHTML = "";

  const svg = d3
    .create("svg")
    .attr("width", CHART_WIDTH + CHART_PADDING)
    .attr("height", CHART_HEIGHT + CHART_PADDING);

  const chart = svg.append("g");

  chart
    .attr("width", CHART_WIDTH)
    .attr("height", CHART_HEIGHT)
    .attr("transform", `translate(${CHART_PADDING / 2}, ${CHART_PADDING / 2})`);

  // Render axes and scale
  //
  const xScale = d3
    .scaleTime()
    .domain([SEASON_START, SEASON_END])
    .range([0, CHART_WIDTH]);

  const yScale = d3
    .scaleLinear()
    .domain([
      CHART_HEIGHT / WIN_INTERVAL_HEIGHT / -2,
      CHART_HEIGHT / WIN_INTERVAL_HEIGHT / 2,
    ])
    .range([0, CHART_HEIGHT]);

  // @ts-ignore
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));

  chart
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(10, ${CHART_HEIGHT - 20})`)
    .call(xAxis);

  const yAxis = d3.axisLeft(yScale);

  chart
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(${CHART_WIDTH}, 0)`)
    .call(yAxis);

  // Travel blocks
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
    .attr("height", CHART_HEIGHT - 120)
    .attr("y", 90);

  // 500 Record
  chart
    .append("line")
    .attr("x1", 0)
    .attr("x2", CHART_WIDTH)
    .attr("y1", FIVE_HUNDRED_RECORD_Y)
    .attr("y2", FIVE_HUNDRED_RECORD_Y)
    .style("stroke-dasharray", "5,3")
    .style("stroke", "gray");

  chart
    .append("line")
    .attr("x1", 0)
    .attr("x2", CHART_WIDTH)
    .attr("y1", 35)
    .attr("y2", 35)
    .style("stroke", "gray");

  chart
    .append("line")
    .attr("x1", 0)
    .attr("x2", CHART_WIDTH)
    .attr("y1", CHART_HEIGHT - 45)
    .attr("y2", CHART_HEIGHT - 45)
    .style("stroke", "gray");

  let rollingY = FIVE_HUNDRED_RECORD_Y - 100;

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

  rollingY = FIVE_HUNDRED_RECORD_Y;

  // Series
  chart
    .append("g")
    .selectAll()
    .data(schedule)
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

  rollingY = FIVE_HUNDRED_RECORD_Y;

  // Hot or not
  chart
    .append("g")
    .selectAll()
    .data(schedule)
    .join("text")
    .attr("x", (id: SeriesId) => xScale(scheduleData.series[id].start))
    .text((id: SeriesId) => {
      const opponent = opponentId(teamId, scheduleData.series[id]);

      const dateIndex = scheduleData.series[id].start
        .toISOString()
        .slice(0, 10);
      const records = scheduleData.records[dateIndex][opponent];

      if (records[4] - records[5] >= 2) {
        return "🔥";
      } else if (records[4] - records[5] <= -2) {
        return "❄️";
      }

      return "";
    })
    .attr("font-size", (id: SeriesId) => {
      const opponent = opponentId(teamId, scheduleData.series[id]);

      const dateIndex = scheduleData.series[id].start
        .toISOString()
        .slice(0, 10);
      const records = scheduleData.records[dateIndex][opponent];

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

  // Hot or not
  chart
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
    .attr("y", CHART_HEIGHT - 30);

  // console.log(scheduleData);

  // const rankScale = d3.scaleSequential(d3.schemeRdGy[10]);
  const rankScale = d3.scaleSequential(d3.interpolateRdGy);
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

      return rankScale(records[6] / 30);
    })
    .attr("height", (id: SeriesId) => {
      // const opponent = opponentId(teamId, scheduleData.series[id]);

      // const dateIndex = scheduleData.series[id].start.toISOString().slice(0, 10);
      // const records = scheduleData.records[dateIndex][opponent];

      // return (31 - records[6]) * 1.5;
      return 8;
    })
    .attr("x", (id: SeriesId) => xScale(scheduleData.series[id].start))
    .attr("y", (id: SeriesId) => {
      const opponent = opponentId(teamId, scheduleData.series[id]);

      const dateIndex = scheduleData.series[id].start
        .toISOString()
        .slice(0, 10);
      const records = scheduleData.records[dateIndex][opponent];

      return 80 - (31 - records[6]) * 1.5;
    })
    .attr("width", 8)
    .join("text")
    .text("30");

  // Logos
  chart
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
    .attr("y", 20);

  container.append(svg.node()!);
};

export default renderScheduleChart;

//
// Extras / experiments
//

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
