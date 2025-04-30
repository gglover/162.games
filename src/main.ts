import "./style.css";
import data from "./data.json";
import { ScheduleData, Series, TeamId } from "./interfaces";
import renderChart from "./chart/container";
import renderSquare from "./chart/square";
import { dateToRecordsKey } from "./utils";

// Core JSON data preprocessing (Global, one-time)
//
const parseScheduleData = (json: any): ScheduleData => {
  // NEXT:
  //
  // Fix rankings to aggregate and go day by day in rankings curve.
  //
  for (let value of Object.values(json.series as Series)) {
    value.start = new Date(value.start);

    const end = new Date(value.end);
    end.setDate(end.getDate() + 1);
    value.end = end;
  }

  json.daysWithGamesPlayed = Object.keys(json.records)
    .map((isoDateKey) => new Date(isoDateKey))
    .sort((a, b) => a - b);

  return json as ScheduleData;
};

const scheduleData = parseScheduleData(data);

const DEFAULT_TEAM_ID = "136";

const renderTeamChart = (id: TeamId) => {
  // season
  // teamId
  // scheduleData
  renderChart(scheduleData, id);
};

// TODO:
// Temp logic til we figure out hosting / routing
//
// Gus note: I think that based off of how much markup is generated this could work well as a simple SPA...
//
const teamLinks = document.querySelector(".team-links");
for (let teamId in scheduleData.teams) {
  const teamLink = document.createElement("a");

  teamLink.innerHTML = scheduleData.teams[teamId].code;
  teamLink.addEventListener("click", () => {
    renderTeamChart(teamId);
  });

  teamLinks?.appendChild(teamLink);
}

// renderTeamChart(DEFAULT_TEAM_ID);

// const todayKey = dateToRecordsKey(new Date());
const todayKey = "2024-09-30";
renderSquare(scheduleData.records[todayKey]);
