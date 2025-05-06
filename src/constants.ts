import teamsJson from "../teams.json";

export const CHART_HEIGHT = 400;
export const CHART_WIDTH = 900;
export const RANKINGS_HEIGHT = 150;
export const RANKINGS_PADDING = 10;
export const LOGOS_HEIGHT = 25;
export const FOOTER_HEIGHT = 50;

export const FIVE_HUNDRED_RECORD_Y = CHART_HEIGHT / 2;
export const WIN_INTERVAL_HEIGHT = 6;
export const Y_AXIS_WIDTH = 30;

export const SQUARE_SIZE = 400;
export const SQUARE_PADDING = 30;

export const SEASONS = ["2025", "2024", "2023"];

export const TEAMS = Object.fromEntries(
  teamsJson.map((team) => [team.id, team])
);
