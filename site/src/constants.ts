import teamsJson from "../../data/teams.json";
import { Division, League, Team } from "./interfaces";

export const ASSETS_BASE_PATH = "https://d48vmuz4fbfgs.cloudfront.net";

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

export const WC3_COLOR = "#d0d0d0";
export const DIVISION_LEADER_COLOR = "#d0d050";

export const SERIES_HIGHLIGHT_PATTERN_DEF = "#series-highlight";

export const SEASONS = ["2025", "2024", "2023", "2022"];

const today = new Date();
today.setHours(0, 0, 0, 0);
export const TODAY = today;

export const PLAYOFF_INDEX: Record<League | Division, number> = {
  AL: 0,
  NL: 1,
  "AL East": 2,
  "AL Central": 3,
  "AL West": 4,
  "NL East": 5,
  "NL Central": 6,
  "NL West": 7,
};

export const TEAMS = Object.fromEntries(
  teamsJson.map((team) => [team.id, team as Team])
);
