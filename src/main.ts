import "./style.css";
import renderTeamsPage from "./pages/teams";

if (window.location.pathname.includes("teams")) {
  renderTeamsPage();
} else if (window.location.pathname.includes("about")) {
  // no-op
} else {
  // render home
  // const todayKey = "2025-04-30";
  // renderSquare(scheduleData.records[todayKey]);
}

// renderTeamChart(DEFAULT_TEAM_ID);
// const todayKey = dateToRecordsKey(new Date());
