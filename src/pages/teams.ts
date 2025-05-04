import renderChart from "../chart/container";
import { fetchScheduleData } from "../schedule";

// TODO parse from URL
let year = "2024";
let team = "136";

const renderTeamsPage = async () => {
  const scheduleData = await fetchScheduleData(year);
  // TODO:
  // Temp logic til we figure out hosting / routing
  //
  // const teamLinks = document.querySelector(".team-links");
  // for (let teamId in scheduleData.teams) {
  //   const teamLink = document.createElement("a");

  //   teamLink.innerHTML = scheduleData.teams[teamId].code;
  //   teamLink.addEventListener("click", () => {
  //     team = teamId;
  //     renderTeamsPage();
  //   });

  //   teamLinks?.appendChild(teamLink);
  // }

  // Year select
  //
  const yearSelect = document.querySelector(".year-select")!;
  yearSelect.addEventListener("change", (event) => {
    const select = event.target as HTMLSelectElement;

    year = select.value;
    renderTeamsPage();
  });

  renderChart(scheduleData, team);
};

export default renderTeamsPage;
