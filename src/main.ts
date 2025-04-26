import "./style.css";
import data from "./data.json";
import * as d3 from "d3";
import { SVGS, type LogoKeys } from "./svgs";

type SeriesId = number;
type TeamId = number;

interface Team {
  name: string;
  code: string;
  schedule: SeriesId[];
  record: [number, number];
}

interface Series {
  home: TeamId;
  away: TeamId;
  start: Date;
  end: Date;
  scores: number[];
}

interface ScheduleData {
  teams: Record<TeamId, Team>;
  series: Record<SeriesId, Series>;
  records: Record<string, HistoricalRecord>;
}

enum Location {
  Home = "Home",
  Away = "Away",
}

interface TravelScheduleBlock {
  location: Location;
  start: Date;
  end: Date;
  series: SeriesId[];
  outcome: [number, number];
}

interface HistoricalRecord {
  [teamId: TeamId]: [number, number, number, number, number, number];
}

// # {
//   #   [date]: {
//   #       [teamId]: [wins, losses, L10wins, L10losses...]
//   #   }
//   # }

const SEASON_START = new Date(2024, 2, 20);
const SEASON_END = new Date(2024, 9, 1);

const CHART_HEIGHT = 600;
const FIVE_HUNDRED_RECORD_Y = CHART_HEIGHT / 2;
const CHART_WIDTH = 800;
const CHART_PADDING = 10;
const SERIES_SCALE = 3.0;
const DAY_LENGTH_MS = 1000 * 60 * 60 * 24;
const TEAM_ID = 146;

const parseScheduleData = (json: any): ScheduleData => {
  for (let [key, value] of Object.entries(json.teams)) {
    delete json.teams[key];
    json.teams[parseInt(key)] = value;
  }

  for (let date in json.records) {
    for (let [key, value] of Object.entries(json.records[date])) {
      delete json.records[date][key];
      json.records[date][parseInt(key)] = value;
    }
  }

  for (let [key, value] of Object.entries(json.series as Series)) {
    delete json.series[key];
    json.series[parseInt(key)] = value;

    value.start = new Date(value.start);

    const end = new Date(value.end);
    end.setDate(end.getDate() + 1);
    value.end = end;
  }

  return json as ScheduleData;
};

const teamLogoFromId = (id: TeamId): string => SVGS[`LOGO_${id}`];

const opponentId = (team: TeamId, series: Series): TeamId =>
  series.home === team ? series.away : series.home;

const seriesOutcome = (team: TeamId, series: Series) => {
  let outcome: [number, number] = [0, 0];

  for (let i = 0; i < series.scores.length; i += 2) {
    if (series.scores[i] > series.scores[i + 1]) {
      outcome[0]++;
    } else {
      outcome[1]++;
    }
  }

  if (series.home != team) {
    outcome.reverse();
  }

  return outcome;
};

const seriesOutcomeColor = (team: TeamId, series: Series) => {
  const outcome = seriesOutcome(team, series);

  if (outcome[1] === 0) {
    return "oklch(0.532 0.157 131.589)";
  } else if (outcome[0] > outcome[1]) {
    return "oklch(0.768 0.233 130.85)";
  } else if (outcome[0] === outcome[1]) {
    return "oklch(0.6 0 0)";
  } else if (outcome[0] === 0) {
    return "oklch(0.505 0.213 27.518)";
  } else {
    return "oklch(0.704 0.191 22.216)";
  }
};

const scheduleData = parseScheduleData(data);

const container = document.querySelector(".team-chart")!;

const svg = d3
  .create("svg")
  .attr("width", CHART_WIDTH + CHART_PADDING)
  .attr("height", CHART_HEIGHT + CHART_PADDING);

const chart = svg.append("g");

chart
  .attr("width", CHART_WIDTH)
  .attr("height", CHART_HEIGHT)
  .attr("transform", `translate(${CHART_PADDING / 2}, ${CHART_PADDING / 2})`);

const xScale = d3
  .scaleTime()
  .domain([SEASON_START, SEASON_END])
  .range([0, CHART_WIDTH]);

// @ts-ignore
const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%b"));

chart
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", `translate(10, ${CHART_HEIGHT - 20})`)
  .call(xAxis);

const yScale = d3.scaleLinear().domain([10, -10]).range([0, CHART_HEIGHT]);

const yAxis = d3.axisRight(yScale);

chart.append("g").call(yAxis);

const schedule = scheduleData.teams[TEAM_ID].schedule.filter(
  (id) => scheduleData.series[id]
);

const travelSchedule: TravelScheduleBlock[] = [];
let currentLeg: TravelScheduleBlock | null = null;

for (let seriesId of schedule) {
  const series = scheduleData.series[seriesId];
  const location = series.home === TEAM_ID ? Location.Home : Location.Away;

  if (currentLeg && currentLeg.location === location) {
    currentLeg.series.push(seriesId);

    const outcome = seriesOutcome(TEAM_ID, scheduleData.series[seriesId]);
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
      outcome: seriesOutcome(TEAM_ID, scheduleData.series[seriesId]),
    };
  }
}

console.log(travelSchedule);

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
    block.location === Location.Home ? "#f0f0f0" : "#f7f7f7"
  )
  .attr("x", (block: TravelScheduleBlock) => xScale(block.start))
  .attr("height", CHART_HEIGHT - 40)
  .attr("y", 17);

// 500 Record
chart
  .append("line")
  .attr("x1", 0)
  .attr("x2", CHART_WIDTH)
  .attr("y1", FIVE_HUNDRED_RECORD_Y)
  .attr("y2", FIVE_HUNDRED_RECORD_Y)
  .style("stroke-dasharray", "5,3")
  .style("stroke", "gray");

let rollingY = FIVE_HUNDRED_RECORD_Y - 100;

// Travel aggregate records
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
    seriesOutcomeColor(TEAM_ID, scheduleData.series[block.series[0]])
  )
  .attr("x", (block: TravelScheduleBlock) => xScale(block.start))
  .attr("height", (block: TravelScheduleBlock) => {
    const recordChange = block.outcome[1] - block.outcome[0];
    // console.log(block.outcome);
    return 5 * Math.abs(recordChange) || 1;
  })
  .attr("y", (block: TravelScheduleBlock) => {
    const recordChange = block.outcome[1] - block.outcome[0];

    const current = rollingY;
    rollingY += recordChange * 5;

    return current + (recordChange < 0 ? recordChange * 5 : 0);
  });

rollingY = FIVE_HUNDRED_RECORD_Y;

// Series
chart
  .append("g")
  .selectAll()
  .data(schedule)
  .join("rect")
  .attr("height", (id: SeriesId) => {
    const outcome = seriesOutcome(TEAM_ID, scheduleData.series[id]);
    const recordChange = outcome[1] - outcome[0];

    return 5 * Math.abs(recordChange) || 1;
  })
  .attr(
    "width",
    (id: SeriesId) =>
      xScale(scheduleData.series[id].end) -
      xScale(scheduleData.series[id].start)
  )
  .style("fill", (id: SeriesId) =>
    seriesOutcomeColor(TEAM_ID, scheduleData.series[id])
  )
  .attr("x", (id: SeriesId) => xScale(scheduleData.series[id].start))
  .attr("y", (id: SeriesId) => {
    const outcome = seriesOutcome(TEAM_ID, scheduleData.series[id]);
    const recordChange = outcome[1] - outcome[0];

    const current = rollingY;
    rollingY += recordChange * 5;

    return current + (recordChange < 0 ? recordChange * 5 : 0);
  });

// Logos
chart
  .append("g")
  .selectAll()
  .data(schedule)
  .join("image")
  .attr("x", (id: SeriesId) => xScale(scheduleData.series[id].start))
  .attr("xlink:href", (id: SeriesId) =>
    teamLogoFromId(opponentId(TEAM_ID, scheduleData.series[id]))
  )
  .attr("height", 12)
  .attr("width", 12)
  .attr("y", 20);

// .attr('href', SVGS.LOGO_108)
// .attr('height', 30)
// .attr('width', 30)

// svg.append('div')
//   .selectAll()
//   .data(schedule)

//   .attr('width', (id: SeriesId) => xScale(scheduleData.series[id].end) - xScale(scheduleData.series[id].start))

container.append(svg.node()!);

// Results-layout
//
// let cumulativeWinLoss = 0;

// const recordLineGenerator = d3.line<number>()
//   .x((d: SeriesId) => xScale(scheduleData.series[d].start))
//   .y((d: SeriesId) => {
//     const res = scheduleData.series[d].res;
//     const isHome = scheduleData.series[d].home[0] === TEAM_ID;
//     cumulativeWinLoss += isHome ? res[0] - res[1] : res[1] - res[0];

//     return yScale(cumulativeWinLoss);
//   })
//   .defined((d: SeriesId) => scheduleData.series[d].res[0] || scheduleData.series[d].res[1])

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
//     const isHome = series.home[0] === TEAM_ID;
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
//     const isHome = series.home[0] === TEAM_ID;
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
