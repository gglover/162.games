import renderChart from "../chart/container";
import { fetchScheduleData } from "../schedule";

const renderTeamsPage = async () => {
  const scheduleData = await fetchScheduleData("2025");
  // TODO:
  // Temp logic til we figure out hosting / routing
  //
  const teamLinks = document.querySelector(".team-links");
  for (let teamId in scheduleData.teams) {
    const teamLink = document.createElement("a");

    teamLink.innerHTML = scheduleData.teams[teamId].code;
    teamLink.addEventListener("click", () => {
      renderChart(scheduleData, teamId);
    });

    teamLinks?.appendChild(teamLink);
  }

  renderChart(scheduleData, "136");
};

export default renderTeamsPage;
