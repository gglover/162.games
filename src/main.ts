import "./style.css";
import data from "./data_2024.json";
import { ScheduleData, Series, TeamId } from "./interfaces";
import renderScheduleChart from "./chart/schedule";

// Core JSON data preprocessing (Global, one-time)
//
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

const scheduleData = parseScheduleData(data);

const DEFAULT_TEAM_ID = 136;
const DEFAULT_SEASON_ID = 2025;

const renderTeamChart = (id: TeamId) => {
  // season
  // teamId
  // scheduleData
  renderScheduleChart(scheduleData, parseInt(id));
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
